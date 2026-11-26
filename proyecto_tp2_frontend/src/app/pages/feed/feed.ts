import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Publicaciones } from '../../services/publi/publicaciones';
import { Publicacion } from '../../interfaces/publicaciones';
import { PublicacionesInd } from '../../components/ui/publicaciones-ind/publicaciones-ind';
import { AuthService } from '../../services/authServices';
import { ModalInactividad } from '../../components/ui/modal-inactividad/modal-inactividad';
import { admin } from '../../services/admin/admin';

@Component({
  imports: [ReactiveFormsModule, RouterLink, PublicacionesInd, ModalInactividad],
  selector: 'app-feed',
  styleUrl: './feed.css',
  templateUrl: './feed.html',
})
export class Feed implements OnInit{
  error = signal("");
  
  publi_services = inject(Publicaciones);
  admin_service =inject(admin)
  publicaciones = signal<Publicacion[]>([]);
  private authService = inject(AuthService);
  currentSort = signal(''); 
  limit = 5;
  offset = 0;
  total = signal(0);
  currentPage = 0;
  
  hasMore = signal(false);

  vistaActiva = signal<'usuario' | 'admin'>('usuario');
  esAdmin = computed(() => localStorage.getItem('perfil') === 'administrador');

ngOnInit(): void {
  const perfil = localStorage.getItem('perfil');
  if (perfil === 'administrador') {
    this.vistaActiva.set('admin');
    this.cargarFeedAdmin();
  } else {
    this.vistaActiva.set('usuario');
    this.cargarFeedUsuario();
  }
}

  cambiarVista(vista: 'usuario' |'admin' ) {
    this.vistaActiva.set(vista);
    if (this.vistaActiva() === 'admin') {
      this.cargarFeedAdmin();
    } else {
      this.cargarFeedUsuario();
    }
  }

  cargarFeedUsuario() {
    this.error.set(""); 
    this.offset = this.currentPage * this.limit;

    this.publi_services.obtenerPublicacionesConFiltros(this.limit, this.offset, this.currentSort()).subscribe((data: any) => {
      if (data.length === 0 && this.currentPage > 0) {
        this.currentPage--;
        this.cargarFeedUsuario();
        return;
      }
      this.publicaciones.set(data);
      
      if( data.length === this.limit && data.length > 0){
        this.hasMore.set(true)
      }

      this.vistaActiva() === 'admin'
      
    }, (error) => {
      this.error.set("Error al obtener las publicaciones. Por favor, inténtelo de nuevo más tarde." + error.message);
    });   
  }

  cambiarOrden(event: any) {
    this.currentSort.set(event.target.value);
    if (this.vistaActiva() === 'admin') {
          this.currentPage = 0; 
          this.cargarFeedAdmin();
        } else {
          this.currentPage = 0; 
          this.cargarFeedUsuario();
        }
    
  }

 darLike(id: string) {
    const userId = this.authService.obtener_usuario();

    if (!userId) {
      this.error.set("Debes iniciar sesión para dar me gusta.");
      return;
    }

    this.publi_services.Like_dislike(id, userId).subscribe({
      next: () => {
        if (this.vistaActiva() === 'admin') {
          this.cargarFeedAdmin();
        } else {
          this.cargarFeedUsuario();
        }
      },
      error: (error) => {
        this.error.set("Error al procesar el me gusta: " + (error.error?.message || error.message));
      }
    });
  }

  eliminarPublicacion(id: string ,) {
    const userId = this.authService.obtener_usuario();
    this.publi_services.eliminarPublicacion(id,userId!,false).subscribe({
          next: () => {
            this.publicaciones.update(pubs => pubs.filter(p => p._id !== id));
            this.cargarFeedUsuario();
          }, 
          error: (error) => {
            this.error.set("Error al eliminar la publicación: " + (error.error?.message || error.message));
          }
    })};


    paginaSiguiente() {
      if (this.hasMore() === true) {
        this.currentPage++;
        if (this.vistaActiva() === 'admin') {
          this.cargarFeedAdmin();
        } else {
          this.cargarFeedUsuario();
        }
      }
    }

    paginaAnterior() {
      if (this.currentPage > 0) {
        this.currentPage--;
        if (this.vistaActiva() === 'admin') {
          this.cargarFeedAdmin();
        } else {
          this.cargarFeedUsuario();
        }
      }
    }

  cerrarsesion(){
    this.authService.logout()
  }

  //parte admin 
  cargarFeedAdmin() {
    this.error.set('');
    this.offset = this.currentPage * this.limit;

    this.publi_services
      .obtenerPublicacionesConFiltros(this.limit, this.offset, this.currentSort(), undefined, true)
      .subscribe({
        next: (data: any) => {
          if (data.length === 0 && this.currentPage > 0) {
            this.currentPage--;
            this.cargarFeedAdmin();
            return;
          }
          this.publicaciones.set(data);
          this.hasMore.set(data.length === this.limit);
        },
        error: (error) => {
          this.error.set(
            'Error al obtener las publicaciones: ' + (error.error?.message || error.message)
          );
        },
      });
  }

  baja_publi_admin(id: string) {
    if (!this.esAdmin()) return;
    const userId = this.authService.obtener_usuario() || '';

    this.publi_services.eliminarPublicacion(id, userId, true).subscribe({
      next: () => {
        this.cargarFeedAdmin();
      },
      error: (error) => {
        this.error.set('Error al dar de baja la publicación: ' + (error.error?.message || error.message));},
    });
  }
  alta_publi_admin(id: string) {
    if (!this.esAdmin()) return;

    this.publi_services.rehabilitarPublicacion(id, true).subscribe({
      next: () => {
        this.cargarFeedAdmin();
      },
      error: (error) => {
        this.error.set('Error al dar de alta la publicación: ' + (error.error?.message || error.message));},
    });
  }
}
