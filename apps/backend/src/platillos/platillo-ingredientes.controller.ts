import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlatilloIngrediente } from './entities/platillo-ingrediente.entity';

@Controller('api/platillos')
export class PlatilloIngredientesController {
  constructor(
    @InjectRepository(PlatilloIngrediente)
    private readonly recetaRepo: Repository<PlatilloIngrediente>,
  ) {}

  @Get(':id/ingredientes')
  async getIngredientes(@Param('id') id: number) {
    const receta = await this.recetaRepo.find({
      where: { platillo: { id } },
      relations: ['ingrediente'],
    });
    if (!receta.length) throw new NotFoundException('Receta no encontrada');
    return receta.map((r) => ({
      id_ingrediente: r.ingrediente.id,
      nombre: r.ingrediente.nombre,
      unidad: r.ingrediente.unidad,
      cantidad: r.cantidad,
      precio_unitario: r.ingrediente.precioUnitario,
    }));
  }
}
