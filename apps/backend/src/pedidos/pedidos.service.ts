import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pedido } from './entities/pedido.entity';
import { OrdersGateway } from '../websockets/orders.gateway';

@Injectable()
export class PedidosService {
  constructor(
    @InjectRepository(Pedido)
    private pedidoRepository: Repository<Pedido>,
    private ordersGateway: OrdersGateway, // Línea ~10: Si warning aquí, es false positive —fix abajo si persiste
  ) {}

  async createOrder(orderData: Partial<Pedido>): Promise<Pedido> {
    // Línea 17: Fix unsafe assignment y unnecessary assertion usando chequeo de tipo
    const newOrder = this.pedidoRepository.create(orderData);
    if (!newOrder) {
      throw new Error('Error al crear el pedido');
    }

    // Línea 18: Fix unsafe assignment con chequeo post-save
    const savedOrder = await this.pedidoRepository.save(newOrder);
    if (!savedOrder) {
      throw new Error('Error al guardar el pedido');
    }

    // Líneas 19/22: Fix unsafe member access y argument con non-null assertion (!) y chequeo
    if (typeof savedOrder.id_negocio !== 'number') {
      throw new Error('id_negocio no es válido');
    }
    this.ordersGateway.notifyNewOrder(savedOrder.id_negocio, savedOrder); // ! afirma non-null

    return savedOrder;
  }

  // Resto del service (listOrders) queda igual
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
}
