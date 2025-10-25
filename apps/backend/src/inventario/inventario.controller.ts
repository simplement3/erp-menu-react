import { Controller, Get, Param, Patch, Body } from '@nestjs/common';
import { InventarioService } from './inventario.service';

@Controller('inventario')
export class InventarioController {
  constructor(private readonly service: InventarioService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id_negocio')
  findByNegocio(@Param('id_negocio') id_negocio: number) {
    return this.service.findByNegocio(id_negocio);
  }

  @Patch('ajustar')
  updateStock(
    @Body() body: { id_platillo: number; id_almacen: number; delta: number },
  ) {
    return this.service.updateStock(
      body.id_platillo,
      body.id_almacen,
      body.delta,
    );
  }
}
