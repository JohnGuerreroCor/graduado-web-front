import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { SoporteExpedicion } from '../models/soporte-expedicion';

@Injectable({
  providedIn: 'root',
})
export class SoporteExpedicionService {
  private url: string = `${environment.URL_BACKEND}/datos`;
  private httpHeaders = new HttpHeaders();

  userLogeado: String = this.authservice.user.username;

  private uaa = this.authservice.obtenerUaa();

  private perCodigo = this.authservice.obtenerPerCodigo();

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

  private isNoAutorizado(e: any): boolean {
    if (e.status == 401 || e.status == 403) {
      if (this.authservice.isAuthenticated()) {
        this.authservice.logout();
      }
      this.router.navigate(['login']);
      return true;
    }
    return false;
  }

  registrarSoporte(archivo: File, json: SoporteExpedicion): Observable<null> {
    let formData: FormData = new FormData();
    formData.set('archivo', archivo);
    formData.set('json', JSON.stringify(json));
    return this.http.post<null>(
      `${this.url}/registrar-soporte-expedicion/${this.userLogeado}/${this.perCodigo}/${this.uaa}`,
      formData,
      { headers: this.aggAutorizacionHeader() }
    );
  }

  actualizarSoporte(soporte: SoporteExpedicion): Observable<number> {
    return this.http.put<number>(
      `${this.url}/actualizar-soporte-expedicion/${this.userLogeado}`,
      soporte,
      { headers: this.aggAutorizacionHeader() }
    );
  }

  mirarSoporte(codigo: number): Observable<any> {
    return this.http.get<any>(
      `${this.url}/mirar-archivo/${codigo}/${this.userLogeado}`,
      { headers: this.aggAutorizacionHeader(), responseType: 'blob' as 'json' }
    );
  }

  enviarEmail(email: String): Observable<any> {
    return this.http.get<any>(`${this.url}/enviar-email-rector/${email}`, {
      headers: this.aggAutorizacionHeader(),
    });
  }
}
