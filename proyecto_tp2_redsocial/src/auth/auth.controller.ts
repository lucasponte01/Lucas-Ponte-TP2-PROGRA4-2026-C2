import { Controller, Post, Body, HttpCode, HttpStatus, UseInterceptors, UploadedFile, UseGuards, Get, Req } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthService } from './auth.service.js';
import { CreateUsuarioDto } from '../usuarios/dto/create-usuario.dto.js';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { TokenGuard } from './token.guard.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('registro')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() createUserDto: CreateUsuarioDto) {
    // Como aún no hay imágenes, pasamos un string vacío o directo el DTO
    return this.authService.register(createUserDto, '');
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


