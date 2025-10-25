import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pedido } from './entities/pedido.entity';
import { OrdersGateway } from '../websockets/orders.gateway';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { PlatilloIngrediente } from '../platillos/entities/platillo-ingrediente.entity';
import { Ingrediente } from '../ingredientes/entities/ingrediente.entity';
import { Inventario } from '../inventario/entities/inventario.entity';
import { MovimientoStock } from '../inventario/entities/movimiento-stock.entity';

@Injectable()
export class PedidosService {
  private readonly logger = new Logger(PedidosService.name);

  constructor(
    @InjectRepository(Pedido)
    private readonly pedidoRepository: Repository<Pedido>,

    @InjectRepository(PlatilloIngrediente)
    private readonly recetaRepository: Repository<PlatilloIngrediente>,

    @InjectRepository(Ingrediente)
    private readonly ingredienteRepository: Repository<Ingrediente>,

    @InjectRepository(Inventario)
    private readonly inventarioRepository: Repository<Inventario>,

    @InjectRepository(MovimientoStock)
    private readonly movStockRepository: Repository<MovimientoStock>,

    private readonly ordersGateway: OrdersGateway,
  ) {}

  /**
   * Crea pedido y descuenta ingredientes por insumo.
   * - Transacción completa.
   * - Lock pesimista en inventario.
   * - Registro en movimientos_stock.
   * - Rollback seguro ante error.
   */
  async createOrder(createPedidoDto: CreatePedidoDto): Promise<Pedido> {
    const queryRunner =
      this.pedidoRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (!createPedidoDto?.productos?.length)
        throw new BadRequestException('productos no puede estar vacío');
      if (!createPedidoDto.id_almacen)
        throw new BadRequestException('id_almacen es requerido');

      const idAlmacen = createPedidoDto.id_almacen;

      this.logger.log(
        `Creando pedido para negocio=${createPedidoDto.id_negocio}, almacen=${idAlmacen}`,
      );

      const newOrder = this.pedidoRepository.create(createPedidoDto);
      const savedOrder = await queryRunner.manager.save(newOrder);

      // Procesar productos del pedido
      for (const producto of createPedidoDto.productos) {
        const receta = await queryRunner.manager.find(PlatilloIngrediente, {
          where: { platillo: { id: producto.id_producto } },
          relations: ['ingrediente'],
        });

        if (!receta.length) {
          this.logger.warn(
            `Platillo ${producto.id_producto} sin receta definida`,
          );
          continue;
        }

        // Validar stock
        for (const item of receta) {
          const ing = item.ingrediente;
          const requerido = this.mulNumeric(item.cantidad, producto.cantidad);

          const inv = await queryRunner.manager.findOne(Inventario, {
            where: { idAlmacen, idInsumo: ing.idInsumo },
            lock: { mode: 'pessimistic_write' },
          });

          if (!inv)
            throw new BadRequestException(
              `Inventario no encontrado para insumo ${ing.idInsumo} en almacén ${idAlmacen}`,
            );

          if (this.ltNumeric(inv.cantidad, requerido))
            throw new BadRequestException(
              `Stock insuficiente de insumo ${ing.nombre} (${ing.idInsumo}): requerido ${requerido}, disponible ${inv.cantidad}`,
            );
        }

        // Descontar y registrar movimiento
        for (const item of receta) {
          const ing = item.ingrediente;
          const requerido = this.mulNumeric(item.cantidad, producto.cantidad);

          const inv = await queryRunner.manager.findOne(Inventario, {
            where: { idAlmacen, idInsumo: ing.idInsumo },
            lock: { mode: 'pessimistic_write' },
          });

          inv.cantidad = this.subNumeric(inv.cantidad, requerido);
          await queryRunner.manager.save(Inventario, inv);

          const mov = this.movStockRepository.create({
            idAlmacen,
            idInsumo: ing.idInsumo,
            tipo: 'SALIDA',
            cantidad: requerido,
            referencia: `Pedido #${savedOrder.id} - platillo ${producto.id_producto}`,
            fecha: new Date(),
          });
          await queryRunner.manager.save(MovimientoStock, mov);
        }
      }

      await queryRunner.commitTransaction();

      this.logger.log(
        `Pedido ${createPedidoDto.id_negocio}-${savedOrder.id} creado correctamente`,
      );

      if (typeof savedOrder.id_negocio === 'number')
        this.ordersGateway.notifyNewOrder(savedOrder.id_negocio, savedOrder);

      return savedOrder;
    } catch (error: unknown) {
      await queryRunner.rollbackTransaction();
      const message =
        error instanceof Error ? error.message : 'Error desconocido';
      this.logger.error(`Error creando pedido: ${message}`);
      throw new InternalServerErrorException(message);
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Lista pedidos de un negocio con filtros de fecha.
   */
  async listOrders(
    idNegocio: number,
    fechaInicio?: string,
    fechaFin?: string,
  ): Promise<Pedido[]> {
    const query = this.pedidoRepository
      .createQueryBuilder('pedido')
      .where('pedido.id_negocio = :idNegocio', { idNegocio });

    if (fechaInicio)
      query.andWhere('pedido.fecha >= :fechaInicio', { fechaInicio });
    if (fechaFin) query.andWhere('pedido.fecha <= :fechaFin', { fechaFin });

    return query.getMany();
  }

  // ---- utilitarios numéricos ----
  private mulNumeric(a: string | number, b: string | number): string {
    return (Number(a) * Number(b)).toString();
  }

  private subNumeric(a: string | number, b: string | number): string {
    return (Number(a) - Number(b)).toString();
  }

  private ltNumeric(a: string | number, b: string | number): boolean {
    return Number(a) < Number(b);
  }
}
