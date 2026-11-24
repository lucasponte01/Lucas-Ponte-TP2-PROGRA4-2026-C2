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
  this.vistaActiva.set(perfil === 'administrador' ? 'admin' : 'usuario');
  this.cargarFeed();
}

  cambiarVista(vista: 'usuario' |'admin' ) {
    this.vistaActiva.set(vista);
    if (vista === 'usuario') {
      this.cargarFeed();
    }
  }

  cargarFeed() {
    this.error.set(""); 
    this.offset = this.currentPage * this.limit;

    this.publi_services.obtenerPublicacionesConFiltros(this.limit, this.offset, this.currentSort()).subscribe((data: any) => {
      if (data.length === 0 && this.currentPage > 0) {
        this.currentPage--;
        this.cargarFeed();
        return;
      }
      this.publicaciones.set(data);
      
      if( data.length === this.limit && data.length > 0){
        this.hasMore.set(true)
      }
      
    }, (error) => {
      this.error.set("Error al obtener las publicaciones. Por favor, inténtelo de nuevo más tarde." + error.message);
    });   
  }

  cambiarOrden(event: any) {
    this.currentSort.set(event.target.value);
    this.currentPage = 0; 
    this.cargarFeed();
  }

 darLike(id: string) {
  const userId = this.authService.obtener_usuario();

  if (!userId) {
    this.error.set("Debes iniciar sesión para dar me gusta.");
    return;
  }

  this.publi_services.Like_dislike(id, userId).subscribe({
    next: () => {
      
      
      this.cargarFeed();
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
            this.cargarFeed();
          }, 
          error: (error) => {
            this.error.set("Error al eliminar la publicación: " + (error.error?.message || error.message));
          }
    })};


    paginaSiguiente() {
      if (this.hasMore() === true) {
        this.currentPage++;
        this.cargarFeed();
      }
    }

    paginaAnterior() {
      if (this.currentPage > 0) {
        this.currentPage--;
        this.cargarFeed();
      }
  }

  cerrarsesion(){
    this.authService.logout()
  }

  //parte admin 
  baja_publi_admin(id: string){
      this.admin_service.admin_baja(id).subscribe({
      next: () => {
        this.cargarFeed();
      },
      error: (error) => {
        this.error.set(
          'Error al dar de baja la publicación: ' + (error.error?.message || error.message),);
        },
    });
  }
  alta_publi_admin(id: string) {
    this.admin_service.admin_baja(id).subscribe({
      next: () => {
        this.cargarFeed();
      },
      error: (error) => {
        this.error.set(
          'Error al dar de alta la publicación: ' + (error.error?.message || error.message),);
      },
    });
  }
}
