import { HttpClient } from "@angular/common/http";
import { inject, Service } from "@angular/core";
import { AuthService } from "../authServices";
import { environment } from "../../enviroments/environments";
import { Router } from "@angular/router";
import { Observable } from "rxjs";

@Service()
export class admin {
    private http = inject(HttpClient);
    private authService = inject(AuthService);
    private apiUrl = `${environment.API_URL}/admin`;
    private router = inject(Router);


//parte admin 
  admin_baja(id: string): Observable<any> {
    const userId = this.authService.obtener_usuario();
    const token = localStorage.getItem('token');
  return this.http.request('delete', `${this.apiUrl}/${id}`,{body: { userId, esAdmin: true} , headers: {
      Authorization: `Bearer ${token}`,
    },});
}


  admin_alta(id: string): Observable<any> {
    const userId = this.authService.obtener_usuario();
    const token = localStorage.getItem('token');
    return this.http.post(`${this.apiUrl}/${id}/alta`, {body: { userId, esAdmin: true },headers: {
      Authorization: `Bearer ${token}`,
    },});
  }
}