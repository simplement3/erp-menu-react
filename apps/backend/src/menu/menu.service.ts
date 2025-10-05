import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config'; // <-- Agrega este import
import { Menu } from './entities/entities'; // Importa de entities.ts

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    private menuRepository: Repository<Menu>,
    private configService: ConfigService, // <-- Inyecta ConfigService para defaults
  ) {
    console.log('Repo:', this.menuRepository);
  }

  async findAvailable(idNegocio: number, idAlmacen: number): Promise<Menu[]> {
    // Manejo de defaults para evitar null
    idNegocio =
      idNegocio || this.configService.get<number>('DEFAULT_NEGOCIO_ID') || 1; // Agrega a .env: DEFAULT_NEGOCIO_ID=1
    idAlmacen =
      idAlmacen || this.configService.get<number>('DEFAULT_ALMACEN_ID') || 1; // Agrega a .env: DEFAULT_ALMACEN_ID=1

    // Lógica legacy: platillos con stock positivo de insumos
    return this.menuRepository
      .createQueryBuilder('platillo')
      .select([
        // Agregamos select explícito con SOLO columnas que existen en DB
        'platillo.id',
        'platillo.categoria',
        'platillo.nombre',
        'platillo.costo_neto',
        'platillo.iva',
        'platillo.costo_bruto',
        'platillo.costo_trans',
        'platillo.utilidad',
        'platillo.valor_venta',
        'platillo.id_negocio',
        // NO agregues createdAt ni updatedAt —eso causa el error
      ])
      .leftJoin('platillo.ingredientes', 'ingrediente') // Asume relación con Ingredientes entity
      .leftJoin('ingrediente.insumo', 'insumo')
      .leftJoin(
        'insumo.inventario',
        'inventario',
        'inventario.id_almacen = :idAlmacen',
        { idAlmacen },
      )
      .where('platillo.id_negocio = :idNegocio', { idNegocio }) // Filtra por negocio
      .andWhere('inventario.cantidad > 0') // Stock positivo
      .groupBy('platillo.id')
      .having(
        'COUNT(ingrediente.id) = SUM(CASE WHEN inventario.cantidad >= ingrediente.cantidad THEN 1 ELSE 0 END)',
      )
      .getMany();
  }
}
