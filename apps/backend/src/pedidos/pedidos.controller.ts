import { Controller, Get } from '@nestjs/common'; //quite el Param porque no estaba siendo usado

@Controller('api/pedidos')
export class PedidosController {
  @Get('negocio/:id_negocio')
  getPedidosByNegocio() {
    return { message: 'Pedidos para negocio' };
  }
}
