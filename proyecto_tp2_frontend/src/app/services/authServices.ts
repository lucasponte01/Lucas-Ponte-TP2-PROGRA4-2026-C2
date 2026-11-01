import { HttpClient } from '@angular/common/http';
import { inject, Service, signal } from '@angular/core';
import { environment } from '../enviroments/environments';
import { Observable, tap } from 'rxjs';

@Service()
export class AuthService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.API_URL}/auth`;

    register(userData: any): Observable<any> {
        // Importante: withCredentials: true permite que el navegador reciba y guarde la cookie HttpOnly
        return this.http.post(`${this.apiUrl}/registro`, userData).pipe(tap((data: any) => {
          const token = data.token;
          console.log('Respuesta del backend:', data);
          localStorage.setItem('token', token);
          
        }));
    }

    login(credentials: { identificador: string; contrasena: string }): Observable<any> {
      return this.http.post(`${this.apiUrl}/login`, credentials).pipe(tap((data: any) => {
        const token = data.access.access_token;
      
        localStorage.setItem('token', token);
      }));
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
