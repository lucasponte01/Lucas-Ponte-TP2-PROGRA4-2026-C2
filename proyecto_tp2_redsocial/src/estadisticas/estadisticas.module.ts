import { Module } from '@nestjs/common';
import { EstadisticasService } from './estadisticas.service.js';
import { EstadisticasController } from './estadisticas.controller.js';
import { MongooseModule } from '@nestjs/mongoose';
import { Publicacione } from '../publicaciones/entities/publicacione.entity.js';
import { Comentario, ComentarioSchema } from '../comentarios/entities/comentario.entity.js';

@Module({
  imports: [MongooseModule.forFeature([
      { name: Publicacione.name, schema: Publicacione },
      { name: Comentario.name, schema: ComentarioSchema },
    ]),],
  controllers: [EstadisticasController],
  providers: [EstadisticasService],
})
export class EstadisticasModule {}
