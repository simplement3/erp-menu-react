import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlatilloIngrediente } from './entities/platillo-ingrediente.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PlatilloIngrediente])],
  exports: [TypeOrmModule],
})
export class PlatilloIngredientesModule {}
