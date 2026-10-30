import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUsuarioDto } from '../usuarios/dto/create-usuario.dto.js';
import { Usuario } from '../usuarios/entities/usuario.entity.js';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { LoginDto } from './dto/login.dto.js';

@Injectable()
export class AuthService {
    
    constructor(
        @InjectModel(Usuario.name) private readonly usermodel: Model<Usuario>
    ) {}

    async register(createUserDto: CreateUsuarioDto, imagenUrl: string = '') {
        const { nombre, apellido, correo, nombreUsuario, contrasena, fechaNacimiento, descripcionBreve } = createUserDto;
    
        const existingUser = await this.usermodel.findOne({
            $or: [{ correo }, { nombreUsuario }],
        });

        if (existingUser) {
            throw new BadRequestException('El correo o el nombre de usuario ya se encuentran registrados');
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
            imagenPerfil: imagenUrl,
            perfil: 'usuario', 
        });

        await newUser.save();


        // Generamos el token llamando al método auxiliar
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


        // Generamos el token
        const token = this.generartoken(user.nombreUsuario);

        return {
            message: 'Login exitoso',
            access_token: token,
            
        };
    }

    generartoken(user: string) {
        // Obtenemos la clave secreta desde el .env (asegurate de tener JWT_SECRET definido)
        const clave = process.env.JWT_SECRET || 'clave_secreta_por_defecto';

        const payload = {
            user,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 60 * 15, // Vence en 15 minutos (Sprint 3)
        };

        const token = jwt.sign(payload, clave, {
            issuer: 'miserver',
        });

        return token;
    }
}