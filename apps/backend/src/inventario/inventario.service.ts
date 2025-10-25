import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inventario } from './entities/inventario.entity';

interface InventarioResumen {
  id_almacen: number;
  total_items: number;
  stock_total: number;
}

@Injectable()
export class InventarioService {
  constructor(
    @InjectRepository(Inventario)
    private repo: Repository<Inventario>,
  ) {}

  findAll() {
    return this.repo.find();
  }

  // ✅ Filtra inventario por negocio y tipa el resultado
  async findByNegocio(id_negocio: number): Promise<InventarioResumen[]> {
    const result = await this.repo
      .createQueryBuilder('inv')
      .select('inv.idAlmacen', 'id_almacen')
      .addSelect('COUNT(inv.idInsumo)', 'total_items')
      .addSelect('SUM(CAST(inv.cantidad AS NUMERIC))', 'stock_total')
      .innerJoin('almacenes', 'alm', 'inv.idAlmacen = alm.id')
      .where('alm.id_negocio = :id_negocio', { id_negocio })
      .groupBy('inv.idAlmacen')
      .getRawMany();

    return result as InventarioResumen[];
  }

  async updateStock(idInsumo: number, idAlmacen: number, delta: number) {
    const item = await this.repo.findOne({ where: { idInsumo, idAlmacen } });
    if (!item) return null;
    const actual = Number(item.cantidad ?? 0);
    item.cantidad = (actual + delta).toString();
    return this.repo.save(item);
  }

  async setStock(idInsumo: number, idAlmacen: number, cantidad: number) {
    let item = await this.repo.findOne({ where: { idInsumo, idAlmacen } });
    if (!item) {
      item = this.repo.create({
        idInsumo,
        idAlmacen,
        cantidad: cantidad.toString(),
      });
    } else {
      item.cantidad = cantidad.toString();
    }
    return this.repo.save(item);
  }
}
