import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, Query } from '@nestjs/common';
import { PublicacionesService } from './publicaciones.service.js';
import { CreatePublicacioneDto } from './dto/create-publicacione.dto.js';
import { UpdatePublicacioneDto } from './dto/update-publicacione.dto.js';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('publicaciones')
export class PublicacionesController {
  constructor(private readonly publicacionesService: PublicacionesService) {}
  
  @Post('crear')
  @UseInterceptors(FileInterceptor('imagen'))
  create(
  @Body() createPublicacioneDto: CreatePublicacioneDto, 
  @UploadedFile() file?: Express.Multer.File) {
    return this.publicacionesService.create(createPublicacioneDto, file);
  }
//limit y offset son para paginacion de bd sql, sort es para ordenar y userId es para filtrar por usuario
  @Get('listar')
  findAll(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
    @Query('sort') sort?: string,         
    @Query('userId') userId?: string,
  ) {
    return this.publicacionesService.findAll({ limit, offset, sort, userId });
  }

  @Post(':id/like')
  darLike(@Param('id') id: string, @Body('userId') userId: string) {
    return this.publicacionesService.toggleLike(id, userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.publicacionesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePublicacioneDto: UpdatePublicacioneDto) {
    return this.publicacionesService.update(id, updatePublicacioneDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, 
    @Body('userId') userId: string,
    @Body('esAdmin') esAdmin: boolean) {
    return this.publicacionesService.remove(id, userId, esAdmin || false );
  }
}
