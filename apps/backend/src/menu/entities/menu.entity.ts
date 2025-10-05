import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('platillos') // Asumiendo que la tabla se llama 'platillos' basada en el contexto (puedes cambiar si es diferente)
export class MenuEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  nombre: string; // Nombre del platillo

  @Column({ type: 'text', nullable: true })
  descripcion: string; // Descripción del platillo

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precio: number; // Precio del platillo

  @Column({ type: 'varchar', length: 255, nullable: true })
  imagen: string; // URL o path de la imagen del platillo (opcional)

  @Column({ type: 'int' })
  id_negocio: number; // Columna agregada para identificar el negocio (puede ser una FK si se relaciona con otra tabla)

  @Column({ type: 'boolean', default: true })
  disponible: boolean; // Indica si el platillo está disponible

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date; // Fecha de creación

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date; // Fecha de última actualización
}
