import { Component, ViewChild, Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { GraduadoService } from 'src/app/services/graduado.service';
import { FotoService } from 'src/app/services/foto.service';
import { UbicacionService } from 'src/app/services/ubicacion.service';
import { DatosPersonalesService } from 'src/app/services/datos-personales.service';
import { MencionReconocimiento } from 'src/app/models/mencion-reconocimiento';
import { MencionReconocimientoService } from 'src/app/services/mencion-reconocimiento.service';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Pais } from 'src/app/models/pais';
import { Departamento } from 'src/app/models/departamento';
import { Municipio } from 'src/app/models/municipio';
import { Ambito } from 'src/app/models/ambito';

@Component({
  selector: 'app-distinciones-reconocimientos',
  templateUrl: './distinciones-reconocimientos.component.html',
  styleUrls: ['./distinciones-reconocimientos.component.css'],
})
export class DistincionesReconocimientosComponent {
  listadoRespuestas: MencionReconocimiento[] = [];

  identificacion: string = '';

  dataSource = new MatTableDataSource<MencionReconocimiento>([]);
  displayedColumns: string[] = [
    'index',
    'ambito',
    'institucion',
    'titulo',
    'municipio',
    'fecha',
    'opciones',
  ];
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

  dialogRef!: MatDialogRef<any>;

  constructor(
    public authService: AuthService,
    public dialog: MatDialog,
    public graduadoService: GraduadoService,
    public fotoService: FotoService,
    public ubicacionService: UbicacionService,
    public datosPersonalesService: DatosPersonalesService,
    public mencionReconocimientoService: MencionReconocimientoService,
    private router: Router
  ) {
    this.identificacion = '' + authService.user.personaIdentificacion;
    this.obtenerMencionReconocimiento();
  }

  obtenerMencionReconocimiento() {
    this.mencionReconocimientoService
      .obtenerMencionesReconocimiento(this.identificacion)
      .subscribe((data) => {
        this.listadoRespuestas = data;
        this.dataSource = new MatTableDataSource<MencionReconocimiento>(data);
        this.paginator.firstPage();
        this.dataSource.paginator = this.paginator;
      });
  }

  registrarFormulario(): void {
    this.dialogRef = this.dialog.open(ModalMembresia, {
      width: '70%',
      disableClose: true,
    });
    this.dialogRef.afterClosed().subscribe(() => {
      this.onModalClosed();
    });
  }

  editarFormulario(element: any): void {
    this.dialogRef = this.dialog.open(ModalMembresia, {
      width: '70%',
      disableClose: true,
      data: { mencionReconocimiento: element },
    });
    this.dialogRef.afterClosed().subscribe(() => {
      this.onModalClosed();
    });
  }

  onModalClosed() {
    this.obtenerMencionReconocimiento();
  }

  actualizarMencionReconocimiento(
    mencionReconocimiento: MencionReconocimiento
  ) {
    this.mencionReconocimientoService
      .actualizarMencionReconocimiento(mencionReconocimiento)
      .subscribe(
        (data) => {
          if (data > 0) {
            this.obtenerMencionReconocimiento();
          } else {
            this.mensajeError();
          }
        },
        (err) => this.fError(err)
      );
  }

  eliminarMencionReconocimiento(element: MencionReconocimiento) {
    Swal.fire({
      title: '¿Está seguro de eliminar este elemento?',
      text: 'La siguiente operación será irreversible',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#00c053',
      cancelButtonColor: '#ffc107',
      confirmButtonText: 'Si, estoy seguro',
      cancelButtonText: 'Cancelar opreación',
    }).then((result) => {
      if (result.isConfirmed) {
        element.estado = 0;
        this.actualizarMencionReconocimiento(element);
        Swal.fire({
          icon: 'success',
          title: 'Elemento borrado.',
          confirmButtonColor: '#006983',
          confirmButtonText: 'Listo',
        });
      }
    });
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
}

//// MODAL

@Component({
  selector: 'modal-membresia',
  templateUrl: 'modal-membresia.html',
  styleUrls: ['./distinciones-reconocimientos.component.css'],
})
export class ModalMembresia {
  listadoAmbitos: Ambito[] = [];
  listadoPaises: Pais[] = [];
  listadoDepartamento: Departamento[] = [];
  listadoMunicipio: Municipio[] = [];
  editar: boolean = false;

  formularioMencionReconocimiento!: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<ModalMembresia>,
    public dialog: MatDialog,
    public authService: AuthService,
    public graduadoService: GraduadoService,
    private formBuilder: FormBuilder,
    public fotoService: FotoService,
    public mencionReconocimientoService: MencionReconocimientoService,
    public ubicacionService: UbicacionService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (this.authService.validacionToken()) {
      this.obtenerAmbitos();
      this.obtenerPais();
      this.crearFormularioMencionReconocimiento();
      if (JSON.stringify(data) !== 'null') {
        this.editarMencionReconocimiento(data.mencionReconocimiento);
      }
    }
  }

  private crearFormularioMencionReconocimiento(): void {
    this.formularioMencionReconocimiento = this.formBuilder.group({
      codigo: new FormControl(''),
      personaCodigo: new FormControl(''),
      institucion: new FormControl('', Validators.required),
      tipo: new FormControl('', Validators.required),
      ambitoCodigo: new FormControl('', Validators.required),
      titulo: new FormControl('', Validators.required),
      descripcion: new FormControl(''),
      paisCodigo: new FormControl(''),
      departamentoCodigo: new FormControl(''),
      municipioCodigo: new FormControl('', Validators.required),
      fecha: new FormControl('', Validators.required),
      estado: new FormControl(''),
    });
  }

  obtenerAmbitos() {
    this.mencionReconocimientoService.obtenerAmbitos().subscribe((data) => {
      this.listadoAmbitos = data;
    });
  }

  obtenerPais() {
    this.ubicacionService.obtenerPaises().subscribe((data) => {
      this.listadoPaises = data;
    });
  }

  obtenerDepartamentos(element: number) {
    this.listadoDepartamento = [];
    this.ubicacionService
      .obtenerDepartamentosPorPais(element)
      .subscribe((data) => {
        this.listadoDepartamento = data;
      });
  }

  obtenerMunicipios(element: number) {
    this.listadoMunicipio = [];
    this.ubicacionService
      .obtenerMunicipiosPorDepartamento(element)
      .subscribe((data) => {
        this.listadoMunicipio = data;
      });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  generarMencionReconocimiento(): void {
    let mencionReconocimiento: MencionReconocimiento =
      new MencionReconocimiento();
    mencionReconocimiento.codigo =
      this.formularioMencionReconocimiento.get('codigo')!.value;
    mencionReconocimiento.personaCodigo = this.authService.user.personaCodigo;
    mencionReconocimiento.institucion =
      this.formularioMencionReconocimiento.get('institucion')!.value;
    mencionReconocimiento.tipo =
      this.formularioMencionReconocimiento.get('tipo')!.value;
    mencionReconocimiento.ambitoCodigo =
      this.formularioMencionReconocimiento.get('ambitoCodigo')!.value;
    mencionReconocimiento.titulo =
      this.formularioMencionReconocimiento.get('titulo')!.value;
    mencionReconocimiento.municipioCodigo =
      this.formularioMencionReconocimiento.get('municipioCodigo')!.value;
    mencionReconocimiento.fecha =
      this.formularioMencionReconocimiento.get('fecha')!.value;
    mencionReconocimiento.estado =
      this.formularioMencionReconocimiento.get('estado')!.value;
    if (this.editar) {
      this.actualizarMencionReconocimiento(mencionReconocimiento);
    } else {
      this.registrarMencionReconocimiento(mencionReconocimiento);
    }
  }

  registrarMencionReconocimiento(mencionReconocimiento: MencionReconocimiento) {
    this.mencionReconocimientoService
      .registrarMencionReconocimiento(mencionReconocimiento)
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
            this.cancelar();
            this.dialogRef.close();
            this.crearFormularioMencionReconocimiento();
          } else {
            this.mensajeError();
          }
        },
        (err) => this.fError(err)
      );
  }

  actualizarMencionReconocimiento(
    mencionReconocimiento: MencionReconocimiento
  ) {
    this.mencionReconocimientoService
      .actualizarMencionReconocimiento(mencionReconocimiento)
      .subscribe(
        (data) => {
          if (data > 0) {
            Swal.fire({
              icon: 'success',
              title: 'Actualizado',
              text: '¡Operación exitosa!',
              showConfirmButton: false,
            });
            this.dialogRef.close();
            this.cancelar();
          } else {
            this.mensajeError();
          }
        },
        (err) => this.fError(err)
      );
  }

  editarMencionReconocimiento(element: MencionReconocimiento) {
    this.editar = true;
    this.formularioMencionReconocimiento
      .get('codigo')!
      .setValue(element.codigo);
    this.formularioMencionReconocimiento
      .get('personaCodigo')!
      .setValue(element.personaCodigo);
    this.formularioMencionReconocimiento
      .get('institucion')!
      .setValue(element.institucion);
    this.formularioMencionReconocimiento.get('tipo')!.setValue(element.tipo);
    this.formularioMencionReconocimiento
      .get('ambitoCodigo')!
      .setValue(element.ambitoCodigo);
    this.formularioMencionReconocimiento
      .get('titulo')!
      .setValue(element.titulo);
    this.formularioMencionReconocimiento
      .get('descripcion')!
      .setValue(element.descripcion);
    this.formularioMencionReconocimiento
      .get('paisCodigo')!
      .setValue(element.paisCodigo);
    this.obtenerDepartamentos(element.paisCodigo);
    this.formularioMencionReconocimiento
      .get('departamentoCodigo')!
      .setValue(element.departamentoCodigo);
    this.formularioMencionReconocimiento
      .get('municipioCodigo')!
      .setValue(element.municipioCodigo);
    this.obtenerMunicipios(element.departamentoCodigo);
    let fecha = new Date(element.fecha + ' 0:00:00');
    this.formularioMencionReconocimiento.get('fecha')!.setValue(fecha);
    this.formularioMencionReconocimiento
      .get('estado')!
      .setValue(element.estado);
  }

  cancelar() {
    this.formularioMencionReconocimiento.reset();
    this.crearFormularioMencionReconocimiento();
    this.obtenerPais();
    this.editar = false;
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
}
