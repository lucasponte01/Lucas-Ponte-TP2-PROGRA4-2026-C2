import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../enviroments/environments';
import { Observable } from 'rxjs';

@Service()
export class AuthService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.API_URL}/auth`;

    register(userData: any): Observable<any> {
        // Importante: withCredentials: true permite que el navegador reciba y guarde la cookie HttpOnly
        return this.http.post(`${this.apiUrl}/registro`, userData, {
        withCredentials: true 
        });
    }

    login(credentials: { identificador: string; contrasena: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials, {
      withCredentials: true
    });
  }
}
