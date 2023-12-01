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
import { SatisfaccionFormacionService } from 'src/app/services/satisfaccion-formacion.service';
import { CompetenciaEscala } from 'src/app/models/competencia-escala';
import { CompetenciaRespuesta } from 'src/app/models/competencia-respuesta';
import { CompetenciaPregunta } from 'src/app/models/competencia-pregunta';

@Component({
  selector: 'app-satisfaccion-formacion',
  templateUrl: './satisfaccion-formacion.component.html',
  styleUrls: ['./satisfaccion-formacion.component.css'],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { subscriptSizing: 'dynamic' },
    },
  ],
})
export class SatisfaccionFormacionComponent {
  options: any[] = [
    { codigo: 1, nombre: 'Muy insatisfecho' },
    { codigo: 2, nombre: 'Insatisfecho' },
    { codigo: 3, nombre: 'Satisfecho' },
    { codigo: 4, nombre: 'Muy satisfecho' },
  ];

  listadoEscalaUno: CompetenciaEscala[] = [];
  listadoEscalaDos: CompetenciaEscala[] = [];

  listadoPreguntas: CompetenciaPregunta[] = [];

  editar: boolean = false;

  identificacion: string = '';

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
    public expectativaCapacitacionService: ExpectativaCapacitacionService,
    public satisfaccionFormacionService: SatisfaccionFormacionService,
    public situacionLaboralService: SituacionLaboralService
  ) {
    this.identificacion = '' + authService.user.identificacion;
    this.obteneListadoRespuestasDos();
    this.obtenerPreguntas();
    this.crearFormulario();
    this.satisfaccionFormacionService
      .obtenerRespuestasTipoUnoIdentificacion(this.identificacion)
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
      codigo11: new FormControl(''),
      codigo12: new FormControl(''),
      codigo13: new FormControl(''),
      codigo14: new FormControl(''),
      codigo15: new FormControl(''),
      codigo16: new FormControl(''),
      codigo17: new FormControl(''),
      codigo18: new FormControl(''),
      codigo19: new FormControl(''),
      codigo20: new FormControl(''),
      codigo21: new FormControl(''),
      codigo22: new FormControl(''),
      codigo23: new FormControl(''),
      codigo24: new FormControl(''),
      codigo25: new FormControl(''),
      codigo26: new FormControl(''),
      codigo27: new FormControl(''),
      codigo28: new FormControl(''),
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
      codigoRespuesta11: new FormControl('', Validators.required),
      codigoRespuesta12: new FormControl('', Validators.required),
      codigoRespuesta13: new FormControl('', Validators.required),
      codigoRespuesta14: new FormControl('', Validators.required),
      codigoRespuesta15: new FormControl('', Validators.required),
      codigoRespuesta16: new FormControl('', Validators.required),
      codigoRespuesta17: new FormControl('', Validators.required),
      codigoRespuesta18: new FormControl('', Validators.required),
      codigoRespuesta19: new FormControl('', Validators.required),
      codigoRespuesta20: new FormControl('', Validators.required),
      codigoRespuesta21: new FormControl('', Validators.required),
      codigoRespuesta22: new FormControl('', Validators.required),
      codigoRespuesta23: new FormControl('', Validators.required),
      codigoRespuesta24: new FormControl('', Validators.required),
      codigoRespuesta25: new FormControl('', Validators.required),
      codigoRespuesta26: new FormControl('', Validators.required),
      codigoRespuesta27: new FormControl('', Validators.required),
      codigoRespuesta28: new FormControl('', Validators.required),
      fecha: new FormControl(''),
      estado: new FormControl(''),
    });
  }

  generarFormulario(): void {
    let element: CompetenciaRespuesta = new CompetenciaRespuesta();
    element.personaCodigo = this.authService.user.per_codigo;
    if (this.editar) {
      for (let index = 0; index < 28; index++) {
        element.codigo = this.formulario.get('codigo' + (index + 1))!.value;
        element.preguntaCodigo = this.listadoPreguntas[index].codigo;
        element.respuestaCodigo = this.formulario.get(
          'codigoRespuesta' + (index + 1)
        )!.value;
        element.fechaRespuesta = new Date();
        this.actualizarFormulario(element);
      }
    } else {
      for (let index = 0; index < 28; index++) {
        element.preguntaCodigo = this.listadoPreguntas[index].codigo;
        element.respuestaCodigo = +this.formulario.get(
          'codigoRespuesta' + (index + 1)
        )!.value;
        this.registrarFormulario(element);
      }
    }
  }

  registrarFormulario(competenciaRespuesta: CompetenciaRespuesta) {
    this.satisfaccionFormacionService.registrar(competenciaRespuesta).subscribe(
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

  actualizarFormulario(competenciaRespuesta: CompetenciaRespuesta) {
    this.satisfaccionFormacionService
      .actualizar(competenciaRespuesta)
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

  editarExpectativaCapacitacionRespuesta(
    element: ExpectativaCapacitacionRespuesta[]
  ) {

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
    this.formulario.get('codigo11')!.setValue(element[10].codigo);
    this.formulario.get('codigo12')!.setValue(element[11].codigo);
    this.formulario.get('codigo13')!.setValue(element[12].codigo);
    this.formulario.get('codigo14')!.setValue(element[13].codigo);
    this.formulario.get('codigo15')!.setValue(element[14].codigo);
    this.formulario.get('codigo16')!.setValue(element[15].codigo);
    this.formulario.get('codigo17')!.setValue(element[16].codigo);
    this.formulario.get('codigo18')!.setValue(element[17].codigo);
    this.formulario.get('codigo19')!.setValue(element[18].codigo);
    this.formulario.get('codigo20')!.setValue(element[19].codigo);
    this.formulario.get('codigo21')!.setValue(element[20].codigo);
    this.formulario.get('codigo22')!.setValue(element[21].codigo);
    this.formulario.get('codigo23')!.setValue(element[22].codigo);
    this.formulario.get('codigo24')!.setValue(element[23].codigo);
    this.formulario.get('codigo25')!.setValue(element[24].codigo);
    this.formulario.get('codigo26')!.setValue(element[25].codigo);
    this.formulario.get('codigo27')!.setValue(element[26].codigo);
    this.formulario.get('codigo28')!.setValue(element[27].codigo);
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
    this.formulario
      .get('codigoRespuesta11')!
      .setValue(element[10].respuestaCodigo);
    this.formulario
      .get('codigoRespuesta12')!
      .setValue(element[11].respuestaCodigo);
    this.formulario
      .get('codigoRespuesta13')!
      .setValue(element[12].respuestaCodigo);
    this.formulario
      .get('codigoRespuesta14')!
      .setValue(element[13].respuestaCodigo);
    this.formulario
      .get('codigoRespuesta15')!
      .setValue(element[14].respuestaCodigo);
    this.formulario
      .get('codigoRespuesta16')!
      .setValue(element[15].respuestaCodigo);
    this.formulario
      .get('codigoRespuesta17')!
      .setValue(element[16].respuestaCodigo);
    this.formulario
      .get('codigoRespuesta18')!
      .setValue(element[17].respuestaCodigo);
    this.formulario
      .get('codigoRespuesta19')!
      .setValue(element[18].respuestaCodigo);
    this.formulario
      .get('codigoRespuesta20')!
      .setValue(element[19].respuestaCodigo);
    this.formulario
      .get('codigoRespuesta21')!
      .setValue(element[20].respuestaCodigo);
    this.formulario
      .get('codigoRespuesta22')!
      .setValue(element[21].respuestaCodigo);
    this.formulario
      .get('codigoRespuesta23')!
      .setValue(element[22].respuestaCodigo);
    this.formulario
      .get('codigoRespuesta24')!
      .setValue(element[23].respuestaCodigo);
    this.formulario
      .get('codigoRespuesta25')!
      .setValue(element[24].respuestaCodigo);
    this.formulario
      .get('codigoRespuesta26')!
      .setValue(element[25].respuestaCodigo);
    this.formulario
      .get('codigoRespuesta27')!
      .setValue(element[26].respuestaCodigo);
    this.formulario
      .get('codigoRespuesta28')!
      .setValue(element[27].respuestaCodigo);
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

  obteneListadoRespuestasDos() {
    this.satisfaccionFormacionService.obtenerEscala(4).subscribe((data) => {
      this.listadoEscalaDos = data;
    });
  }

  obtenerPreguntas() {
    this.satisfaccionFormacionService.obtenerPregunta().subscribe((data) => {
      this.listadoPreguntas = data;
    });
  }

  crearCuestionario(
    element: ExpectativaCapacitacionPregunta[]
  ): Observable<ExpectativaCapacitacionCuestionario[]> {

    return forkJoin(
      element.map((pregunta) =>
        this.expectativaCapacitacionService.obtenerEscala(pregunta.codigo).pipe(
          map((respuestas: any) => ({
            codigo: pregunta.codigo,
            pregunta: pregunta.pregunta,
            respuestas: respuestas,
          }))
        )
      )
    );
  }
}
