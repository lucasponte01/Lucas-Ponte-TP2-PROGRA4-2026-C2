import { HttpClient, HttpHeaders } from "@angular/common/http";
import { inject, Service } from "@angular/core";
import { AuthService } from "../authServices";
import { environment } from "../../enviroments/environments";
import { Router } from "@angular/router";
import { Observable } from "rxjs";

@Service()
export class admin {
  private http = inject(HttpClient);
  private apiUrl = `${environment.API_URL}/admin`;
  private root = inject(Router)

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';

    if(!token){
      this.root.navigate(['/login'])
    }
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  listarUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  crearUsuario(formData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, formData, { headers: this.getHeaders() });
  }

  deshabilitarUsuario(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  rehabilitarUsuario(id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/alta`, {}, { headers: this.getHeaders() });
  }

  actualizar_usuario(id:string , usuario:any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}`, usuario,{ headers: this.getHeaders()})
  }
}