import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  BadRequestException,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { PedidosService } from './pedidos.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { Public } from '../auth/public.decorator';

@Controller('api/pedidos')
@UseGuards(JwtAuthGuard)
export class PedidosController {
  constructor(private readonly pedidosService: PedidosService) {}

  @Get('negocio/:id_negocio')
  async findAll(@Param('id_negocio') id_negocio: number) {
    if (!id_negocio) {
      throw new BadRequestException('id_negocio es requerido');
    }
    return this.pedidosService.listOrders(id_negocio);
  }

  @Post()
  @Public()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async create(@Body() createPedidoDto: CreatePedidoDto) {
    const newOrder = await this.pedidosService.createOrder(createPedidoDto);
    return { message: 'Pedido creado exitosamente', order: newOrder };
  }
}
