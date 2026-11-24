import { Module } from '@nestjs/common';
import { UsuariosService } from './usuarios.service.js';
import { UsuariosController } from './usuarios.controller.js';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema, Usuario, } from './entities/usuario.entity.js';
import { AuthService } from '../auth/auth.service.js';

@Module({
  imports: [MongooseModule.forFeature([{ name: Usuario.name, schema: UserSchema }]) , AuthService],
  controllers: [UsuariosController],
  providers: [UsuariosService],
  exports: [MongooseModule]
})
export class UsuariosModule {}
