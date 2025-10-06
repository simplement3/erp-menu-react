import { Injectable, UnauthorizedException } from '@nestjs/common'; // Agrega UnauthorizedException
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  login(email: string, password: string) {
    if (!email) {
      throw new UnauthorizedException('Email es requerido'); // Nuevo: Valida email
    }
    if (password !== 'test') {
      throw new UnauthorizedException('Password inválido'); // Fix: Usa Unauthorized para 401
    }

    const user = { id: 1, email, rol: 'admin' }; // Mock
    return {
      token: this.jwtService.sign({ id: user.id, email, rol: user.rol }),
    };
  }
}
