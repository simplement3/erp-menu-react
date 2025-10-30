import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

// Type alias local para productos
type ProductoPedido = {
  id_producto: number;
  nombre: string;
  cantidad: number;
  precio: number;
};

@Entity('pedidos')
export class Pedido {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  id_negocio: number;

  @Column({ type: 'varchar', nullable: true })
  cliente: string;

  @Column({ type: 'jsonb', nullable: true })
  productos: ProductoPedido[];

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: false })
  total: number;

  @Column({ type: 'timestamp', nullable: false })
  fecha: Date;

  @Column({ type: 'varchar', nullable: true })
  telefono: string;

  @Column({ type: 'text', nullable: true })
  direccion: string;

  @Column({ type: 'varchar', nullable: true })
  tipo_pedido: string;

  @Column({ type: 'varchar', nullable: true })
  estado_pago: string;

  // NUEVO: estado operativo del pedido
  @Column({ type: 'varchar', nullable: false, default: 'pendiente' })
  estado: string;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true })
  iva: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true })
  utilidad: number;
}
