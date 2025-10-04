import {
  Controller,
  Get,
  Query,
  UseGuards,
  BadRequestException,
} from '@nestjs/common'; // Quitamos ParseIntPipe global, lo manejamos manualmente
import { MenuService } from './menu.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('api/menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  // Endpoint protegido para empleados (ERP interno) - Hacemos params opcionales con defaults
  @Get()
  @UseGuards(JwtAuthGuard) // Requiere token
  async getMenu(
    @Query('negocio') idNegocio: string = '1', // Opcional, default a '1' (string)
    @Query('almacen') idAlmacen: string = '1', // Opcional, default a '1' (ajusta según tu DB)
  ) {
    const parsedNegocio = parseInt(idNegocio, 10); // Convertimos manualmente
    const parsedAlmacen = parseInt(idAlmacen, 10);
    if (isNaN(parsedNegocio) || isNaN(parsedAlmacen)) {
      throw new BadRequestException(
        'Parámetros negocio y almacen deben ser números válidos',
      );
    }
    return this.menuService.findAvailable(parsedNegocio, parsedAlmacen);
  }

  // Endpoint público para clientes (web externa) - Hacemos params opcionales con defaults
  @Get('public')
  async getPublicMenu(
    @Query('negocio') idNegocio: string = '1', // Opcional, default a '1'
    @Query('almacen') idAlmacen: string = '1', // Opcional, default a '1'
  ) {
    const parsedNegocio = parseInt(idNegocio, 10); // Convertimos manualmente
    const parsedAlmacen = parseInt(idAlmacen, 10);
    if (isNaN(parsedNegocio) || isNaN(parsedAlmacen)) {
      throw new BadRequestException(
        'Parámetros negocio y almacen deben ser números válidos',
      );
    }
    const fullMenu = await this.menuService.findAvailable(
      parsedNegocio,
      parsedAlmacen,
    );
    return fullMenu.map((item) => ({
      id: item.id,
      nombre: item.nombre,
      categoria: item.categoria,
      valor_venta: item.valor_venta, // Precio público
      disponible: true, // Solo indica si hay stock >0, sin cantidad real
    }));
  }
}
