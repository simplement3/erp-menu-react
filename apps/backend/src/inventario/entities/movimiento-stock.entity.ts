import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('movimientos_stock')
export class MovimientoStock {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'id_almacen', type: 'int' })
  idAlmacen: number;

  @Column({ name: 'id_insumo', type: 'int' })
  idInsumo: number;

  // 'entrada' | 'salida'
  @Column({ type: 'varchar', length: 50 })
  tipo: string;

  @Column({ type: 'numeric', precision: 14, scale: 4 })
  cantidad: string;

  @Column({ type: 'text', nullable: true })
  referencia: string | null;

  @Column({ type: 'timestamp', nullable: true })
  fecha: Date | null;
}
