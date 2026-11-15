import { Module } from '@nestjs/common';
import { ComentariosService } from './comentarios.service.js';
import { ComentariosController } from './comentarios.controller.js';
import { MongooseModule } from '@nestjs/mongoose';
import { Comentario, ComentarioSchema } from './entities/comentario.entity.js';

@Module({
  imports: [MongooseModule.forFeature([{ name: Comentario.name, schema: ComentarioSchema }])],
  controllers: [ComentariosController],
  providers: [ComentariosService],
})
export class ComentariosModule {}
