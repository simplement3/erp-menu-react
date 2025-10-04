import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Menu } from '../menu/entities/entities'; // Ajusta este path: Apunta directamente a entities.ts (donde está Menu). Si no, usa '../menu/entities/entities' si están al mismo nivel.

@Entity('negocios')
export class Negocio {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  direccion: string;

  @Column()
  telefono: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @OneToMany(() => Menu, (menu) => menu.negocio) // Ahora 'menu.negocio' existe gracias al fix en Menu
  platillos: Menu[];
}
