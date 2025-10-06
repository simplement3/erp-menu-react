import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PedidosService } from './pedidos.service';
import { PedidosController } from './pedidos.controller';
import { Pedido } from './entities/pedido.entity';
import { OrdersGateway } from '../websockets/orders.gateway'; // Agrega este import para fixear el siguiente error

@Module({
  imports: [TypeOrmModule.forFeature([Pedido])], // Si ya tenés imports, agrega esto al array existente (ej: imports: [..., TypeOrmModule.forFeature([Pedido])])
  providers: [PedidosService, OrdersGateway], // Agrega OrdersGateway aquí
  controllers: [PedidosController],
})
export class PedidosModule {}
