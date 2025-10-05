import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Negocio } from '../../negocios/negocio.entity'; // Ajustado a un path más común; cambia si es necesario (e.g., '../../negocios/negocio.entity')

@Entity('insumos')
export class Insumo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  nombre: string;

  @OneToMany(() => Ingrediente, (ingrediente) => ingrediente.insumo)
  ingredientes: Ingrediente[];

  @OneToMany(() => Inventario, (inventario) => inventario.insumo)
  inventario: Inventario[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}

@Entity('platillos')
export class Menu {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  categoria: string;

  @Column({ type: 'varchar', length: 255 })
  nombre: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  costo_neto: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  iva: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  costo_bruto: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  costo_trans: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  utilidad: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  valor_venta: number;

  @Column({ type: 'int', name: 'id_negocio', nullable: false, default: 1 })
  id_negocio: number;

  @ManyToOne(() => Negocio, (negocio) => negocio.platillos)
  @JoinColumn({ name: 'id_negocio' })
  negocio: Negocio;

  @OneToMany(() => Ingrediente, (ingrediente) => ingrediente.platillo)
  ingredientes: Ingrediente[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}

@Entity('ingredientes')
export class Ingrediente {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  cantidad: number;

  @Column({ type: 'int', name: 'platillo_id' })
  platillo_id: number; // FK explícita

  @ManyToOne(() => Menu, (menu) => menu.ingredientes)
  @JoinColumn({ name: 'platillo_id' })
  platillo: Menu;

  @Column({ type: 'int', name: 'id_insumo' })
  id_insumo: number; // FK explícita

  @ManyToOne(() => Insumo, (insumo) => insumo.ingredientes)
  @JoinColumn({ name: 'id_insumo' })
  insumo: Insumo;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}

@Entity('inventario')
export class Inventario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  cantidad: number;

  @Column({ type: 'int' })
  id_almacen: number;

  @Column({ type: 'int', name: 'id_insumo' })
  id_insumo: number; // FK explícita

  @ManyToOne(() => Insumo, (insumo) => insumo.inventario)
  @JoinColumn({ name: 'id_insumo' })
  insumo: Insumo;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
