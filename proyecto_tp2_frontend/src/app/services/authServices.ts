import { HttpClient } from '@angular/common/http';
import { inject, Service, signal } from '@angular/core';
import { environment } from '../enviroments/environments';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Service()
export class AuthService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.API_URL}/auth`;
    private router = inject(Router);

  register(userData: any ): Observable<any> {
          
    return this.http.post(`${this.apiUrl}/registro`, userData ).pipe(tap((data: any) => {
            
    const token = data.access_token;
            
      if (token) {
        localStorage.setItem('token', token);
        console.log("Token guardado exitosamente en localStorage");
        this.router.navigateByUrl('/login');
      } else {
       console.error("No se encontró el token en la respuesta:", data);
     }
            
    }));
  }

  login(credentials: { identificador: string; contrasena: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((data: any) => {
        // Extraemos el objeto usuario anidado (según tu backend viene en data.usuario)
        const usuario = data.usuario || data.user || data;

        const userId = usuario._id || usuario.id || data.userId;
        const token = data.access_token || data.token;

        if (userId && token) {
          localStorage.setItem('token', token);
          localStorage.setItem('userId', userId);
          // Leemos desde el objeto usuario y usamos nombreUsuario o nombre
          localStorage.setItem('nombreUsuario', usuario.nombreUsuario || usuario.nombre || 'Usuario');
          localStorage.setItem('correo', usuario.correo || usuario.email || '');
          localStorage.setItem('fechaNacimiento', usuario.fechaNacimiento || '');
          localStorage.setItem('descripcionBreve', usuario.descripcionBreve || '');
          localStorage.setItem('imagenPerfil', usuario.imagenPerfil || '');
          
          console.log("Datos de sesión guardados exitosamente en localStorage");
          this.router.navigateByUrl('/feed');
        } else {
          console.error("No se encontró el token o el ID en la respuesta:", data);
        }
      })
    );
  }


  isLoggedIn(): boolean {
    const token = localStorage.getItem('token')
    if (token) {
      return true
    }else{
      return false
    }
    
  }

  verifyToken(): Observable<any> {
    return this.http.get(`${this.apiUrl}/verificar`);
  }

  getUserId(): string | null {
        return localStorage.getItem('userId');
        
      }


  logout(): void {
    localStorage.removeItem('token');
  }
}
