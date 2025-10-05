import { Module } from '@nestjs/common';
import { OrdersGateway } from './orders.gateway'; // Corrige a path relativo local (asumiendo que orders.gateway.ts está en la misma carpeta websockets/)

@Module({
  providers: [OrdersGateway],
  exports: [OrdersGateway], // Ya está bien
})
export class WebsocketsModule {}
