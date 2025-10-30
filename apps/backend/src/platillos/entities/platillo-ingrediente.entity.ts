// apps/backend/src/platillos/entities/platillo-ingrediente.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Platillo } from './platillo.entity';
import { Ingrediente } from '../../ingredientes/entities/ingrediente.entity';

@Entity('platillo_ingredientes')
export class PlatilloIngrediente {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Platillo, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'id_platillo' })
  platillo: Platillo;

  @ManyToOne(() => Ingrediente, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'id_ingrediente' })
  ingrediente: Ingrediente;

  @Column({ type: 'numeric', precision: 14, scale: 4 })
  cantidad: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  unidad: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', nullable: true })
  updatedAt: Date;
}
