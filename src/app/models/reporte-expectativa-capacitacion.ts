export class ReporteExpectativaCapacitacion {
  personaCodigo!: number;
  personaNombre!: string;
  personaApellido!: string;
  fecha!: string;
  columnas!: {
    [key: string]: string | null;
  };
}
