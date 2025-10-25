import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Pedido } from '../pedidos/entities/pedido.entity';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:5173',
    credentials: true, // <-- Habilita credenciales
  },
})
export class OrdersGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }

  @SubscribeMessage('join')
  handleJoin(client: Socket, { id_negocio }: { id_negocio: number }) {
    const room = `negocio_${id_negocio}`;
    void client.join(room);
    client.emit('joinedRoom', `Unido a room ${id_negocio}`);
  }

  notifyNewOrder(id_negocio: number, order: Pedido) {
    this.server.to(`negocio_${id_negocio}`).emit('nuevo-pedido', {
      id: order.id,
      cliente: order.cliente,
      telefono: order.telefono,
      direccion: order.direccion,
      tipo_pedido: order.tipo_pedido,
      productos: order.productos,
      total: order.total,
      fecha: order.fecha,
    });
  }
}
