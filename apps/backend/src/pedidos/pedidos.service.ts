import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
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
import { MailService } from '../notifications/mail.service';

@Injectable()
export class PedidosService {
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
    private readonly mailService: MailService,
  ) {}

  /**
   * Crea pedido y descuenta ingredientes por insumo de forma transaccional.
   * - Valida stock.
   * - Descuenta inventario.
   * - Registra movimientos.
   * - Notifica por WebSocket.
   * - Envía correo solo si es delivery.
   */
  async createOrder(createPedidoDto: CreatePedidoDto): Promise<Pedido> {
    const queryRunner =
      this.pedidoRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (!createPedidoDto?.productos?.length) {
        throw new BadRequestException(
          'productos es requerido y no puede estar vacío',
        );
      }
      if (!createPedidoDto.id_almacen) {
        throw new BadRequestException('id_almacen es requerido');
      }

      const idAlmacen = createPedidoDto.id_almacen;

      // 1) Crear pedido
      const newOrder = this.pedidoRepository.create(createPedidoDto);
      const savedOrder = await queryRunner.manager.save(newOrder);

      // 2) Descontar ingredientes
      for (const prod of createPedidoDto.productos) {
        const receta = await queryRunner.manager.find(PlatilloIngrediente, {
          where: { platillo: { id: prod.id_producto } },
          relations: ['ingrediente'],
        });

        if (!receta.length) continue;

        // Validación de stock
        for (const r of receta) {
          const ing = r.ingrediente;
          if (!ing?.idInsumo) {
            throw new BadRequestException(
              `Ingrediente ${ing?.nombre ?? r.ingrediente?.id} sin id_insumo asociado`,
            );
          }

          const requerido = this.mulNumeric(r.cantidad, prod.cantidad);

          const inv = await queryRunner.manager.findOne(Inventario, {
            where: { idAlmacen, idInsumo: ing.idInsumo },
            lock: { mode: 'pessimistic_write' },
          });

          if (!inv) {
            throw new BadRequestException(
              `No existe inventario para insumo ${ing.idInsumo} en almacén ${idAlmacen}`,
            );
          }

          if (this.ltNumeric(inv.cantidad, requerido)) {
            throw new BadRequestException(
              `Stock insuficiente del insumo ${ing.idInsumo}. Requerido: ${requerido}, disponible: ${inv.cantidad}`,
            );
          }
        }

        // Descuento real + movimiento
        for (const r of receta) {
          const ing = r.ingrediente;
          const requerido = this.mulNumeric(r.cantidad, prod.cantidad);

          const inv = await queryRunner.manager.findOne(Inventario, {
            where: { idAlmacen, idInsumo: ing.idInsumo },
            lock: { mode: 'pessimistic_write' },
          });

          if (!inv) continue;

          const nuevoSaldo = this.subNumeric(inv.cantidad, requerido);
          inv.cantidad = nuevoSaldo;

          await queryRunner.manager.save(Inventario, inv);

          const mov = this.movStockRepository.create({
            idAlmacen,
            idInsumo: ing.idInsumo,
            tipo: 'salida',
            cantidad: requerido,
            referencia: `Pedido #${savedOrder.id} - platillo ${prod.id_producto}`,
            fecha: new Date(),
          });
          await queryRunner.manager.save(MovimientoStock, mov);
        }
      }

      await queryRunner.commitTransaction();

      // WebSocket (post-commit)
      if (typeof savedOrder.id_negocio === 'number') {
        this.ordersGateway.notifyNewOrder(savedOrder.id_negocio, savedOrder);
      }

      // ...
      // Enviar correo solo si es delivery
      if (savedOrder.tipo_pedido === 'delivery') {
        try {
          await this.mailService.sendDeliveryConfirmation(
            `${savedOrder.telefono}@sms-gateway.mock`,
            {
              id: savedOrder.id,
              cliente: savedOrder.cliente,
              telefono: savedOrder.telefono,
              direccion: savedOrder.direccion,
              tipo_pedido: savedOrder.tipo_pedido,
              productos: savedOrder.productos,
              total: savedOrder.total,
            },
          );
        } catch {
          console.error('Error enviando correo');
        }
      }
      // ...

      return savedOrder;
    } catch (error: unknown) {
      await queryRunner.rollbackTransaction();
      const message =
        error instanceof Error ? error.message : 'Error desconocido';
      throw new InternalServerErrorException(message);
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Lista pedidos de un negocio con filtros opcionales por fecha.
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

  // ---------- utilitarios NUMERIC ----------
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
