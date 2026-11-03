import { Controller, Post, Body, HttpCode, HttpStatus, UseInterceptors, UploadedFile, UseGuards, Get, Req } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthService } from './auth.service.js';
import { CreateUsuarioDto } from '../usuarios/dto/create-usuario.dto.js';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { TokenGuard } from './token.guard.js';
import { CloudinaryService } from './cloudinary-service.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly cloudinaryService: CloudinaryService) {}

  @Post('registro')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('imagenPerfil'))
  async register(@Body() createUserDto: CreateUsuarioDto , @UploadedFile() file?: Express.Multer.File) {
    console.log('REGISTRO v2 - BODY:', createUserDto);
    console.log('REGISTRO v2 - FILE:', file);
    return this.authService.register(createUserDto , file);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: Parameters<AuthService['login']>[0]) {
    return this.authService.login(loginDto);
  }

  @Get('verificar')
  @UseGuards(TokenGuard) 
  verificarToken(@Req() req: any) {
    
    return { 
      valido: true, 
      user: req.body.user 
    };
  }
}


