import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UsuariosService } from './usuarios.service.js';
import { CreateUsuarioDto } from './dto/create-usuario.dto.js';
import { UpdateUsuarioDto } from './dto/update-usuario.dto.js';
import { TokenGuard } from '../auth/token.guard.js';
import { AdminGuard } from '../auth/admin.guard.js';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('admin')
@UseGuards(TokenGuard, AdminGuard)
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  @UseInterceptors(FileInterceptor('imagenPerfil'))
  create(@Body() createUsuarioDto: CreateUsuarioDto, @UploadedFile() file?: Express.Multer.File) {
    return this.usuariosService.create(createUsuarioDto , file);
  }

  @Get()
  findAll() {
    return this.usuariosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usuariosService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    return this.usuariosService.update(id, updateUsuarioDto);
  }

  @Delete(':id')
  deshabilitar(@Param('id') id: string) {
    return this.usuariosService.deshabilitar(id);
  }

  
  @Post(':id/alta')
  rehabilitar(@Param('id') id: string) {
    return this.usuariosService.rehabilitar(id);
  }
}
