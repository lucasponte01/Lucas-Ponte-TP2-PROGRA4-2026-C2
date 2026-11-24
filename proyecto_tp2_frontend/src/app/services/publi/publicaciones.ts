import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../enviroments/environments';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { Publicacion } from '../../interfaces/publicaciones';
import { AuthService } from '../authServices';

@Service()
export class Publicaciones {
    private http = inject(HttpClient);
    private authService = inject(AuthService);
    private apiUrl = `${environment.API_URL}/publicaciones`;
    private router = inject(Router);

    crearPublicacion(publicacion: FormData): Observable<Publicacion> {
      const userId = this.authService.obtener_usuario();

      if (userId) {
        
        publicacion.append('userId', userId);
      }
      return this.http.post<Publicacion>(`${this.apiUrl}/crear`, publicacion).pipe(
        tap({
          next: (data) => {
            console.log("Publicación creada exitosamente:", data);
            this.router.navigateByUrl('/feed');
          },
          error: (error) => {
            console.error("Error al crear la publicación:", error);
          }
        })
      );
    }

    obtenerPublicaciones(): Observable<Publicacion[]> {
      return this.http.get<Publicacion[]>(`${this.apiUrl}/listar`).pipe(
        tap({
          next: (data) => {
            console.log("Publicaciones obtenidas exitosamente:", data);
          },
          error: (error) => {
          console.error("Error al obtener las publicaciones:", error);
        }
      })
    );
  }

  obtenerPublicaciones_por_id(id: string): Observable<Publicacion> {
    return this.http.get<Publicacion>(`${this.apiUrl}/${id}`);
  }

  obtenerPublicacionesConFiltros(limit: number, offset: number, sort: string, userId?: string): Observable<Publicacion[]> {
    let params = new HttpParams()
      .set('limit', limit.toString())
      .set('offset', offset.toString())
      .set('sort', sort);

  
  if (userId) {
    params = params.set('userId', userId);
  }

  return this.http.get<Publicacion[]>(`${this.apiUrl}/listar`, { params });
}

  Like_dislike(id: string, userId: string): Observable<any> {
      return this.http.post(`${this.apiUrl}/${id}/like`, { userId });
    }

    
  eliminarPublicacion(id: string, userId: string, esAdmin: boolean = false): Observable<any> {
      return this.http.request('delete', `${this.apiUrl}/${id}`, { body: { userId, esAdmin } });
    }

  //parte admin 
  admin_baja(id: string): Observable<any> {
  return this.http.request('delete', `${this.apiUrl}/admin/${id}`);
}


  admin_alta(id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/${id}/alta`, {});
  }
}

