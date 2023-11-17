import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { NivelAcademico } from '../models/nivel-academico';
import { HistorialAcademico } from '../models/historial-academico';

@Injectable({
  providedIn: 'root',
})
export class FormacionAcademicaService {
  private url: string = `${environment.URL_BACKEND}/formacionAcademica`;
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

  obtenerNivelesAcademicos(): Observable<NivelAcademico[]> {
    return this.http
      .get<NivelAcademico[]>(`${this.url}/obtener-niveles-academicos`, {
        headers: this.aggAutorizacionHeader(),
      })
      .pipe(
        catchError((e) => {
          if (this.isNoAutorizado(e)) {
            return throwError(e);
          }
          return throwError(e);
        })
      );
  }

  obtenerHistorialAcademico(id: string): Observable<HistorialAcademico[]> {
    return this.http
      .get<HistorialAcademico[]>(
        `${this.url}/obtener-historial-academico/${id}`,
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

  obtenerReporteHistorialAcademico(
    inicio: any,
    fin: any
  ): Observable<HistorialAcademico[]> {
    return this.http
      .get<HistorialAcademico[]>(
        `${this.url}/obtener-reporte-historial-academico/${inicio}/${fin}`,
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

  registrarHistorialAcademico(
    historialAcademico: HistorialAcademico
  ): Observable<number> {
    return this.http.put<number>(
      `${this.url}/registrar-historial-academico`,
      historialAcademico,
      { headers: this.aggAutorizacionHeader() }
    );
  }

  actualizarHistorialAcademico(
    historialAcademico: HistorialAcademico
  ): Observable<number> {
    return this.http.put<number>(
      `${this.url}/actualizar-historial-academico`,
      historialAcademico,
      { headers: this.aggAutorizacionHeader() }
    );
  }
}
