import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Logger } from '@nestjs/common';
import { Pedido } from '../pedidos/entities/pedido.entity'; // Importa entity tipada

@WebSocketGateway({ cors: true })
export class OrdersGateway {
  @WebSocketServer() server: Server;
  private logger = new Logger('OrdersGateway');

  @SubscribeMessage('join')
  handleRoomJoin(
    @MessageBody() data: { id_negocio: number },
    @ConnectedSocket() client: Socket,
  ) {
    const { id_negocio } = data;
    if (!id_negocio || isNaN(id_negocio)) {
      this.logger.warn(`Join inválido de ${client.id}: id_negocio requerido`);
      void client.emit('error', 'id_negocio debe ser número válido'); // <-- Fix: void para Promise
      return;
    }
    const room = id_negocio.toString();
    client.join(room);
    this.logger.log(`Cliente ${client.id} joined room ${room}`);
    void client.emit('joinedRoom', `Unido a room ${room}`); // <-- Fix: void para Promise
  }

  notifyNewOrder(idNegocio: number, order: Pedido) {
    const room = idNegocio.toString();
    const payload = {
      ...order, // Ahora safe: Pedido tipado con productos: ProductoPedido[]
      items: order.productos, // Mapping opcional para compat
    };
    void this.server.to(room).emit('nuevo-pedido', payload); // <-- Fix: void para server.emit Promise
    this.logger.log(
      `Notif 'nuevo-pedido' enviada a room ${room}: Pedido #${order.id}`,
    );
  }
}
