export interface Publicacion {
  _id?: string;
  titulo: string;
  mensaje: string;
  imagen?: string;
  likesCount?: number;   
  likes?: string[];     
  activo?: boolean;
}