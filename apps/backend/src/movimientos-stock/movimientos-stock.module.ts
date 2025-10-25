import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovimientoStock } from './entities/movimiento-stock.entity';
import { MovimientosStockService } from './movimientos-stock.service';

@Module({
  imports: [TypeOrmModule.forFeature([MovimientoStock])],
  providers: [MovimientosStockService],
  exports: [MovimientosStockService],
})
export class MovimientosStockModule {}
