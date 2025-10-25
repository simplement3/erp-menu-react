import { Controller, Get, Param, Patch, Body } from '@nestjs/common';
import { InventarioService } from './inventario.service';

// ✅ Declaramos el tipo aquí para que TypeScript lo reconozca
interface InventarioResumen {
  id_almacen: number;
  total_items: number;
  stock_total: number;
}

@Controller('api/inventario')
export class InventarioController {
  constructor(private readonly service: InventarioService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  // ✅ Especifica el tipo de retorno explícitamente
  @Get(':id_negocio')
  async findByNegocio(
    @Param('id_negocio') id_negocio: number,
  ): Promise<InventarioResumen[]> {
    return this.service.findByNegocio(id_negocio);
  }

  @Patch('ajustar')
  updateStock(
    @Body() body: { id_insumo: number; id_almacen: number; delta: number },
  ) {
    return this.service.updateStock(
      body.id_insumo,
      body.id_almacen,
      body.delta,
    );
  }
}
