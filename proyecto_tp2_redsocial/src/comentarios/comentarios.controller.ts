import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put } from '@nestjs/common';
import { ComentariosService } from './comentarios.service.js';
import { CreateComentarioDto } from './dto/create-comentario.dto.js';
import { UpdateComentarioDto } from './dto/update-comentario.dto.js';

@Controller('comentarios')
export class ComentariosController {
  constructor(private readonly comentariosService: ComentariosService) {}

  @Post()
  create(@Body() createComentarioDto: CreateComentarioDto) {
    return this.comentariosService.create(createComentarioDto);}

  @Get(':publicacionId')
  findAll(
    @Param('publicacionId') publicacionId: string,
    @Query('limit') limit: number = 5,
    @Query('offset') offset: number = 0,
  ) {
    return this.comentariosService.findAll(publicacionId, limit, offset);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.comentariosService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() UpdateComentarioDto: UpdateComentarioDto) {
    return this.comentariosService.update(+id, UpdateComentarioDto.mensaje );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.comentariosService.remove(+id);
  }
}
