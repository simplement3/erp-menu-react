import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Negocio } from '../../negocios/negocio.entity'; // Ajusta este path si es necesario (e.g., '../negocios/entities/negocio.entity' si están al mismo nivel)

@Entity('insumos')
export class Insumo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  nombre: string;

  @OneToMany(() => Ingrediente, (ingrediente) => ingrediente.insumo)
  ingredientes: Ingrediente[];

  @OneToMany(() => Inventario, (inventario) => inventario.insumo)
  inventario: Inventario[];
}

@Entity('platillos')
export class Menu {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: true })
  categoria: string;

  @Column({ type: 'text' })
  nombre: string;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true })
  costo_neto: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true })
  iva: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true })
  costo_bruto: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true })
  costo_trans: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true })
  utilidad: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true })
  valor_venta: number;

  // Fix para el error TS2339: Agrega la relación ManyToOne aquí
  @Column({ name: 'id_negocio', nullable: false, default: 1 })
  id_negocio: number;

  @ManyToOne(() => Negocio, (negocio) => negocio.platillos)
  @JoinColumn({ name: 'id_negocio' })
  negocio: Negocio; // Esto define la propiedad 'negocio' que faltaba

  @OneToMany(() => Ingrediente, (ingrediente) => ingrediente.platillo)
  ingredientes: Ingrediente[];
}

@Entity('ingredientes')
export class Ingrediente {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'numeric' })
  cantidad: number;

  @ManyToOne(() => Menu, (menu) => menu.ingredientes)
  @JoinColumn({ name: 'platillo_id' })
  platillo: Menu;

  @ManyToOne(() => Insumo, (insumo) => insumo.ingredientes)
  @JoinColumn({ name: 'id_insumo' })
  insumo: Insumo;
}

@Entity('inventario')
export class Inventario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'numeric' })
  cantidad: number;

  @Column()
  id_almacen: number;

  @ManyToOne(() => Insumo, (insumo) => insumo.inventario)
  @JoinColumn({ name: 'id_insumo' })
  insumo: Insumo;
}
