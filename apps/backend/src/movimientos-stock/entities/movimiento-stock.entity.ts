import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('movimientos_stock')
export class MovimientoStock {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  id_almacen: number;

  @Column({ type: 'int' })
  id_insumo: number;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  cantidad: number;

  @Column({ type: 'varchar', length: 20 })
  tipo: 'ENTRADA' | 'SALIDA';

  @Column({ type: 'text', nullable: true })
  referencia: string;

  @CreateDateColumn({ type: 'timestamp' })
  fecha: Date;
}
