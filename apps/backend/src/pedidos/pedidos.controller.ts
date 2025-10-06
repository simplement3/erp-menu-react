import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { PedidosService } from './pedidos.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard'; // Ajusta la ruta si es diferente
//import { Pedido } from './entities/pedido.entity'; // Asume que existe esta entity (creála si no)
import { UsePipes, ValidationPipe } from '@nestjs/common'; // Agrega esto
import { CreatePedidoDto } from './dto/create-pedido.dto';

@Controller('api/pedidos') // Basado en tus logs, con prefix /api/
@UseGuards(JwtAuthGuard) // Protege todo el controller con JWT (requiere token)
export class PedidosController {
  constructor(private readonly pedidosService: PedidosService) {}

  // Tu GET existente (de logs: con param :id_negocio)
  @Get('negocio/:id_negocio')
  async findAll(@Param('id_negocio') id_negocio: number) {
    if (!id_negocio) {
      throw new BadRequestException('id_negocio es requerido');
    }
    return this.pedidosService.listOrders(id_negocio); // Asume que tenés este método en service
  }

  // Nuevo POST para crear pedido
  @Post()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true })) // Auto-valida y transforma
  async create(@Body() createPedidoDto: CreatePedidoDto) {
    const newOrder = await this.pedidosService.createOrder(createPedidoDto);
    return { message: 'Pedido creado exitosamente', order: newOrder };
  }
}
