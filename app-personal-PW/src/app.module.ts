import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from './config/config.module';
import { UsuariosModule } from './modules/usuarios/usuarios.module';
import { DireccionesModule } from './modules/direcciones/direcciones.module';
import { CategoriasModule } from './modules/categorias/categorias.module';
import { ProductosModule } from './modules/productos/productos.module';
import { ItemsCarritoModule } from './modules/items_carrito/items_carrito.module';
import { OrdenesModule } from './modules/ordenes/ordenes.module';
import { DetallesOrdenesModule } from './modules/detalles_ordenes/detalles_ordenes.module';

@Module({
  imports: [AuthModule, UsuariosModule, DatabaseModule, ConfigModule, DireccionesModule, CategoriasModule, ProductosModule, ItemsCarritoModule, OrdenesModule, DetallesOrdenesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
