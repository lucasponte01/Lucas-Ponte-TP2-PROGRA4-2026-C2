import { Component, inject, signal } from '@angular/core';
import { Publicacion } from '../../interfaces/publicaciones';
import { Publicaciones } from '../../services/publi/publicaciones';
import { AuthService } from '../../services/authServices';
import { RouterLink } from '@angular/router';
import { PublicacionesInd } from '../../components/ui/publicaciones-ind/publicaciones-ind';

@Component({
  imports: [RouterLink, PublicacionesInd],
  selector: 'app-perfil',
  styleUrl: './perfil.css',
  templateUrl: './perfil.html',
})
export class Perfil {
  error = signal('');
  publicaciones = signal<Publicacion[]>([]);
  
  private publiService = inject(Publicaciones);
  private authService = inject(AuthService);

  userId = this.authService.getUserId();

  nombreUsuario = signal(localStorage.getItem('nombreUsuario') || 'Usuario Bloop');
  emailUsuario = signal(localStorage.getItem('correo') || 'usuario@bloop.com');
  imagenPerfil = signal(localStorage.getItem('imagenPerfil') || '');
  descripcion = signal(localStorage.getItem('descripcionBreve') || '');
  fecha_nacimiento = signal(localStorage.getItem('fechaNacimiento') || '');


  ngOnInit(): void {
    
    this.cargarMisPublicaciones();
  }

  cargarMisPublicaciones() {
    if (!this.userId) {
      this.error.set('No se encontró el identificador del usuario.');
      return;
    }

    // Usamos el servicio pasando el userId para traer solo lo de este usuario
    this.publiService.obtenerPublicacionesConFiltros(3, 0, 'fecha', this.userId).subscribe({
      next: (data: any) => {
        this.publicaciones.set(data);
      },
      error: (err) => {
        this.error.set('Error al cargar tus publicaciones: ' + (err.error?.message || err.message));
      }
    });
  }

   darLike(id: string) {
  const userId = this.authService.getUserId();

  if (!userId) {
    this.error.set("Debes iniciar sesión para dar me gusta.");
    return;
  }

  this.publiService.toggleLike(id, userId).subscribe({
    next: () => {
      
      
      this.cargarMisPublicaciones();
    }, 
    error: (error) => {
      this.error.set("Error al procesar el me gusta: " + (error.error?.message || error.message));
    }
  });
}
  
  eliminarPublicacion(id: string) {
    if (!this.userId) return;

    this.publiService.eliminarPublicacion(id, this.userId, false).subscribe({
      next: () => {
       
        this.publicaciones.update(pubs => pubs.filter(p => p._id !== id));
      },
      error: (error) => {
        this.error.set("Error al eliminar la publicación: " + (error.error?.message || error.message));
      }
    });
  }

  cerrarsesion(){
    this.authService.logout()
  }
}
