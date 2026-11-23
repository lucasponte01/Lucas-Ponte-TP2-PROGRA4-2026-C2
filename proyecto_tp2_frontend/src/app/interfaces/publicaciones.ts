export interface Publicacion {
  _id?: string;
  titulo: string;
  mensaje: string;
  imagen?: string;
  usuario:{nombreUsuario:string};
  likesCount?: number;   
  likes?: string[];     
  activo?: boolean;
  createdAt?: string;
}