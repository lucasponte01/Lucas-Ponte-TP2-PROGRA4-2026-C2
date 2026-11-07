import { Module } from '@nestjs/common';
import { PublicacionesService } from './publicaciones.service.js';
import { PublicacionesController } from './publicaciones.controller.js';
import { Publicacione, PubliSchema } from './entities/publicacione.entity.js';
import { MongooseModule } from '@nestjs/mongoose';
import { CloudinaryService } from '../auth/cloudinary-service.js';

@Module({
  imports: [MongooseModule.forFeature([{ name: Publicacione.name, schema: PubliSchema }])],
  controllers: [PublicacionesController],
  providers: [PublicacionesService , CloudinaryService],
})
export class PublicacionesModule {}
