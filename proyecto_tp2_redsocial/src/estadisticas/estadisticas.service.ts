import { Injectable } from '@nestjs/common';
import { CreateEstadisticaDto } from './dto/create-estadistica.dto.js';
import { UpdateEstadisticaDto } from './dto/update-estadistica.dto.js';
import { InjectModel } from '@nestjs/mongoose';
import { Publicacione } from '../publicaciones/entities/publicacione.entity.js';
import { Comentario } from '../comentarios/entities/comentario.entity.js';
import { Model } from 'mongoose';


function construirRangoFecha(desde?: string, hasta?: string) {
  const rango: Record<string, Date> = {};

  if (desde) {
    const fechaDesde = new Date(desde);
    if (!isNaN(fechaDesde.getTime())) {
      rango.$gte = fechaDesde;
    }
  }

  if (hasta) {
    const fechaHasta = new Date(hasta);
    if (!isNaN(fechaHasta.getTime())) {
      rango.$lte = fechaHasta;
    }
  }

  return Object.keys(rango).length > 0 ? { createdAt: rango } : {};
}

@Injectable()
export class EstadisticasService {
  constructor(
    @InjectModel(Publicacione.name) private publiModel: Model<Publicacione>,
    @InjectModel(Comentario.name) private comentarioModel: Model<Comentario>,
  ) {}
  
  
  private construirFiltroFecha(desde?: string, hasta?: string) {
    const rango: Record<string, Date> = {};
    if (desde) {
      const d = new Date(desde);
      if (!isNaN(d.getTime())) rango.$gte = d;
    }
    if (hasta) {
      const h = new Date(hasta);
      if (!isNaN(h.getTime())) rango.$lte = h;
    }
    return Object.keys(rango).length > 0 ? { createdAt: rango } : {};
  }

  async obtenerPublicacionesPorUsuario(desde?: string, hasta?: string) {
    const matchFecha = this.construirFiltroFecha(desde, hasta);

    return this.publiModel.aggregate([
      {
        $match: {
          activo: { $ne: false },
          ...matchFecha,
        },
      },
      {
        $group: {
          _id: '$usuario',
          cantidad: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'usuarios', 
          localField: '_id',
          foreignField: '_id',
          as: 'usuarioInfo',
        },
      },
      {
        $unwind: {
          path: '$usuarioInfo',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 0,
          usuarioId: '$_id',
          nombreUsuario: { $ifNull: ['$usuarioInfo.nombreUsuario', 'Usuario sin nombre'] },
          cantidad: 1,
        },
      },
      { $sort: { cantidad: -1 } },
    ]);
  }

 
  async obtenerComentariosPorPeriodo(desde?: string, hasta?: string) {
    const matchFecha = this.construirFiltroFecha(desde, hasta);

    return this.comentarioModel.aggregate([
      {
        $match: {
          ...matchFecha,
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          cantidad: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          fecha: '$_id',
          cantidad: 1,
        },
      },
      { $sort: { fecha: 1 } },
    ]);
  }

  
  async obtenerComentariosPorPublicacion(desde?: string, hasta?: string) {
    const matchFecha = this.construirFiltroFecha(desde, hasta);

    return this.comentarioModel.aggregate([
      {
        $match: {
          ...matchFecha,
        },
      },
      {
        $group: {
          _id: '$publicacionId',
          cantidad: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'publicaciones', 
          localField: '_id',
          foreignField: '_id',
          as: 'publiInfo',
        },
      },
      {
        $unwind: {
          path: '$publiInfo',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 0,
          publicacionId: '$_id',
          titulo: { $ifNull: ['$publiInfo.titulo', 'Publicación sin título'] },
          cantidad: 1,
        },
      },
      { $sort: { cantidad: -1 } },
      { $limit: 10 },
    ]);
  }
}
