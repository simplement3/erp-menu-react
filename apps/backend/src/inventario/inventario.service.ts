import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inventario } from './entities/inventario.entity';

@Injectable()
export class InventarioService {
  constructor(
    @InjectRepository(Inventario)
    private repo: Repository<Inventario>,
  ) {}

  findAll() {
    return this.repo.find();
  }

  findByNegocio(_: number) {
    // La tabla inventario no tiene referencia directa a negocio
    // se podría extender más adelante. Por ahora retorna todo.
    return this.repo.find();
  }

  async updateStock(idInsumo: number, idAlmacen: number, delta: number) {
    const item = await this.repo.findOne({
      where: { idInsumo, idAlmacen },
    });
    if (!item) return null;
    const actual = Number(item.cantidad ?? 0);
    item.cantidad = (actual + delta).toString();
    return this.repo.save(item);
  }

  async setStock(idInsumo: number, idAlmacen: number, cantidad: number) {
    let item = await this.repo.findOne({
      where: { idInsumo, idAlmacen },
    });
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
