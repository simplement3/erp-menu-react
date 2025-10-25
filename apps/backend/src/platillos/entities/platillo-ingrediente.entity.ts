import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MenuEntity } from '../../menu/entities/menu.entity';
import { Ingrediente } from '../../ingredientes/entities/ingrediente.entity';

@Entity('platillo_ingredientes')
export class PlatilloIngrediente {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => MenuEntity, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'id_platillo' })
  platillo: MenuEntity;

  @ManyToOne(() => Ingrediente, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'id_ingrediente' })
  ingrediente: Ingrediente;

  @Column({ type: 'numeric', precision: 14, scale: 4 })
  cantidad: string; // usar string para NUMERIC preciso

  @Column({ type: 'varchar', length: 50, nullable: true })
  unidad: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', nullable: true })
  updatedAt: Date;
}
