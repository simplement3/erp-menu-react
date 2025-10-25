import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlatilloIngrediente } from './entities/platillo-ingrediente.entity';
import { PlatilloIngredientesController } from './platillo-ingredientes.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PlatilloIngrediente])],
  controllers: [PlatilloIngredientesController],
})
export class PlatilloIngredientesModule {}
