import { HttpClient } from "@angular/common/http";
import { inject, Service } from "@angular/core";
import { environment } from "../../enviroments/environments";
import { Observable } from "rxjs";
import { AuthService } from "../authServices";



@Service()
export class comentariosServices { 
    private http = inject(HttpClient);
    private authService = inject(AuthService)
    private apiUrl = `${environment.API_URL}/comentarios`;

    obtenerComentarios(publicacionId: string, limit: number, offset: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${publicacionId}?limit=${limit}&offset=${offset}`);
  }

  
  agregarComentario(publicacionId: string, mensaje: string, usuarioId: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { publicacionId, mensaje, usuarioId });
  }

  
  actualizarComentario(comentarioId: string, mensaje: string): Observable<any> {
    const usuarioId = this.authService.getUserId();
    return this.http.put<any>(`${this.apiUrl}/${comentarioId}`, { mensaje , usuarioId: usuarioId });
  }
}