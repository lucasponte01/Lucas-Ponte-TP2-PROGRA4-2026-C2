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
      const user = data.usuario || data.user || data;

      if (user) {
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('nombreUsuario', data.nombreUsuario || 'Usuario');
        localStorage.setItem('correo', data.correo || '');
        localStorage.setItem('descripcionBreve', data.descripcionBreve || '');
        localStorage.setItem('fechaNacimiento', data.fechaNacimiento || '');
        localStorage.setItem('imagenPerfil', data.imagenPerfil || '');
        localStorage.setItem('perfil', data.perfil || user.perfil || 'usuario');
        
        console.log("Sesión guardada correctamente:", user);
        this.router.navigateByUrl('/feed');
      } else {
        console.error("Estructura de respuesta de login desconocida:", data);
      }
    })
  );
}


  verificacion_logeo(): boolean {
    const token = localStorage.getItem('token')
    if (token) {
      return true
    }else{
      return false
    }
    
  }

  verificar_token(): any {
    this.http.post(`${this.apiUrl}/autorizar`, {}).subscribe({
      next: (res: any) => {
        this.router.navigateByUrl('/feed');
      },
      error: (err) => {
        this.logout();
      }
    });
  }

  obtener_usuario(): string | null {
    return localStorage.getItem('userId');
        
  }
  
  extenderSesion() {
    this.http.post(`${this.apiUrl}/refrescar`, {}).subscribe({
      next: (data: any) => {
        if (data.access_token) {
          localStorage.setItem('token', data.access_token);
          console.log("¡Sesión extendida por 15 minutos más!");
        }
      },
      error: (err) => {
        console.error("No se pudo refrescar la sesión", err);
      }
    });
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('nombreUsuario');
    localStorage.removeItem('correo');
    localStorage.removeItem('descripcionBreve');
    localStorage.removeItem('fechaNacimiento');
    localStorage.removeItem('imagenPerfil');
    localStorage.removeItem('perfil');
    console.log("🚀 Redirigiendo al login...");
    this.router.navigateByUrl('/login');
  }
}
