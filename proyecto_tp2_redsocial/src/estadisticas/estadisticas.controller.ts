import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { EstadisticasService } from './estadisticas.service.js';
import { CreateEstadisticaDto } from './dto/create-estadistica.dto.js';
import { UpdateEstadisticaDto } from './dto/update-estadistica.dto.js';
import { AdminGuard } from '../auth/admin.guard.js';
import { TokenGuard } from '../auth/token.guard.js';

@Controller('estadisticas')
@UseGuards(AdminGuard , TokenGuard)
export class EstadisticasController {
  constructor(private readonly estadisticasService: EstadisticasService) {}

 @Get('publicaciones-por-usuario')
  publicacionesPorUsuario(
    @Query('desde') desde?: string,
    @Query('hasta') hasta?: string,
  ) {
    return this.estadisticasService.obtenerPublicacionesPorUsuario(desde, hasta);
  }


  @Get('comentarios-por-periodo')
  comentariosPorPeriodo(
    @Query('desde') desde?: string,
    @Query('hasta') hasta?: string,
  ) {
    return this.estadisticasService.obtenerComentariosPorPeriodo(desde, hasta);
  }

 
  @Get('comentarios-por-publicacion')
  comentariosPorPublicacion(
    @Query('desde') desde?: string,
    @Query('hasta') hasta?: string,
  ) {
    return this.estadisticasService.obtenerComentariosPorPublicacion(desde, hasta);
  }
}
