import { Controller, Post, Body, HttpCode, HttpStatus, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
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
  
  @HttpCode(HttpStatus.CREATED) // Status 201 requerido por el TP
  @UseInterceptors(
    FileInterceptor('imagenPerfil', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async register(
      @Body() createUserDto: CreateUsuarioDto,
      @UploadedFile() file?: Express.Multer.File,
    ) {
      const imagenUrl = file ? `/uploads/${file.filename}` : '';
      return this.authService.register(createUserDto, imagenUrl);
    }

    @Post('login')
    
    @HttpCode(HttpStatus.OK)
    async login(@Body() loginDto: Parameters<AuthService['login']>[0]) {
      return this.authService.login(loginDto);
  }

}
