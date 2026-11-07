import { Injectable } from '@nestjs/common';
import { CreatePublicacioneDto } from './dto/create-publicacione.dto.js';
import { UpdatePublicacioneDto } from './dto/update-publicacione.dto.js';
import { InjectModel } from '@nestjs/mongoose';
import { Publicacione } from './entities/publicacione.entity.js';
import { Model } from 'mongoose';
import { CloudinaryService } from '../auth/cloudinary-service.js';

@Injectable()
export class PublicacionesService {
  constructor(@InjectModel(Publicacione.name) private publiModel: Model<Publicacione>,private readonly cloudinaryService: CloudinaryService,) {}

  async create(createPublicacioneDto: CreatePublicacioneDto , file?: Express.Multer.File) {
    const { titulo, mensaje } = createPublicacioneDto;
    
    let imagen_url = '';
    if (file) {
      imagen_url = await this.cloudinaryService.subirArchivo(file , 'Publicaciones');
    }

    const nuevaPubli = new this.publiModel({
      titulo,
      mensaje,
      imagen: imagen_url,
    });
    

    return nuevaPubli.save();
  }

  findAll() {
    return this.publiModel.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} publicacione`;
  }

  update(id: number, updatePublicacioneDto: UpdatePublicacioneDto) {
    return `This action updates a #${id} publicacione`;
  }

  remove(id: number) {
    return `This action removes a #${id} publicacione`;
  }
}
