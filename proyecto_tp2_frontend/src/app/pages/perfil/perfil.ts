import { Component, inject, signal } from '@angular/core';
import { Publicacion } from '../../interfaces/publicaciones';
import { Publicaciones } from '../../services/publi/publicaciones';
import { AuthService } from '../../services/authServices';

@Component({
  imports: [],
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
  nombreUsuario = localStorage.getItem('nombreUsuario') || 'Usuario Bloop'; // O cómo guardes el nombre en localStorage/auth

  ngOnInit(): void {
    this.cargarMisPublicaciones();
  }

  cargarMisPublicaciones() {
    if (!this.userId) {
      this.error.set('No se encontró el identificador del usuario.');
      return;
    }

    // Usamos el servicio pasando el userId para traer solo lo de este usuario
    this.publiService.obtenerPublicacionesConFiltros(10, 0, 'fecha', this.userId).subscribe({
      next: (data: any) => {
        this.publicaciones.set(data);
      },
      error: (err) => {
        this.error.set('Error al cargar tus publicaciones: ' + (err.error?.message || err.message));
      }
    });
  }
  
  eliminarPublicacion(id: string) {
    if (!this.userId) return;

    this.publiService.eliminarPublicacion(id, this.userId, false).subscribe({
      next: () => {
        // Quitamos la publicación de la signal local al instante
        this.publicaciones.update(pubs => pubs.filter(p => p._id !== id));
      },
      error: (error) => {
        this.error.set("Error al eliminar la publicación: " + (error.error?.message || error.message));
      }
    });
  }
}
