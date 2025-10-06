import {
  IsNumber,
  IsArray,
  IsNotEmpty,
  ArrayMinSize,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class Item {
  @IsNumber()
  id_menu: number;

  @IsNumber()
  cantidad: number;
}

export class CreatePedidoDto {
  @IsNumber()
  @IsNotEmpty()
  id_negocio: number;

  @IsArray()
  @ArrayMinSize(1) // Al menos un item
  @ValidateNested({ each: true })
  @Type(() => Item)
  items: Item[];

  @IsNumber()
  @IsNotEmpty()
  total: number;
}
