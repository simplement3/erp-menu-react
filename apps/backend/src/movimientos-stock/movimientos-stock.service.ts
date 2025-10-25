import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MovimientoStock } from './entities/movimiento-stock.entity';

@Injectable()
export class MovimientosStockService {
  constructor(
    @InjectRepository(MovimientoStock)
    private readonly repo: Repository<MovimientoStock>,
  ) {}

  async registrarSalida(
    idAlmacen: number,
    idInsumo: number,
    cantidad: number,
    referencia: string,
  ) {
    const movimiento = this.repo.create({
      id_almacen: idAlmacen,
      id_insumo: idInsumo,
      cantidad: -Math.abs(cantidad), // siempre negativo para salidas
      tipo: 'SALIDA',
      referencia,
    });
    return this.repo.save(movimiento);
  }
}
