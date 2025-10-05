import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
// Asume UserService para validar users

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService /*, private userService: UserService */,
  ) {}

  login(email: string, password: string) {
    const user = { id: 1, email, rol: 'admin' }; // Mock
    if (password !== 'test') throw new Error('Invalid password');

    // const payload = { id: user.id, email, rol: user.rol }; // Usa payload
    return {
      token: this.jwtService.sign({ id: user.id, email, rol: user.rol }),
    };
  }
}
