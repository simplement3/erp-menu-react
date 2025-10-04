// apps/backend/src/orders/orders.gateway.ts
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: true })
export class OrdersGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('joinRoom')
  handleJoin(@MessageBody() room: string) {
    // Únete a una room por id_negocio
  }

  // Método para emitir nueva orden
  sendNewOrder(order: any, room: string) {
    this.server.to(room).emit('newOrder', order);
  }
}
