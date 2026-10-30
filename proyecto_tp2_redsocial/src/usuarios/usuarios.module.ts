import { Module } from '@nestjs/common';
import { UsuariosService } from './usuarios.service.js';
import { UsuariosController } from './usuarios.controller.js';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema, Usuario, } from './entities/usuario.entity.js';

@Module({
  imports: [MongooseModule.forFeature([{ name: Usuario.name, schema: UserSchema }])],
  controllers: [UsuariosController],
  providers: [UsuariosService],
  exports: [MongooseModule]
})
export class UsuariosModule {}
