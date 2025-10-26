import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PagosController } from './pagos.controller';
import { Pedido } from '../pedidos/entities/pedido.entity';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [TypeOrmModule.forFeature([Pedido]), NotificationsModule],
  controllers: [PagosController],
})
export class PagosModule {}
