export class Usuario {
  id!: number;
  username!: string;
  password!: string;
  per_codigo!: number;
  nombre!: String;
  apellido!: String;
  identificacion!:string;
  correo!:string;
  uaa!: String;
  roles: string[] = [];
}
