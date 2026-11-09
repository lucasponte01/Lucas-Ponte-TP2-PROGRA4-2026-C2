import { Component, inject, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Publicaciones } from '../../services/publi/publicaciones';
import { Publicacion } from '../../interfaces/publicaciones';
import { PublicacionesInd } from '../../components/ui/publicaciones-ind/publicaciones-ind';
import { AuthService } from '../../services/authServices';

@Component({
  imports: [ReactiveFormsModule, RouterLink, PublicacionesInd],
  selector: 'app-feed',
  styleUrl: './feed.css',
  templateUrl: './feed.html',
})
export class Feed implements OnInit{
  error = signal("");
  publi_services = inject(Publicaciones);
  publicaciones = signal<Publicacion[]>([]);
  private authService = inject(AuthService);
  currentSort = signal('fecha'); // 'fecha' o 'likes'
  limit = 5;
  offset = 0;

ngOnInit(): void {
    this.cargarFeed();
  }

  cargarFeed() {
    this.error.set(""); 
    this.publi_services.obtenerPublicacionesConFiltros(this.limit, this.offset, this.currentSort()).subscribe((data: any) => {
      this.publicaciones.set(data);
    }, (error) => {
      this.error.set("Error al obtener las publicaciones. Por favor, inténtelo de nuevo más tarde." + error.message);
    });   
  }

  cambiarOrden(event: any) {
    this.currentSort.set(event.target.value);
    this.offset = 0; 
    this.cargarFeed();
  }

  darLike(id: string) {
    const userId = this.authService.getUserId();

    if (!userId) {
      this.error.set("Debes iniciar sesión para dar me gusta.");
      return;
    }

    this.publi_services.toggleLike(id, userId).subscribe({
      next: () => {
        this.cargarFeed();
      }, 
      error: (error) => {
        this.error.set("Error al procesar el me gusta: " + (error.error?.message || error.message));
      }
    });
  }

  eliminarPublicacion(id: string ,) {
    const userId = this.authService.getUserId();
    this.publi_services.eliminarPublicacion(id,userId!,false).subscribe({
          next: () => {
            this.cargarFeed();
          }, 
          error: (error) => {
            this.error.set("Error al eliminar la publicación: " + (error.error?.message || error.message));
          }
    })};
  }

