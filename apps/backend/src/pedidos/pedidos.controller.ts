import { Controller, Get, Param } from '@nestjs/common';

@Controller('api/pedidos')
export class PedidosController {
  @Get('negocio/:id_negocio')
  getPedidosByNegocio() {
    return { message: 'Pedidos para negocio' };
  }
}
