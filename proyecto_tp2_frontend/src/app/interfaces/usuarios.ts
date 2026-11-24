export interface UsuarioAdmin {
  _id: string;
  nombre: string;
  apellido: string;
  correo: string;
  nombreUsuario: string;
  fechaNacimiento: string;
  descripcionBreve?: string;
  imagenPerfil?: string;
  perfil: 'usuario' | 'administrador';
  activo: boolean;
}