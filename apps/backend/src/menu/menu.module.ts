import { Module } from '@nestjs/common';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Menu, Ingrediente, Insumo, Inventario } from './entities/entities'; // Importa todo de entities.ts
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Menu, Ingrediente, Insumo, Inventario]),
    AuthModule,
  ],
  controllers: [MenuController],
  providers: [MenuService],
})
export class MenuModule {}
