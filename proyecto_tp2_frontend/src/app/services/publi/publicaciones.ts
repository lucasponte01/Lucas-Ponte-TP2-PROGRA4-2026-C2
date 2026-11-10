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
      const userId = this.authService.getUserId();

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

  obtenerPublicacionesConFiltros(limit: number, offset: number, sort: string, userId: string): Observable<Publicacion[]> {
      let params = new HttpParams()
        .set('limit', limit.toString())
        .set('offset', offset.toString())
        .set('sort', sort)
        .set('userId', userId);

      return this.http.get<Publicacion[]>(`${this.apiUrl}/listar`, { params });
    }

  toggleLike(id: string, userId: string): Observable<any> {
      return this.http.post(`${this.apiUrl}/${id}/like`, { userId });
    }

    // Baja lógica de publicación
  eliminarPublicacion(id: string, userId: string, esAdmin: boolean = false): Observable<any> {
      return this.http.request('delete', `${this.apiUrl}/${id}`, { body: { userId, esAdmin } });
    }
}

