import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePublicacioneDto } from './dto/create-publicacione.dto.js';
import { UpdatePublicacioneDto } from './dto/update-publicacione.dto.js';
import { InjectModel } from '@nestjs/mongoose';
import { Publicacione } from './entities/publicacione.entity.js';
import { Model, Types } from 'mongoose';
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

  findAll(params: { limit?: string; offset?: string; sort?: string; userId?: string }) {

    const limitNum = params.limit ? parseInt(params.limit, 10) : 10;
    const offsetNum = params.offset ? parseInt(params.offset, 10) : 0;

    const filter: any = {};
    if (params.userId) {
      filter.usuario = params.userId; 
    }

    let sortCriteria: any = { createdAt: -1 };

    if (params.sort === 'likes') {
      sortCriteria = { likesCount: -1 }; 
    } else if (params.sort === 'fecha_asc') {
      sortCriteria = { createdAt: 1 };
    }

    return this.publiModel
      .find(filter)
      .sort(sortCriteria)
      .skip(offsetNum)
      .limit(limitNum)
      .exec();
  }


  async toggleLike(publiId: string, userId: string) {
    if (!userId) {
      throw new BadRequestException('Usuario no válido o no autenticado');
    }

    const publicacion = await this.publiModel.findById(publiId);
    if (!publicacion) {
      throw new NotFoundException('Publicación no encontrada');
    }

    if (!publicacion.likes) {
      publicacion.likes = [];
    }

    // Vemos si el usuario ya está en el array de likes
    const index = publicacion.likes.findIndex((id) => id.toString() === userId.toString());

    if (index !== -1) {
      // YA LE DIO LIKE: Lo quitamos (Unlike)
      publicacion.likes.splice(index, 1);
    } else {
      // NO LE HABÍA DADO LIKE: Se lo agregamos (Like)
      publicacion.likes.push(new Types.ObjectId(userId));
    }

    // Actualizamos el contador y guardamos
    publicacion.likesCount = publicacion.likes.length;
    return publicacion.save();
  }

  // --- BAJA LÓGICA DE PUBLICACIÓN ---
  async bajaLogica(publiId: string, userId: string, esAdmin: boolean) {
    const publicacion = await this.publiModel.findById(publiId);
    if (!publicacion) {
      throw new NotFoundException('Publicación no encontrada');
    }

    // Validar si es el creador o es admin
    const esCreador = publicacion.usuario && publicacion.usuario.toString() === userId;
    if (!esCreador && !esAdmin) {
      throw new ForbiddenException('No tenés permisos para eliminar esta publicación');
    }

    // Aplicamos baja lógica
    publicacion.activo = false;
    return publicacion.save();
  }

  

  findOne(id: number) {
    return this.publiModel.findById(id);
  }

  update(id: string, updatePublicacioneDto: UpdatePublicacioneDto) {
    return this.publiModel.findByIdAndUpdate(id, updatePublicacioneDto, { new: true });
  }

  remove(Id: string, userId: string, esAdmin: boolean) {
    return this.bajaLogica(Id, userId, esAdmin);
  }
}
