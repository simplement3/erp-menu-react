import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({ cors: true })
export class OrdersGateway {
  @WebSocketServer() server: Server;

  @SubscribeMessage('joinRoom')
  handleRoomJoin(
    // Quita 'async' —no es necesario
    @MessageBody() idNegocio: number,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(`negocio_${idNegocio}`);
    // Línea 20-21: Vuelve a 'void' (fix floating-promises); disable regla si persiste

    void client.emit('joinedRoom', `Unido a room negocio_${idNegocio}`);
  }

  notifyNewOrder(idNegocio: number, order: any) {
    this.server.to(`negocio_${idNegocio}`).emit('nuevoPedido', order);
  }
}
