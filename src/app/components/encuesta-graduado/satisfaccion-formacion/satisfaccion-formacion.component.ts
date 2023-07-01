import { Component } from '@angular/core';

@Component({
  selector: 'app-satisfaccion-formacion',
  templateUrl: './satisfaccion-formacion.component.html',
  styleUrls: ['./satisfaccion-formacion.component.css']
})
export class SatisfaccionFormacionComponent {

  questions: string[] = [
    'Pregunta 1',
    'Pregunta 2',
    'Pregunta 3',
    // Agrega aquí más preguntas
  ];

  options: number[] = [1, 2, 3, 4];

  responses: any[] = [];
  responses1: any[] = [];
  responses2: any[] = [];

  submitSurvey() {
    // Aquí puedes realizar acciones con las respuestas recopiladas
    console.log(this.responses);
  }

}
