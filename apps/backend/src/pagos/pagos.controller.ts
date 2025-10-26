// apps/backend/src/pagos/pagos.controller.ts
import {
  Controller,
  Post,
  Body,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { MailService, PedidoData } from '../notifications/mail.service';

@Controller('api/pagos')
export class PagosController {
  constructor(private readonly mailService: MailService) {}

  @Post('confirmar')
  async confirmarPago(
    @Body()
    body: {
      email: string;
      pedido: {
        id: number;
        cliente: string;
        telefono?: string;
        direccion?: string;
        tipo_pedido?: string; // llega como string libre
        total: number;
        productos: {
          id_producto: number;
          nombre: string;
          cantidad: number;
          precio: number;
        }[];
      };
    },
  ): Promise<{ ok: true }> {
    try {
      const { email, pedido } = body;
      if (!email) throw new BadRequestException('email requerido');
      if (!pedido) throw new BadRequestException('pedido requerido');

      // Normaliza tipo
      const tipo =
        (pedido.tipo_pedido || '').toLowerCase() === 'delivery'
          ? 'delivery'
          : 'local';

      // Construye PedidoData completo y tipado
      const pedidoData: PedidoData = {
        id: Number(pedido.id),
        cliente: String(pedido.cliente ?? ''),
        telefono: String(pedido.telefono ?? ''), // si no hay, queda string vacío
        direccion:
          pedido.direccion === undefined || pedido.direccion === null
            ? undefined
            : String(pedido.direccion),
        tipo_pedido: tipo,
        total: Number(pedido.total),
        productos: (Array.isArray(pedido.productos)
          ? pedido.productos
          : []
        ).map((p) => ({
          id_producto: Number(p.id_producto),
          nombre: String(p.nombre),
          cantidad: Number(p.cantidad),
          precio: Number(p.precio),
        })),
      };

      // Solo envía si es delivery
      await this.mailService.sendDeliveryConfirmation(email, pedidoData);
      return { ok: true };
    } catch {
      throw new InternalServerErrorException('No se pudo confirmar el pago');
    }
  }
}
