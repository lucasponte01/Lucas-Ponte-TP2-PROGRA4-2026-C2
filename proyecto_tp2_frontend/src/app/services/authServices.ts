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
      // Verificamos si los datos vienen dentro de un objeto 'usuario' o directamente en la raíz
      const user = data.usuario || data.user || data;

      const userId = user._id || user.id || data.userId;
      const token = data.access_token || data.token;

      if (userId && token) {
        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId);
        
        // Guardamos explícitamente los campos que vienen de tu base de datos
        localStorage.setItem('nombreUsuario', user.nombreUsuario || user.nombre || 'Usuario');
        localStorage.setItem('correo', user.correo || user.email || '');
        localStorage.setItem('descripcionBreve', user.descripcionBreve || '');
        localStorage.setItem('imagenPerfil', user.imagenPerfil || '');
        
        console.log("Sesión guardada correctamente:", user);
        this.router.navigateByUrl('/feed');
      } else {
        console.error("Estructura de respuesta de login desconocida:", data);
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
