// apps/backend/src/platillos/entities/platillo.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { PlatilloIngrediente } from '../../platillos/entities/platillo-ingrediente.entity';

@Entity('platillos')
export class Platillo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  nombre: string;

  @Column({ type: 'varchar', nullable: true })
  categoria?: string;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true })
  costo_neto?: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true })
  iva?: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true })
  costo_bruto?: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true })
  costo_trans?: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true })
  utilidad?: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true })
  valor_venta?: number;

  @Column({ type: 'int', nullable: false })
  id_negocio: number;

  // Relación con ingredientes
  @OneToMany(() => PlatilloIngrediente, (pi) => pi.platillo)
  ingredientes?: PlatilloIngrediente[];
}
