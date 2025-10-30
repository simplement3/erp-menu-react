import { Module } from '@nestjs/common';
import { ReportesController } from './reportes.controller';
import { PedidosService } from '../pedidos/pedidos.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pedido } from '../pedidos/entities/pedido.entity';
import { PlatilloIngrediente } from '../platillos/entities/platillo-ingrediente.entity';
import { Ingrediente } from '../ingredientes/entities/ingrediente.entity';
import { Inventario } from '../inventario/entities/inventario.entity';
import { MovimientoStock } from '../inventario/entities/movimiento-stock.entity';
import { OrdersGateway } from '../websockets/orders.gateway';
import { MailService } from '../notifications/mail.service';

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
  controllers: [ReportesController],
  providers: [PedidosService, OrdersGateway, MailService],
})
export class ReportesModule {}
