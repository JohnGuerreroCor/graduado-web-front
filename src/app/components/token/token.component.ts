import { Correo } from 'src/app/models/correo';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { TokenService } from 'src/app/services/token.service';
import { Token } from '../../models/token';
import { TokenInternoService } from 'src/app/services/token-interno.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-token',
  templateUrl: './token.component.html',
  styleUrls: ['./token.component.css'],
})
export class TokenComponent implements OnInit {
  public nombre: any =
    this.auth.user.personaNombre + ' ' + this.auth.user.personaApellido;
  public correo: any = this.auth.user.personaEmail;

  codigo!: String;
  codioCorrecto!: String;
  token!: Token[];
  today = new Date();
  cargando: boolean = false;
  @Output() rolEvent = new EventEmitter<any>();

  constructor(
    public auth: AuthService,
    private router: Router,
    public tokenService: TokenService,
    public tokenInternoService: TokenInternoService
  ) {}

  ngOnInit() {
    let parametros: Token = new Token();
    parametros.id = this.auth.user.username;
    parametros.modulo = 74;
    parametros.intento = 0;
    parametros.estado = 1;
    parametros.fechaExpiracion = new Date();
    parametros.fechaExpiracion.setMinutes(
      parametros.fechaExpiracion.getMinutes() + 10
    );
    //REVISA SI HAY TOKEN PENDIENTE
    this.tokenInternoService
      .obtenerToken(this.auth.user.username)
      .subscribe((data) => {
        if (JSON.stringify(data) != '[]' && data[0].intento < 3) {
          this.vigente();
        } else {
          this.tokenInternoService
            .generarToken(parametros)
            .subscribe((data) => {
              if (data > 0) {
                this.tokenInternoService
                  .obtenerToken(this.auth.user.username)
                  .subscribe((data) => {
                    if (JSON.stringify(data) != '[]') {
                      let token: any = data[0].token;
                      this.tokenInternoService
                        .enviarEmailToken(token, this.correo, this.nombre)
                        .subscribe((data) => {});
                    }
                  });
              } else {
              }
            });
        }
      });
    /* this.tokenService.gettokenUsco().subscribe(
      correo => {
        if(JSON.stringify(correo) === '[]'){
          this.router.navigate(['/login']);
        }else{
          this.correo = correo;
        }
      }
    ); */
  }

  generarTokenInterno(token: Token) {
    this.tokenInternoService.generarToken(token).subscribe((data) => {
      if (data > 0) {
      } else {
      }
    });
  }

  validarToken() {
    this.cargando = true;
    if (this.codigo != undefined) {
      this.tokenInternoService
        .obtenerToken(this.auth.user.username)
        .subscribe((data) => {
          let intento: any = data[0].intento;
          switch (intento) {
            case 0:
              data[0].intento = 1;
              if (this.codigo == data[0].token) {
                data[0].estado = 2;
                data[0].fechaFinSesion = new Date();
                data[0].fechaFinSesion.setMinutes(
                  data[0].fechaFinSesion.getMinutes() + 240
                );
                this.tokenInternoService
                  .actualizarToken(data[0])
                  .subscribe((data) => {
                    if (data > 0) {
                      this.correcto();
                      this.router.navigate(['/encuesta-seguimiento']);
                    }
                  });
              } else {
                this.tokenInternoService
                  .actualizarToken(data[0])
                  .subscribe((data) => {
                    if (data > 0) {
                    }
                  });
                this.incorrecto();
                this.cargando = false;
              }
              break;
            case 1:
              data[0].intento = 2;
              if (this.codigo == data[0].token) {
                data[0].estado = 2;
                data[0].fechaFinSesion = new Date();
                data[0].fechaFinSesion.setMinutes(
                  data[0].fechaFinSesion.getMinutes() + 240
                );
                this.tokenInternoService
                  .actualizarToken(data[0])
                  .subscribe((data) => {
                    if (data > 0) {
                      this.router.navigate(['/encuesta-seguimiento']);
                      this.correcto();
                    } else {
                    }
                  });
              } else {
                this.tokenInternoService
                  .actualizarToken(data[0])
                  .subscribe((data) => {
                    if (data > 0) {
                    } else {
                    }
                  });
                this.incorrecto();
                this.cargando = false;
              }
              break;
            case 2:
              data[0].intento = 3;
              if (this.codigo == data[0].token) {
                data[0].estado = 2;
                data[0].fechaFinSesion = new Date();
                data[0].fechaFinSesion.setMinutes(
                  data[0].fechaFinSesion.getMinutes() + 240
                );
                this.tokenInternoService
                  .actualizarToken(data[0])
                  .subscribe((data) => {
                    if (data > 0) {
                      this.correcto();
                      this.router.navigate(['/encuesta-seguimiento']);
                    } else {
                    }
                  });
              } else {
                data[0].estado = 3;
                this.tokenInternoService
                  .actualizarToken(data[0])
                  .subscribe((data) => {
                    if (data > 0) {
                    } else {
                    }
                  });
                this.incorrecto();
                this.nuevoIntento();
                this.cargando = false;
              }
              break;
            default:
              this.nuevoIntento();
              break;
          }
        });
    }
  }

  vigente() {
    const Toast = swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', swal.stopTimer);
        toast.addEventListener('mouseleave', swal.resumeTimer);
      },
    });

    Toast.fire({
      icon: 'warning',
      title: 'Tiene un token vigente.',
    });
  }

  incorrecto() {
    const Toast = swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', swal.stopTimer);
        toast.addEventListener('mouseleave', swal.resumeTimer);
      },
    });

    Toast.fire({
      icon: 'error',
      title: 'Código incorrecto, rectificar.',
    });
  }

  nuevoIntento() {
    const Toast = swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', swal.stopTimer);
        toast.addEventListener('mouseleave', swal.resumeTimer);
      },
    });

    Toast.fire({
      icon: 'info',
      title: 'Token expirado, refresque la página para generar otro token.',
    });
  }

  correcto() {
    swal.fire({
      icon: 'success',
      title: 'Registrado.',
      text: '¡Operación exitosa!',
      showConfirmButton: false,
      timer: 2500,
    });
  }

  fError(er: any): void {
    this.cargando = false;
    let err = er.error.error_description;
    let arr: string[] = err.split(':');
    if (arr[0] == 'Access token expired') {
      this.router.navigate(['/login']);
      this.cargando = false;
    } else {
      this.cargando = false;
    }
  }
}
