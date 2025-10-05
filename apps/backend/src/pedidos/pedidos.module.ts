import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PedidosController } from './pedidos.controller';
import { PedidosService } from './pedidos.service'; // Importa el service
import { Pedido } from './entities/pedido.entity'; // Importa la entity (crea si no existe)
import { WebsocketsModule } from '../websockets/websockets.module'; // Importa el módulo WebSockets

@Module({
  imports: [
    TypeOrmModule.forFeature([Pedido]), // Registra la entity para repos
    WebsocketsModule, // Agrega aquí para inyectar en el service
  ],
  controllers: [PedidosController],
  providers: [PedidosService], // Agrega aquí el service
})
export class PedidosModule {}
