import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { PedidosService } from '../pedidos/pedidos.service';

@Controller('api/reportes')
export class ReportesController {
  constructor(private readonly pedidosService: PedidosService) {}

  @Get('pedidos')
  async getReportePedidos(
    @Query('id_negocio') id_negocio?: string,
    @Query('fechaInicio') fechaInicio?: string,
    @Query('fechaFin') fechaFin?: string,
  ) {
    const idNeg = Number(id_negocio);
    if (!idNeg || isNaN(idNeg)) {
      throw new BadRequestException(
        'id_negocio es requerido y debe ser numérico',
      );
    }

    const pedidos = await this.pedidosService.listOrders(
      idNeg,
      fechaInicio,
      fechaFin,
    );
    if (!pedidos.length) {
      return {
        total_pedidos: 0,
        total_ventas: 0,
        promedio_ticket: 0,
        fecha_inicio: fechaInicio ?? null,
        fecha_fin: fechaFin ?? null,
      };
    }

    const totalVentas = pedidos.reduce(
      (sum, p) => sum + Number(p.total ?? 0),
      0,
    );
    const promedioTicket = totalVentas / pedidos.length;

    return {
      total_pedidos: pedidos.length,
      total_ventas: totalVentas,
      promedio_ticket: Math.round(promedioTicket),
      fecha_inicio: fechaInicio ?? null,
      fecha_fin: fechaFin ?? null,
    };
  }
}
