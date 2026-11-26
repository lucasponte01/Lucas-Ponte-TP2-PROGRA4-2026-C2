import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "../../enviroments/environments";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { StatComentarioPeriodo, StatComentarioPublicacion, StatPublicacionUsuario } from "../../interfaces/estadisticas";

@Injectable({ providedIn: 'root' })
export class EstadisticasService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.API_URL}/estadisticas`;

  private Params(desde?: string, hasta?: string): HttpParams {
    let params = new HttpParams();
    if (desde) params = params.set('desde', desde);
    if (hasta) params = params.set('hasta', hasta);
    return params;
  }

  getPublicacionesPorUsuario(desde?: string, hasta?: string): Observable<StatPublicacionUsuario[]> {
    return this.http.get<StatPublicacionUsuario[]>(`${this.baseUrl}/publicaciones-por-usuario`, {
      params: this.Params(desde, hasta),
    });
  }

  getComentariosPorPeriodo(desde?: string, hasta?: string): Observable<StatComentarioPeriodo[]> {
    return this.http.get<StatComentarioPeriodo[]>(`${this.baseUrl}/comentarios-por-periodo`, {
      params: this.Params(desde, hasta),
    });
  }

  getComentariosPorPublicacion(desde?: string, hasta?: string): Observable<StatComentarioPublicacion[]> {
    return this.http.get<StatComentarioPublicacion[]>(`${this.baseUrl}/comentarios-por-publicacion`, {
      params: this.Params(desde, hasta),
    });
  }
}