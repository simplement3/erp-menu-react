import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('pedidos') // Nombre exacto de la tabla en la DB
export class Pedido {
  @PrimaryGeneratedColumn() // Asume auto-incremental para ID integer
  id: number;

  @Column({ type: 'int', nullable: false }) // integer
  id_negocio: number;

  @Column({ type: 'varchar', nullable: true }) // character varying
  cliente: string;

  @Column({ type: 'jsonb', nullable: true }) // jsonb para array de productos
  productos: any; // Puedes tiparlo mejor, ej: { id: number; cantidad: number; precio: number }[]

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
