import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUsuarioDto } from '../usuarios/dto/create-usuario.dto.js';
import { Usuario } from '../usuarios/entities/usuario.entity.js';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { LoginDto } from './dto/login.dto.js';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryService } from './cloudinary-service.js';

@Injectable()
export class AuthService {
    
    constructor(
        @InjectModel(Usuario.name) private readonly usermodel: Model<Usuario>,
        private readonly cloudinaryService: CloudinaryService,
    ) {}

    async register(createUserDto: CreateUsuarioDto, file?: Express.Multer.File) {
        const { nombre, apellido, correo, nombreUsuario, contrasena, fechaNacimiento, descripcionBreve } = createUserDto;
        const existe_usuario = await this.usermodel.findOne({
            $or: [{ correo }, { nombreUsuario }],
        });
        if (existe_usuario) {
            throw new BadRequestException('El correo o el nombre de usuario ya se encuentran registrados');
        }   
       let imagen_url = '';
            if (file) {
            imagen_url = await this.cloudinaryService.subirArchivo(file , 'perfil');
            }
            
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(contrasena, salt);
        const newUser = new this.usermodel({
            nombre,
            apellido,
            correo,
            nombreUsuario,
            contrasena: hashedPassword,
            fechaNacimiento,
            descripcionBreve,
            imagenPerfil: imagen_url,
            perfil: 'usuario', 
        });
        await newUser.save();
        const token = this.generartoken(nombreUsuario);
        return {
            message: 'Usuario registrado exitosamente',      
            access_token: token,
        };
    }

    async login(loginDto: LoginDto) {
        const { identificador, contrasena } = loginDto; 
        const user = await this.usermodel.findOne({
            $or: [{ correo: identificador }, { nombreUsuario: identificador }],
        });
        if (!user) {
            throw new UnauthorizedException('Credenciales inválidas');
        }
        const isPasswordValid = await bcrypt.compare(contrasena, user.contrasena);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Credenciales inválidas');
        }
        const token = this.generartoken(user.nombreUsuario);
        return {
            message: 'Login exitoso',
            access_token: token, 
            userId: user._id.toString(),
        };
    }

    generartoken(user: string) {
        const clave = process.env.JWT_SECRET || 'clave_secreta_por_defecto';
        const payload = {
            user,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 60 * 15, 
        };
        const token = jwt.sign(payload, clave, {
            issuer: 'miserver',
        });
        return token;
    }
}