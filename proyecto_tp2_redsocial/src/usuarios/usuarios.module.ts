import { forwardRef, Module } from '@nestjs/common';
import { UsuariosService } from './usuarios.service.js';
import { UsuariosController } from './usuarios.controller.js';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema, Usuario, } from './entities/usuario.entity.js';

import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [MongooseModule.forFeature([{ name: Usuario.name, schema: UserSchema }]) ,forwardRef(() => AuthModule)],
  controllers: [UsuariosController],
  providers: [UsuariosService],
  exports: [MongooseModule]
})
export class UsuariosModule {}
