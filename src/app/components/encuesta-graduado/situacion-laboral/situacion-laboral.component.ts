import { Component } from '@angular/core';
import { ExpectativaCapacitacionService } from 'src/app/services/expectativa-capacitacion.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GraduadoService } from 'src/app/services/graduado.service';
import { FotoService } from 'src/app/services/foto.service';
import { UbicacionService } from 'src/app/services/ubicacion.service';
import { DatosPersonalesService } from 'src/app/services/datos-personales.service';
import { ExpectativaCapacitacionRespuesta } from 'src/app/models/expectativa-capacitacion-respuesta';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { ExpectativaCapacitacionPregunta } from 'src/app/models/expectativa-capacitacion-pregunta';
import { ExpectativaCapacitacionCuestionario } from 'src/app/models/expectativa-capacitacion-cuestionario';
import { AuthService } from 'src/app/services/auth.service';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { SituacionLaboralService } from 'src/app/services/situacion-laboral.service';
import { SituacionLaboralEscala } from 'src/app/models/situacion-laboral-escala';
import { SituacionLaboralRespuesta } from 'src/app/models/situacion-laboral-respuesta';

@Component({
  selector: 'app-situacion-laboral',
  templateUrl: './situacion-laboral.component.html',
  styleUrls: ['./situacion-laboral.component.css'],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { subscriptSizing: 'dynamic' },
    },
  ],
})
export class SituacionLaboralComponent {
  listadoRespuestas: ExpectativaCapacitacionRespuesta[] = [];

  listadoEscalaUno: SituacionLaboralEscala[] = [];
  listadoEscalaDos: SituacionLaboralEscala[] = [];
  listadoEscalaTres: SituacionLaboralEscala[] = [];
  listadoEscalaCuatro: SituacionLaboralEscala[] = [];
  listadoEscalaCinco: SituacionLaboralEscala[] = [];
  listadoEscalaSeis: SituacionLaboralEscala[] = [];
  listadoEscalaSiete: SituacionLaboralEscala[] = [];
  listadoEscalaOcho: SituacionLaboralEscala[] = [];
  listadoEscalaNueve: SituacionLaboralEscala[] = [];
  listadoEscalaDiez: SituacionLaboralEscala[] = [];

  listadoPregunta: ExpectativaCapacitacionPregunta[] = [];

  editar: boolean = false;

  identificacion: string = '';
  cuestionario$!: Observable<ExpectativaCapacitacionCuestionario[]>;

  formulario!: FormGroup;

  constructor(
    private activatedRoute: ActivatedRoute,
    public authService: AuthService,
    public graduadoService: GraduadoService,
    public fotoService: FotoService,
    private formBuilder: FormBuilder,
    public ubicacionService: UbicacionService,
    public datosPersonalesService: DatosPersonalesService,
    private router: Router,

    public situacionLaboralService: SituacionLaboralService
  ) {
    this.identificacion = '' + authService.user.personaCodigo;
    this.obteneListadoRespuestasUno();
    this.obteneListadoRespuestasDos();
    this.obteneListadoRespuestasTres();
    this.obteneListadoRespuestasCuatro();
    this.obteneListadoRespuestasCinco();
    this.obteneListadoRespuestasSeis();
    this.obteneListadoRespuestasSiete();
    this.obteneListadoRespuestasOcho();
    this.obteneListadoRespuestasNueve();
    this.obteneListadoRespuestasDiez();
    this.crearFormulario();
    this.situacionLaboralService
      .obtenerRespuestasIdentificacion(this.identificacion)
      .subscribe((data) => {
        if (JSON.stringify(data) != '[]') {
          this.editar = true;
          this.editarExpectativaCapacitacionRespuesta(data);
        }
      });
  }

  private crearFormulario(): void {
    this.formulario = this.formBuilder.group({
      codigo1: new FormControl(''),
      codigo2: new FormControl(''),
      codigo3: new FormControl(''),
      codigo4: new FormControl(''),
      codigo5: new FormControl(''),
      codigo6: new FormControl(''),
      codigo7: new FormControl(''),
      codigo8: new FormControl(''),
      codigo9: new FormControl(''),
      codigo10: new FormControl(''),
      personaCodigo: new FormControl(''),
      codigoRespuesta1: new FormControl('', Validators.required),
      codigoRespuesta2: new FormControl('', Validators.required),
      codigoRespuesta3: new FormControl('', Validators.required),
      codigoRespuesta4: new FormControl('', Validators.required),
      codigoRespuesta5: new FormControl('', Validators.required),
      codigoRespuesta6: new FormControl('', Validators.required),
      codigoRespuesta7: new FormControl('', Validators.required),
      codigoRespuesta8: new FormControl('', Validators.required),
      codigoRespuesta9: new FormControl('', Validators.required),
      codigoRespuesta10: new FormControl('', Validators.required),
      fecha: new FormControl(''),
      estado: new FormControl(''),
    });
  }

  generarFormulario(): void {
    let element: SituacionLaboralRespuesta = new SituacionLaboralRespuesta();
    element.personaCodigo = this.authService.user.personaCodigo;
    if (this.editar) {
      for (let index = 0; index < 10; index++) {
        element.codigo = this.formulario.get('codigo' + (index + 1))!.value;
        element.preguntaCodigo = index + 1;
        element.respuestaCodigo = this.formulario.get(
          'codigoRespuesta' + (index + 1)
        )!.value;
        element.fechaRespuesta = new Date();
        this.actualizarFormulario(element);
      }
    } else {
      for (let index = 0; index < 10; index++) {
        element.preguntaCodigo = index + 1;
        element.respuestaCodigo = this.formulario.get(
          'codigoRespuesta' + (index + 1)
        )!.value;
        this.registrarFormulario(element);
      }
    }
  }

  registrarFormulario(situacionLaboralRespuesta: SituacionLaboralRespuesta) {
    this.situacionLaboralService.registrar(situacionLaboralRespuesta).subscribe(
      (data) => {
        if (data > 0) {
          Swal.fire({
            icon: 'success',
            title: 'Registrado',
            text: '¡Operación exitosa!',
            showConfirmButton: false,
            timer: 2500,
          });
        } else {
          this.mensajeError();
        }
      },
      (err) => this.fError(err)
    );
  }

  actualizarFormulario(situacionLaboralRespuesta: SituacionLaboralRespuesta) {
    this.situacionLaboralService
      .actualizar(situacionLaboralRespuesta)
      .subscribe(
        (data) => {
          if (data > 0) {
            Swal.fire({
              icon: 'success',
              title: 'Actualizado',
              text: '¡Operación exitosa!',
              showConfirmButton: false,
            });
          } else {
            this.mensajeError();
          }
        },
        (err) => this.fError(err)
      );
  }

  editarExpectativaCapacitacionRespuesta(element: SituacionLaboralRespuesta[]) {
    this.editar = true;
    this.formulario.get('codigo1')!.setValue(element[0].codigo);
    this.formulario.get('codigo2')!.setValue(element[1].codigo);
    this.formulario.get('codigo3')!.setValue(element[2].codigo);
    this.formulario.get('codigo4')!.setValue(element[3].codigo);
    this.formulario.get('codigo5')!.setValue(element[4].codigo);
    this.formulario.get('codigo6')!.setValue(element[5].codigo);
    this.formulario.get('codigo7')!.setValue(element[6].codigo);
    this.formulario.get('codigo8')!.setValue(element[7].codigo);
    this.formulario.get('codigo9')!.setValue(element[8].codigo);
    this.formulario.get('codigo10')!.setValue(element[9].codigo);
    this.formulario.get('personaCodigo')!.setValue(element[0].personaCodigo);
    this.formulario
      .get('codigoRespuesta1')!
      .setValue(element[0].respuestaCodigo);
    this.formulario
      .get('codigoRespuesta2')!
      .setValue(element[1].respuestaCodigo);
    this.formulario
      .get('codigoRespuesta3')!
      .setValue(element[2].respuestaCodigo);
    this.formulario
      .get('codigoRespuesta4')!
      .setValue(element[3].respuestaCodigo);
    this.formulario
      .get('codigoRespuesta5')!
      .setValue(element[4].respuestaCodigo);
    this.formulario
      .get('codigoRespuesta6')!
      .setValue(element[5].respuestaCodigo);
    this.formulario
      .get('codigoRespuesta7')!
      .setValue(element[6].respuestaCodigo);
    this.formulario
      .get('codigoRespuesta8')!
      .setValue(element[7].respuestaCodigo);
    this.formulario
      .get('codigoRespuesta9')!
      .setValue(element[8].respuestaCodigo);
    this.formulario
      .get('codigoRespuesta10')!
      .setValue(element[9].respuestaCodigo);
    this.formulario.get('fecha')!.setValue(element[0].fechaRespuesta);
  }

  mensajeSuccses() {
    Swal.fire({
      icon: 'success',
      title: 'Proceso realizado',
      text: '¡Operación exitosa!',
      showConfirmButton: false,
      timer: 2500,
    });
  }

  mensajeError() {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo completar el proceso.',
      showConfirmButton: true,
      confirmButtonText: 'Listo',
      confirmButtonColor: '#8f141b',
    });
  }

  fError(er: any): void {
    let err = er.error.error_description;
    let arr: string[] = err.split(':');
    if (arr[0] == 'Access token expired') {
      this.authService.logout();
      this.router.navigate(['login']);
    } else {
      this.mensajeError();
    }
  }

  obteneListadoRespuestasUno() {
    this.situacionLaboralService.obtenerEscala(1).subscribe((data) => {
      this.listadoEscalaUno = data;
    });
  }

  obteneListadoRespuestasDos() {
    this.situacionLaboralService.obtenerEscala(2).subscribe((data) => {
      this.listadoEscalaDos = data;
    });
  }

  obteneListadoRespuestasTres() {
    this.situacionLaboralService.obtenerEscala(3).subscribe((data) => {
      this.listadoEscalaTres = data;
    });
  }

  obteneListadoRespuestasCuatro() {
    this.situacionLaboralService.obtenerEscala(4).subscribe((data) => {
      this.listadoEscalaCuatro = data;
    });
  }

  obteneListadoRespuestasCinco() {
    this.situacionLaboralService.obtenerEscala(5).subscribe((data) => {
      this.listadoEscalaCinco = data;
    });
  }

  obteneListadoRespuestasSeis() {
    this.situacionLaboralService.obtenerEscala(6).subscribe((data) => {
      this.listadoEscalaSeis = data;
    });
  }

  obteneListadoRespuestasSiete() {
    this.situacionLaboralService.obtenerEscala(7).subscribe((data) => {
      this.listadoEscalaSiete = data;
    });
  }

  obteneListadoRespuestasOcho() {
    this.situacionLaboralService.obtenerEscala(8).subscribe((data) => {
      this.listadoEscalaOcho = data;
    });
  }

  obteneListadoRespuestasNueve() {
    this.situacionLaboralService.obtenerEscala(9).subscribe((data) => {
      this.listadoEscalaNueve = data;
    });
  }

  obteneListadoRespuestasDiez() {
    this.situacionLaboralService.obtenerEscala(10).subscribe((data) => {
      this.listadoEscalaDiez = data;
    });
  }
}
