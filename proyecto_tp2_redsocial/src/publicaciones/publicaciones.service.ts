import { Injectable } from '@nestjs/common';
import { CreatePublicacioneDto } from './dto/create-publicacione.dto.js';
import { UpdatePublicacioneDto } from './dto/update-publicacione.dto.js';
import { InjectModel } from '@nestjs/mongoose';
import { Publicacione } from './entities/publicacione.entity.js';
import { Model } from 'mongoose';

@Injectable()
export class PublicacionesService {
  constructor(@InjectModel(Publicacione.name) private publiModel: Model<Publicacione>,) {}
  create(createPublicacioneDto: CreatePublicacioneDto) {
    const nuevaPubli = new this.publiModel(createPublicacioneDto);
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
