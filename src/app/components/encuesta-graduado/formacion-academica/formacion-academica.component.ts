import { Component, ViewChild, Inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { Graduado } from 'src/app/models/graduado';
import { GraduadoService } from 'src/app/services/graduado.service';
import { FotoService } from 'src/app/services/foto.service';
import { NivelAcademico } from 'src/app/models/nivel-academico';
import { HistorialAcademico } from 'src/app/models/historial-academico';
import { FormacionAcademicaService } from 'src/app/services/formacion-academica.service';
import { UbicacionService } from 'src/app/services/ubicacion.service';
import { AuthService } from 'src/app/services/auth.service';
import { DatePipe } from '@angular/common';
import { Pais } from 'src/app/models/pais';
import { Departamento } from 'src/app/models/departamento';
import { Municipio } from 'src/app/models/municipio';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-formacion-academica',
  templateUrl: './formacion-academica.component.html',
  styleUrls: ['./formacion-academica.component.css'],
})
export class FormacionAcademicaComponent {
  graduado: Graduado[] = [];
  identificacion: string = '';
  estudianteActivo: boolean = false;
  listadoNivelAacademico: NivelAcademico[] = [];
  listadoHistorialAcademico: HistorialAcademico[] = [];

  dataSource = new MatTableDataSource<Graduado>([]);
  displayedColumns: string[] = [
    'index',
    'codigo',
    'programa',
    'nivelAcademico',
    'sede',
    'fechaGrado',
  ];
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

  dataSourceHistorialAcademico = new MatTableDataSource<HistorialAcademico>([]);
  displayedColumnsHistorialAcademico: string[] = [
    'index',
    'titulo',
    'nivelAcademico',
    'municipio',
    'institucion',
    'fechaGrado',
    'opciones',
  ];
  @ViewChild(MatPaginator, { static: false })
  paginatorHistorialAcademico!: MatPaginator;

  dialogRef!: MatDialogRef<any>;

  constructor(
    public authService: AuthService,
    public dialog: MatDialog,
    public graduadoService: GraduadoService,
    public fotoService: FotoService,
    public formacionAcademicaService: FormacionAcademicaService,
    private datePipe: DatePipe,
    private router: Router
  ) {
    this.identificacion = '' + authService.user.personaIdentificacion;
    this.dataSource = new MatTableDataSource<Graduado>([]);
    this.buscarGraduado(this.identificacion);
    this.obtenerHistorialAcademico();
  }

  registrarFormulario(): void {
    this.dialogRef = this.dialog.open(ModalEstudio, {
      width: '70%',
      disableClose: true,
    });
    this.dialogRef.afterClosed().subscribe(() => {
      this.onModalClosed();
    });
  }

  editarFormulario(element: any): void {
    this.dialogRef = this.dialog.open(ModalEstudio, {
      width: '70%',
      disableClose: true,
      data: { historialAcademico: element },
    });
    this.dialogRef.afterClosed().subscribe(() => {
      this.onModalClosed();
    });
  }

  onModalClosed() {
    this.obtenerHistorialAcademico();
  }

  obtenerHistorialAcademico() {
    this.formacionAcademicaService
      .obtenerHistorialAcademico(this.identificacion)
      .subscribe((data) => {
        this.listadoHistorialAcademico = data;
        this.dataSourceHistorialAcademico =
          new MatTableDataSource<HistorialAcademico>(data);
        this.paginatorHistorialAcademico.firstPage();
        this.dataSourceHistorialAcademico.paginator =
          this.paginatorHistorialAcademico;
      });
  }

  buscarGraduado(id: string) {
    if (this.identificacion !== '') {
      this.graduadoService.obtenerGraduado(id).subscribe((data) => {
        if (JSON.stringify(data) !== '[]') {
          this.graduado = data;
          this.graduadoService
            .obtenerGraduadoEstudianteActivo(this.graduado[0].persona.codigo)
            .subscribe((data) => {
              if (JSON.stringify(data) !== '[]') {
                Swal.fire({
                  icon: 'warning',
                  title: 'Graduado como estudiante activo.',
                  text: 'El graduado se encuentra estudiando actualmente una carrera en la universidad',
                  showConfirmButton: true,
                  confirmButtonColor: '#8f141b',
                });
                this.estudianteActivo = false;
              } else {
                this.estudianteActivo = true;
              }
            });
          this.dataSource = new MatTableDataSource<Graduado>(data);
          this.paginator.firstPage();
          this.dataSource.paginator = this.paginator;
        } else {
          this.graduado = [];
          Swal.fire({
            icon: 'warning',
            title: 'No existe',
            text: 'La cédula digitada no encontró ningún Graduado asociado, por favor rectifique el documento.',
            showConfirmButton: true,
            confirmButtonText: 'Listo',
            confirmButtonColor: '#8f141b',
          });
        }
      });
    }
  }

  actualizarHistorialAcademico(historialAcademico: HistorialAcademico) {
    this.formacionAcademicaService
      .actualizarHistorialAcademico(historialAcademico)
      .subscribe(
        (data) => {
          if (data > 0) {
            this.obtenerHistorialAcademico();
          } else {
            this.mensajeError();
          }
        },
        (err) => this.fError(err)
      );
  }

  eliminarHistorialAcademico(element: HistorialAcademico) {
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
        this.actualizarHistorialAcademico(element);
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
  selector: 'modal-estudio',
  templateUrl: 'modal-estudio.html',
  styleUrls: ['./formacion-academica.component.css'],
})
export class ModalEstudio {
  listadoNivelFormacion: NivelAcademico[] = [];
  listadoPaises: Pais[] = [];
  listadoDepartamento: Departamento[] = [];
  listadoMunicipio: Municipio[] = [];
  editar: boolean = false;

  formularioFormacionAcademica!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ModalEstudio>,
    public formacionAcademicaService: FormacionAcademicaService,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    public ubicacionService: UbicacionService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (this.authService.validacionToken()) {
      this.obtenerNivelesFormacion();
      this.obtenerPais();
      this.crearFormularioFormacionAcademica();
      if (JSON.stringify(data) !== 'null') {
        this.editarHistorialAcademico(data.historialAcademico);
      }
    }
  }

  private crearFormularioFormacionAcademica(): void {
    this.formularioFormacionAcademica = this.formBuilder.group({
      codigo: new FormControl(''),
      perCodigo: new FormControl(''),
      titulo: new FormControl('', Validators.required),
      nivelAcademicoCodigo: new FormControl('', Validators.required),
      paisCodigo: new FormControl(''),
      departamentoCodigo: new FormControl(''),
      municipioCodigo: new FormControl('', Validators.required),
      fechaInicio: new FormControl('', Validators.required),
      fechaFin: new FormControl(''),
      institucion: new FormControl('', Validators.required),
      finalizado: new FormControl('', Validators.required),
      estado: new FormControl(''),
    });
  }

  obtenerNivelesFormacion() {
    this.formacionAcademicaService
      .obtenerNivelesAcademicos()
      .subscribe((data) => {
        this.listadoNivelFormacion = data;
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

  generarHistorialAcademico(): void {
    let historialAcademico: HistorialAcademico = new HistorialAcademico();
    historialAcademico.codigo =
      this.formularioFormacionAcademica.get('codigo')!.value;
    historialAcademico.perCodigo = this.authService.user.personaCodigo;
    historialAcademico.titulo =
      this.formularioFormacionAcademica.get('titulo')!.value;
    historialAcademico.nivelAcademicoCodigo =
      this.formularioFormacionAcademica.get('nivelAcademicoCodigo')!.value;
    historialAcademico.municipioCodigo =
      this.formularioFormacionAcademica.get('municipioCodigo')!.value;
    historialAcademico.fechaInicio =
      this.formularioFormacionAcademica.get('fechaInicio')!.value;
    historialAcademico.fechaFin =
      this.formularioFormacionAcademica.get('fechaFin')!.value;
    historialAcademico.institucion =
      this.formularioFormacionAcademica.get('institucion')!.value;
    historialAcademico.finalizado =
      this.formularioFormacionAcademica.get('finalizado')!.value;
    historialAcademico.estado =
      this.formularioFormacionAcademica.get('estado')!.value;
    if (this.editar) {
      this.actualizarHistorialAcademico(historialAcademico);
    } else {
      this.registrarHistorialAcademico(historialAcademico);
    }
  }

  registrarHistorialAcademico(historialAcademico: HistorialAcademico) {
    this.formacionAcademicaService
      .registrarHistorialAcademico(historialAcademico)
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
            this.crearFormularioFormacionAcademica();
          } else {
            this.mensajeError();
          }
        },
        (err) => this.fError(err)
      );
  }

  actualizarHistorialAcademico(historialAcademico: HistorialAcademico) {
    this.formacionAcademicaService
      .actualizarHistorialAcademico(historialAcademico)
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

  editarHistorialAcademico(element: HistorialAcademico) {
    this.editar = true;
    this.formularioFormacionAcademica.get('codigo')!.setValue(element.codigo);
    this.formularioFormacionAcademica
      .get('perCodigo')!
      .setValue(element.perCodigo);
    this.formularioFormacionAcademica.get('titulo')!.setValue(element.titulo);
    this.formularioFormacionAcademica
      .get('nivelAcademicoCodigo')!
      .setValue(element.nivelAcademicoCodigo);
    this.obtenerDepartamentos(element.paisCodigo);
    this.formularioFormacionAcademica
      .get('departamentoCodigo')!
      .setValue(element.departamentoCodigo);
    this.formularioFormacionAcademica
      .get('municipioCodigo')!
      .setValue(element.municipioCodigo);
    this.obtenerMunicipios(element.departamentoCodigo);
    this.formularioFormacionAcademica
      .get('paisCodigo')!
      .setValue(element.paisCodigo);
    let fechaInicio = new Date(element.fechaInicio + ' 0:00:00');
    this.formularioFormacionAcademica.get('fechaInicio')!.setValue(fechaInicio);
    let fechaFin = new Date(element.fechaFin + ' 0:00:00');
    this.formularioFormacionAcademica.get('fechaFin')!.setValue(fechaFin);
    this.formularioFormacionAcademica
      .get('institucion')!
      .setValue(element.institucion);
    this.formularioFormacionAcademica
      .get('finalizado')!
      .setValue('' + element.finalizado);
    this.formularioFormacionAcademica.get('estado')!.setValue(element.estado);
  }

  cancelar() {
    this.formularioFormacionAcademica.reset();
    //this.obtenerPaises();
    this.crearFormularioFormacionAcademica();
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
