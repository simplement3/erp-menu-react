import {
  IsNumber,
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';

class ProductoDto {
  @IsNumber()
  id_producto: number;

  @IsString()
  nombre: string;

  @IsNumber()
  precio: number;

  @IsNumber()
  cantidad: number;
}

export class CreatePedidoDto {
  @IsNumber()
  id_negocio: number;

  @IsNumber()
  id_almacen: number;

  @IsString()
  cliente: string;

  @IsString()
  telefono: string;

  @IsOptional()
  @IsString()
  direccion?: string;

  @IsEnum(['local', 'delivery'])
  tipo_pedido: 'local' | 'delivery';

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductoDto)
  productos: ProductoDto[]; // <-- Cambia de 'items' a 'productos'

  @IsNumber()
  total: number;
}
