import { Component } from '@angular/core';
import { ExpectativaCapacitacionService } from 'src/app/services/expectativa-capacitacion.service';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { GraduadoService } from 'src/app/services/graduado.service';
import { FotoService } from 'src/app/services/foto.service';
import { UbicacionService } from 'src/app/services/ubicacion.service';
import { DatosPersonalesService } from 'src/app/services/datos-personales.service';
import { ExpectativaCapacitacionRespuesta } from 'src/app/models/expectativa-capacitacion-respuesta';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { ExpectativaCapacitacionPregunta } from 'src/app/models/expectativa-capacitacion-pregunta';
import { ExpectativaCapacitacionCuestionario } from 'src/app/models/expectativa-capacitacion-cuestionario';
import { ExpectativaCapacitacionEscala } from 'src/app/models/expectativa-capacitacion-escala';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

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

  listadoPregunta: ExpectativaCapacitacionPregunta[] = [];

  identificacion: string = '';
  cuestionario$!: Observable<ExpectativaCapacitacionCuestionario[]>;

  formDatosPersonales!: FormGroup;

  constructor(
    private activatedRoute: ActivatedRoute,
    public graduadoService: GraduadoService,
    public fotoService: FotoService,
    public ubicacionService: UbicacionService,
    public datosPersonalesService: DatosPersonalesService,
    public expectativaCapacitacionService: ExpectativaCapacitacionService
  ) {
    this.activatedRoute.params.subscribe((params) => {
      this.identificacion = params['id'];
      this.expectativaCapacitacionService
        .obtenerRespuestasIdentificacion(this.identificacion)
        .subscribe((data) => {
          this.listadoRespuestas = data;
        });
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
    console.log('Element:: ', element);

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
