import { Injectable } from '@nestjs/common';
import { createTransport, Transporter, SentMessageInfo } from 'nodemailer';

export interface ProductoPedido {
  id_producto: number;
  nombre: string;
  cantidad: number;
  precio: number;
}

export interface PedidoData {
  id: number;
  cliente: string;
  telefono: string;
  direccion?: string;
  tipo_pedido: 'local' | 'delivery';
  productos: ProductoPedido[];
  total: number;
}

export type PedidoLike = Partial<PedidoData> & {
  id: number | string;
  total: number | string;
};

@Injectable()
export class MailService {
  private readonly transporter: Transporter<SentMessageInfo>;

  constructor() {
    this.transporter = createTransport({
      host: process.env.SMTP_HOST ?? 'smtp.ethereal.email',
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: false,
      auth: {
        user: process.env.SMTP_USER ?? 'user@example.com',
        pass: process.env.SMTP_PASS ?? 'password',
      },
    });
  }

  async sendDeliveryConfirmation(
    to: string,
    pedido: PedidoData,
  ): Promise<void> {
    if (pedido.tipo_pedido !== 'delivery') return;

    const html = this.generarHTMLPedido(pedido);

    try {
      await this.transporter.sendMail({
        from: 'no-reply@erp.local',
        to,
        subject: `Confirmación de pedido #${pedido.id}`,
        html,
      });
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : String(error);
      console.error('Error enviando correo:', errMsg);
    }
  }

  private generarHTMLPedido(pedido: PedidoData): string {
    const productosHTML = pedido.productos
      .map((p) => {
        const nombre = this.escape(p.nombre);
        const subtotal = p.precio * p.cantidad;
        const subtotalCLP = new Intl.NumberFormat('es-CL', {
          style: 'currency',
          currency: 'CLP',
        }).format(subtotal);
        return `<li>${nombre} ×${p.cantidad} — ${subtotalCLP}</li>`;
      })
      .join('');

    const totalFormateado = new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
    }).format(pedido.total);

    const direccionBlock = pedido.direccion
      ? `<p><strong>Dirección:</strong> ${this.escape(pedido.direccion)}</p>`
      : '';

    return `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2>Pedido #${pedido.id}</h2>
        <p>Cliente: ${this.escape(pedido.cliente)}</p>
        <p>Teléfono: ${this.escape(pedido.telefono)}</p>
        <ul>${productosHTML}</ul>
        <p><strong>Total:</strong> ${totalFormateado}</p>
        <p><strong>Tipo:</strong> ${pedido.tipo_pedido}</p>
        ${direccionBlock}
        <hr />
        <p style="font-size: 12px; color: #777;">Correo automático. No responder.</p>
      </div>
    `;
  }

  private escape(value: string): string {
    // Previene no-base-to-string y XSS
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
}
