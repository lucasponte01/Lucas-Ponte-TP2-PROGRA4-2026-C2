import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { MongooseModule } from '@nestjs/mongoose';
import { UsuariosModule } from './usuarios/usuarios.module.js';
import { AuthModule } from './auth/auth.module.js';
import { PublicacionesModule } from './publicaciones/publicaciones.module.js';

@Module({
  imports: [MongooseModule.forRoot('mongodb+srv://lucasponteponte204_db_user:pk4rUKtjRe2peLYy@clustertp2.sjbxedf.mongodb.net' ), UsuariosModule, AuthModule, PublicacionesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
