import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password); // Lógica real: valida user y genera JWT
  }

  @UseGuards(JwtAuthGuard) // Protege con tu guard (solo admins)
  @Get('protected')
  getProtected() {
    return { message: 'Acceso concedido solo para admins!' };
  }
}
