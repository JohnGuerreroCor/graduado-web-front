import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { DatosPersonales } from '../models/datos-personales';
import { IdentificacionTipos } from '../models/identificacion-tipos';
import { EstadoCivil } from '../models/estado-civil';
import { GrupoSanguineo } from '../models/grupo-sanguineo';
import { DatosContacto } from '../models/datos-contacto';
import { DatosResidencia } from '../models/datos-residencia';
import { DatosExpedicion } from '../models/datos-expedicion';

@Injectable({
  providedIn: 'root',
})
export class DatosPersonalesService {
  private url: string = `${environment.URL_BACKEND}/datos`;
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

  obtenerDatosPersonales(codigo: string): Observable<DatosPersonales[]> {
    return this.http
      .get<DatosPersonales[]>(
        `${this.url}/obtener-datos-personales/${codigo}/${this.userLogeado}`,
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

  obtenerTiposIdentificacion(): Observable<IdentificacionTipos[]> {
    return this.http
      .get<IdentificacionTipos[]>(
        `${this.url}/obtener-tipos-identificacion/${this.userLogeado}`,
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

  obtenerEstadosCivil(): Observable<EstadoCivil[]> {
    return this.http
      .get<EstadoCivil[]>(
        `${this.url}/obtener-estados-civil/${this.userLogeado}`,
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

  obtenerGruposSanguineos(): Observable<GrupoSanguineo[]> {
    return this.http
      .get<GrupoSanguineo[]>(
        `${this.url}/obtener-grupos-sanguineos/${this.userLogeado}`,
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

  actualizarDatosContacto(contacto: DatosContacto): Observable<number> {
    return this.http.put<number>(
      `${this.url}/actualizar-datos-contacto/${this.userLogeado}`,
      contacto,
      { headers: this.aggAutorizacionHeader() }
    );
  }

  actualizarDatosResidencia(residencia: DatosResidencia): Observable<number> {
    return this.http.put<number>(
      `${this.url}/actualizar-datos-residencia/${this.userLogeado}`,
      residencia,
      { headers: this.aggAutorizacionHeader() }
    );
  }

  actualizarDatosExpedicion(expedicion: DatosExpedicion): Observable<number> {
    return this.http.put<number>(
      `${this.url}/actualizar-datos-expedicion/${this.userLogeado}`,
      expedicion,
      { headers: this.aggAutorizacionHeader() }
    );
  }
}
