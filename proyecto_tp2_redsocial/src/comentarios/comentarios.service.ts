import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateComentarioDto } from './dto/create-comentario.dto.js';
import { UpdateComentarioDto } from './dto/update-comentario.dto.js';
import { InjectModel } from '@nestjs/mongoose';
import { Comentario } from './entities/comentario.entity.js';
import { Model, Types } from 'mongoose';

@Injectable()
export class ComentariosService {
  constructor(@InjectModel(Comentario.name) private comentarioModel: Model<Comentario>) {}
async create(createComentarioDto: CreateComentarioDto) {
    const nuevoComentario = new this.comentarioModel({
      publicacionId: new Types.ObjectId(createComentarioDto.publicacionId),
      usuario: new Types.ObjectId(createComentarioDto.usuarioId),
      mensaje: createComentarioDto.mensaje,
      modificado: false,
    });
    return await nuevoComentario.save();
  }
  

  findAll(publicacionId: string, limit: number, offset: number) {
    return this.comentarioModel
      .find({ publicacionId })
      .sort({ createdAt: -1 })
      .skip(Number(offset))
      .limit(Number(limit))
      .exec();
  }

  findOne(id: number) {
    return this.comentarioModel.findById(id);
  }

 async update(id: string, mensaje: string) {
  
    const comentario_actualizado = await this.comentarioModel.findByIdAndUpdate(
      id,
      { mensaje , modificado: true },
      { new: true }
    )
    if (!comentario_actualizado) {
      throw new NotFoundException('Comentario no encontrado');
    }
    return comentario_actualizado;
  }

  remove(id: number) {
    return `This action removes a #${id} comentario`;
  }
}
