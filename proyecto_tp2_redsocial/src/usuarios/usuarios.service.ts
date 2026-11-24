import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto.js';
import { UpdateUsuarioDto } from './dto/update-usuario.dto.js';
import { InjectModel } from '@nestjs/mongoose';
import { Usuario } from './entities/usuario.entity.js';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../auth/auth.service.js';


@Injectable()
export class UsuariosService {
  constructor(
    @InjectModel(Usuario.name) private readonly usuarioModel: Model<Usuario>,
    private readonly authService: AuthService
  ) {}
 async create(
    createUsuarioDto: CreateUsuarioDto,file?: Express.Multer.File,) {
    const registrado = await this.authService.register(createUsuarioDto, file);
    const perfilFinal = createUsuarioDto.perfil ?? 'usuario';
    const activoFinal = createUsuarioDto.activo ?? true;

    const usuario = await this.usuarioModel
      .findOneAndUpdate(
        { nombreUsuario: createUsuarioDto.nombreUsuario },
        {
          perfil: perfilFinal,
          activo: activoFinal,
        },
        { new: true },
      )
      .select('-contrasena')
      .exec();

    if (!usuario) {
      throw new NotFoundException('No se pudo encontrar el usuario recién creado');
    }

    return {
      message: registrado.message,
      usuario,
    };
  }

  findAll() {
    return this.usuarioModel.find().select('-contrasena').exec();
  }

  async findOne(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('ID de usuario no válido');
    }
    const usuario = await this.usuarioModel
      .findById(id)
      .select('-contrasena')
      .exec();
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return usuario;
  }

  async update(id: string, updateUsuarioDto: UpdateUsuarioDto) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('ID de usuario no válido');
    }
    const actualizado = await this.usuarioModel
      .findByIdAndUpdate(id, updateUsuarioDto, { new: true })
      .select('-contrasena')
      .exec();
    if (!actualizado) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return actualizado;
  }

  async deshabilitar(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('ID de usuario no válido');
    }
    const usuario = await this.usuarioModel
      .findByIdAndUpdate(id, { activo: false }, { new: true })
      .select('-contrasena')
      .exec();

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return {
      mensaje: 'Usuario deshabilitado correctamente',
      usuario,
    };
  }

  async rehabilitar(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('ID de usuario no válido');
    }
    const usuario = await this.usuarioModel
      .findByIdAndUpdate(id, { activo: true }, { new: true })
      .select('-contrasena')
      .exec();

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return {
      mensaje: 'Usuario rehabilitado correctamente',
      usuario,
    };
  }
}
