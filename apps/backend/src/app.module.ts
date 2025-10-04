import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PedidosModule } from './pedidos/pedidos.module';
import { AuthModule } from './auth/auth.module';
import { MenuModule } from './menu/menu.module';
import { NegociosModule } from './negocios/negocios.module'; // Agrega este import

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Quita envFilePath
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
        console.log('DB_HOST:', configService.get('DB_HOST'));
        console.log(
          'DB_PASSWORD:',
          configService.get('DB_PASSWORD'),
          typeof configService.get('DB_PASSWORD'),
        );
        const password = configService.get<string>('DB_PASSWORD');
        if (!password) throw new Error('DB_PASSWORD is required');
        return {
          type: 'postgres',
          host: configService.get<string>('DB_HOST') || 'localhost',
          port: configService.get<number>('DB_PORT') || 5432,
          username: configService.get<string>('DB_USER') || 'postgres',
          password,
          database: configService.get<string>('DB_NAME') || 'erp_tierp_db',
          entities: [__dirname + '/**/*.entity{.ts,.js}'], // Agrega esto: Auto-carga todas las entities en src (incluyendo Negocio)
          autoLoadEntities: true,
          synchronize: false, // Desactiva sync para no alterar la DB
          logging: true, // Activa logs para debuggear queries
        };
      },
      inject: [ConfigService],
    }),
    PedidosModule,
    AuthModule,
    MenuModule,
    NegociosModule, // Agrega esto al array de imports
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
