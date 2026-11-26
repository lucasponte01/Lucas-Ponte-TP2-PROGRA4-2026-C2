export interface StatPublicacionUsuario {
  usuarioId: string;
  nombreUsuario: string;
  cantidad: number;
}

export interface StatComentarioPeriodo {
  fecha: string;
  cantidad: number;
}

export interface StatComentarioPublicacion {
  publicacionId: string;
  titulo: string;
  cantidad: number;
}