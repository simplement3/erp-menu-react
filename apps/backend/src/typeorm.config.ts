import 'dotenv/config';
import { DataSource } from 'typeorm';
import { Pedido } from './pedidos/entities/pedido.entity';
import { Inventario } from './inventario/entities/inventario.entity';
import { MovimientoStock } from './inventario/entities/movimiento-stock.entity';
import { PlatilloIngrediente } from './platillos/entities/platillo-ingrediente.entity';
import { Ingrediente } from './ingredientes/entities/ingrediente.entity';
import { Platillo } from './platillos/entities/platillo.entity';

export const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [
    Pedido,
    Inventario,
    MovimientoStock,
    PlatilloIngrediente,
    Ingrediente,
    Platillo,
  ],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
  logging: true,
});
