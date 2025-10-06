import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

// Type alias para productos (no export; scope local a entity)
type ProductoPedido = {
  id_producto: number;
  nombre: string;
  cantidad: number;
  precio: number;
  // Agrega más si necesitas (e.g., descripcion?: string)
};

@Entity('pedidos') // Nombre exacto de la tabla en la DB
export class Pedido {
  @PrimaryGeneratedColumn() // Asume auto-incremental para ID integer
  id: number;

  @Column({ type: 'int', nullable: false }) // integer
  id_negocio: number;

  @Column({ type: 'varchar', nullable: true }) // character varying
  cliente: string;

  @Column({ type: 'jsonb', nullable: true }) // jsonb para array de productos
  productos: ProductoPedido[]; // <-- Fix: Type alias (no 'any'; resuelve unsafe en gateway)

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: false }) // numeric
  total: number;

  @Column({ type: 'timestamp', nullable: false }) // timestamp without time zone
  fecha: Date;

  @Column({ type: 'varchar', nullable: true }) // character varying
  telefono: string;

  @Column({ type: 'text', nullable: true }) // text
  direccion: string;

  @Column({ type: 'varchar', nullable: true }) // character varying
  tipo_pedido: string;

  @Column({ type: 'varchar', nullable: true }) // character varying
  estado_pago: string;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true }) // numeric
  iva: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true }) // numeric
  utilidad: number;
}
