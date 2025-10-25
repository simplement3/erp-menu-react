import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('inventario')
export class Inventario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'id_insumo', type: 'int' })
  idInsumo: number;

  @Column({ name: 'id_almacen', type: 'int' })
  idAlmacen: number;

  @Column({ type: 'numeric', precision: 14, scale: 4, default: 0 })
  cantidad: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', nullable: true })
  createdAt: Date | null;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', nullable: true })
  updatedAt: Date | null;
}
