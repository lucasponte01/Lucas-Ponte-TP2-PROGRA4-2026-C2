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
          const token = data.access_token 
          
          if (token) {
            localStorage.setItem('token', token);
            console.log("Token guardado exitosamente en localStorage");
            this.router.navigateByUrl('/feed');
          } else {
            console.error("No se encontró el token en la respuesta:", data);
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

  logout(): void {
    localStorage.removeItem('token');
  }
}
