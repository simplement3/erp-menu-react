import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Negocio } from './negocio.entity'; // Ajusta path si moviste el archivo

@Module({
  imports: [TypeOrmModule.forFeature([Negocio])], // Registra la entity aquí
  exports: [TypeOrmModule], // Exporta para usarla en otros módulos
})
export class NegociosModule {}
