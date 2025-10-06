import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pedido } from './entities/pedido.entity';
import { OrdersGateway } from '../websockets/orders.gateway';
import { CreatePedidoDto } from './dto/create-pedido.dto'; // Agrega esto

@Injectable()
export class PedidosService {
  constructor(
    @InjectRepository(Pedido)
    private pedidoRepository: Repository<Pedido>,
    private ordersGateway: OrdersGateway,
  ) {}

  async createOrder(createPedidoDto: CreatePedidoDto): Promise<Pedido> {
    // Crea la entity desde el DTO validado
    const newOrder = this.pedidoRepository.create(createPedidoDto);
    const savedOrder = await this.pedidoRepository.save(newOrder);

    if (typeof savedOrder.id_negocio !== 'number') {
      throw new Error('id_negocio no es válido');
    }
    this.ordersGateway.notifyNewOrder(savedOrder.id_negocio, savedOrder);

    return savedOrder;
  }

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
