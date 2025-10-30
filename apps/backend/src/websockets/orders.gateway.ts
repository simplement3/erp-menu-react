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
  cors: { origin: 'http://localhost:5173', credentials: true },
  transports: ['websocket'],
  path: '/socket.io',
})
export class OrdersGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private activeClients = new Map<string, number>(); // client.id → id_negocio

  handleConnection(client: Socket) {
    console.log(`🟢 Cliente conectado: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`🔴 Cliente desconectado: ${client.id}`);
    this.activeClients.delete(client.id);
  }

  @SubscribeMessage('join')
  handleJoin(client: Socket, { id_negocio }: { id_negocio: number }) {
    if (!id_negocio) {
      client.emit('error', 'id_negocio es requerido para unirse');
      return;
    }

    const room = `negocio_${id_negocio}`;
    void client.join(room);
    this.activeClients.set(client.id, id_negocio);

    console.log(`📡 Cliente ${client.id} unido a sala ${room}`);
    client.emit('joinedRoom', `Unido a sala ${id_negocio}`);
  }

  notifyNewOrder(id_negocio: number, order: Pedido) {
    const room = `negocio_${id_negocio}`;
    this.server.to(room).emit('nuevo-pedido', {
      id: order.id,
      cliente: order.cliente,
      telefono: order.telefono,
      direccion: order.direccion,
      tipo_pedido: order.tipo_pedido,
      productos: order.productos,
      total: order.total,
      fecha: order.fecha,
      estado: order.estado,
    });
  }

  // NUEVO: emisión cuando cambia el estado
  notifyPedidoActualizado(id_negocio: number, order: Pedido) {
    const room = `negocio_${id_negocio}`;
    this.server.to(room).emit('pedido-actualizado', {
      id: order.id,
      estado: order.estado,
      fecha: order.fecha,
      total: order.total,
    });
  }
}
