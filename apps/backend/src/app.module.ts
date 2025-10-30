import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PedidosModule } from './pedidos/pedidos.module';
import { AuthModule } from './auth/auth.module';
import { MenuModule } from './menu/menu.module';
import { WebsocketsModule } from './websockets/websockets.module';
import { NegociosModule } from './negocios/negocios.module';
import { MovimientosStockModule } from './movimientos-stock/movimientos-stock.module';
import { PlatilloIngredientesModule } from './platillos/platillo-ingredientes.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PagosModule } from './pagos/pagos.module';
import { ReportesModule } from './reportes/reportes.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
        const password = configService.get<string>('DB_PASSWORD');
        if (!password) throw new Error('DB_PASSWORD is required');
        return {
          type: 'postgres',
          host: configService.get<string>('DB_HOST') || 'localhost',
          port: configService.get<number>('DB_PORT') || 5432,
          username: configService.get<string>('DB_USER') || 'postgres',
          password,
          database: configService.get<string>('DB_NAME') || 'erp_tierp_db',
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          autoLoadEntities: true,
          synchronize: false,
          logging: true,
        };
      },
      inject: [ConfigService],
    }),
    PedidosModule,
    AuthModule,
    MenuModule,
    WebsocketsModule,
    NegociosModule,
    MovimientosStockModule,
    PlatilloIngredientesModule,
    NotificationsModule,
    ReportesModule,
    PagosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
