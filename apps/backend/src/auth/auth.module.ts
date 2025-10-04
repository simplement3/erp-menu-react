import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config'; // Agrega ConfigModule
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtAuthGuard } from '../guards/jwt-auth.guard'; // Agrega si usas el guard aquí

@Module({
  imports: [
    ConfigModule.forRoot(), // Agrega esto para .env y ConfigService
    JwtModule.registerAsync({
      global: true,
      useFactory: (configService: ConfigService) => ({
        // Quita async
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard], // Agrega el guard si lo usas en este módulo
  exports: [AuthService],
})
export class AuthModule {}
