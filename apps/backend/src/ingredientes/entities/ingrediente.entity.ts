import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('ingredientes')
export class Ingrediente {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  nombre: string;

  // En tu dump aparece "unidad" en TEXT
  @Column({ type: 'text', nullable: true })
  unidad: string | null;

  // id del insumo físico al que se asocia este ingrediente
  @Column({ name: 'id_insumo', type: 'int', nullable: true })
  idInsumo: number | null;

  // precio_unitario en NUMERIC
  @Column({
    name: 'precio_unitario',
    type: 'numeric',
    precision: 12,
    scale: 2,
    nullable: true,
  })
  precioUnitario: string | null;

  // Campos que existen en tu tabla pero no son críticos aquí (nullable)
  @Column({ type: 'numeric', precision: 14, scale: 4, nullable: true })
  cantidad: string | null;

  @Column({ name: 'platillo_id', type: 'int', nullable: true })
  platilloId: number | null;

  @Column({
    name: 'costo_total',
    type: 'numeric',
    precision: 14,
    scale: 2,
    nullable: true,
  })
  costoTotal: string | null;
}
