import { Module } from '@nestjs/common';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config'; // Añadido para manejar .env (útil para DB config, etc.)
import { Menu, Ingrediente, Insumo, Inventario } from './entities/entities'; // Mantenido, asumiendo que entities.ts exporta todo (incluyendo Menu con id_negocio)
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: false }), // Añadido: Carga .env localmente en este módulo (ajusta si quieres global)
    TypeOrmModule.forFeature([Menu, Ingrediente, Insumo, Inventario]), // Mantenido: Registra las entidades para repositorios
    AuthModule, // Mantenido para JWT y guards en el portal local
  ],
  controllers: [MenuController],
  providers: [MenuService],
  exports: [MenuService], // Añadido: Exporta el servicio para uso en otros módulos (opcional pero recomendado)
})
export class MenuModule {}
