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
import { ExpectativaCapacitacionEscala } from 'src/app/models/expectativa-capacitacion-escala';
import { AuthService } from 'src/app/services/auth.service';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-expectativas-capacitacion',
  templateUrl: './expectativas-capacitacion.component.html',
  styleUrls: ['./expectativas-capacitacion.component.css'],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { subscriptSizing: 'dynamic' },
    },
  ],
})
export class ExpectativasCapacitacionComponent {
  listadoRespuestas: ExpectativaCapacitacionRespuesta[] = [];

  listadoEscalaUno: ExpectativaCapacitacionEscala[] = [];
  listadoEscalaDos: ExpectativaCapacitacionEscala[] = [];
  listadoEscalaTres: ExpectativaCapacitacionEscala[] = [];

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
    public expectativaCapacitacionService: ExpectativaCapacitacionService
  ) {
    this.identificacion = '' + authService.user.identificacion;
    this.obteneListadoRespuestasUno();
    this.obteneListadoRespuestasDos();
    this.obteneListadoRespuestasTres();
    this.crearFormulario();
    this.expectativaCapacitacionService
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
      personaCodigo: new FormControl(''),
      codigoRespuesta1: new FormControl('', Validators.required),
      codigoRespuesta2: new FormControl('', Validators.required),
      codigoRespuesta3: new FormControl('', Validators.required),
      fecha: new FormControl(''),
      estado: new FormControl(''),
    });
  }

  generarFormulario(): void {
    let element: ExpectativaCapacitacionRespuesta =
      new ExpectativaCapacitacionRespuesta();
    element.personaCodigo = this.authService.user.per_codigo;
    if (this.editar) {
      for (let index = 0; index < 3; index++) {
        element.codigo = this.formulario.get('codigo' + (index + 1))!.value;
        element.preguntaCodigo = index + 1;
        element.respuestaCodigo = this.formulario.get(
          'codigoRespuesta' + (index + 1)
        )!.value;
        element.fechaRespuesta = new Date();
        this.actualizarFormulario(element);
      }
    } else {
      for (let index = 0; index < 3; index++) {
        element.preguntaCodigo = index + 1;
        element.respuestaCodigo = this.formulario.get(
          'codigoRespuesta' + (index + 1)
        )!.value;
        this.registrarFormulario(element);
      }
    }
  }

  registrarFormulario(
    expectativaCapacitacionRespuesta: ExpectativaCapacitacionRespuesta
  ) {
    this.expectativaCapacitacionService
      .registrarExpectativaCapacitacionRespuesta(
        expectativaCapacitacionRespuesta
      )
      .subscribe(
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

  actualizarFormulario(
    expectativaCapacitacionRespuesta: ExpectativaCapacitacionRespuesta
  ) {
    this.expectativaCapacitacionService
      .actualizarExpectativaCapacitacionRespuesta(
        expectativaCapacitacionRespuesta
      )
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
    this.expectativaCapacitacionService.obtenerEscala(1).subscribe((data) => {
      this.listadoEscalaUno = data;
    });
  }

  obteneListadoRespuestasDos() {
    this.expectativaCapacitacionService.obtenerEscala(2).subscribe((data) => {
      this.listadoEscalaDos = data;
    });
  }

  obteneListadoRespuestasTres() {
    this.expectativaCapacitacionService.obtenerEscala(3).subscribe((data) => {
      this.listadoEscalaTres = data;
    });
  }

  ngOnInit() {
    this.expectativaCapacitacionService.obtenerPregunta().subscribe((data) => {
      this.listadoPregunta = data;
      this.cuestionario$ = this.crearCuestionario(data);
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
