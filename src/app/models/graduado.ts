import { Persona } from './persona';
import { Programa } from './programa';

export class Graduado {
  codigo!: String;
  fechaGrado!: Date;
  codigoPlan!: number;
  persona!: Persona;
  programa!: Programa;
}
