import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { ExpectativaCapacitacionEscala } from '../models/expectativa-capacitacion-escala';
import { ExpectativaCapacitacionRespuesta } from '../models/expectativa-capacitacion-respuesta';
import { ReporteExpectativaCapacitacion } from '../models/reporte-expectativa-capacitacion';
import { ExpectativaCapacitacionPregunta } from '../models/expectativa-capacitacion-pregunta';

@Injectable({
  providedIn: 'root',
})
export class ExpectativaCapacitacionService {
  private url: string = `${environment.URL_BACKEND}/expectativacapacitacion`;
  private httpHeaders = new HttpHeaders({ 'Content-type': 'application/json' });

  userLogeado: String = this.authservice.user.username;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authservice: AuthService
  ) {}

  private aggAutorizacionHeader(): HttpHeaders {
    let token = this.authservice.Token;
    if (token != null) {
      return this.httpHeaders.append('Authorization', 'Bearer ' + token);
    }
    return this.httpHeaders;
  }

  private isNoAutorizado(e: { status: number }): boolean {
    if (e.status == 401 || e.status == 403) {
      if (this.authservice.isAuthenticated()) {
        this.authservice.logout();
      }
      this.router.navigate(['login']);
      return true;
    }
    return false;
  }

  obtenerPregunta(): Observable<ExpectativaCapacitacionPregunta[]> {
    return this.http
      .get<ExpectativaCapacitacionPregunta[]>(
        `${this.url}/obtener-pregunta`,
        {
          headers: this.aggAutorizacionHeader(),
        }
      )
      .pipe(
        catchError((e) => {
          if (this.isNoAutorizado(e)) {
            return throwError(e);
          }
          return throwError(e);
        })
      );
  }

  obtenerEscala(codigo: number): Observable<ExpectativaCapacitacionEscala[]> {
    return this.http
      .get<ExpectativaCapacitacionEscala[]>(
        `${this.url}/obtener-escala/${codigo}`,
        {
          headers: this.aggAutorizacionHeader(),
        }
      )
      .pipe(
        catchError((e) => {
          if (this.isNoAutorizado(e)) {
            return throwError(e);
          }
          return throwError(e);
        })
      );
  }

  obtenerRespuestasIdentificacion(
    id: string
  ): Observable<ExpectativaCapacitacionRespuesta[]> {
    return this.http
      .get<ExpectativaCapacitacionRespuesta[]>(
        `${this.url}/obtener-respuestas-identificacion/${id}`,
        {
          headers: this.aggAutorizacionHeader(),
        }
      )
      .pipe(
        catchError((e) => {
          if (this.isNoAutorizado(e)) {
            return throwError(e);
          }
          return throwError(e);
        })
      );
  }

  obtenerRerporteExpectativaCapacitacion(
    inicio: any,
    fin: any
  ): Observable<ReporteExpectativaCapacitacion[]> {
    return this.http
      .get<ReporteExpectativaCapacitacion[]>(
        `${this.url}/obtener-reporte-excpectativa-capacitacion/${inicio}/${fin}`,
        {
          headers: this.aggAutorizacionHeader(),
        }
      )
      .pipe(
        catchError((e) => {
          if (this.isNoAutorizado(e)) {
            return throwError(e);
          }
          return throwError(e);
        })
      );
  }
}
