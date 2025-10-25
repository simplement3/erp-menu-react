import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pedido } from './entities/pedido.entity';
import { PedidosService } from './pedidos.service';
import { PedidosController } from './pedidos.controller';
import { OrdersGateway } from '../websockets/orders.gateway';
import { PlatilloIngrediente } from '../platillos/entities/platillo-ingrediente.entity';
import { Ingrediente } from '../ingredientes/entities/ingrediente.entity';
import { Inventario } from '../inventario/entities/inventario.entity';
import { MovimientoStock } from '../inventario/entities/movimiento-stock.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Pedido,
      PlatilloIngrediente,
      Ingrediente,
      Inventario,
      MovimientoStock,
    ]),
  ],
  controllers: [PedidosController],
  providers: [PedidosService, OrdersGateway],
  exports: [PedidosService],
})
export class PedidosModule {}
