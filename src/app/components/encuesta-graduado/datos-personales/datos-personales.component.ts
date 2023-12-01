import {
  Component,
  ViewChild,
  Inject,
  OnInit,
  EventEmitter,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { Graduado } from 'src/app/models/graduado';
import { GraduadoService } from 'src/app/services/graduado.service';
import { FotoService } from 'src/app/services/foto.service';
import { FotoAntigua } from 'src/app/models/foto-antigua';
import { DatePipe } from '@angular/common';
import { UbicacionService } from 'src/app/services/ubicacion.service';
import { Pais } from 'src/app/models/pais';
import { Municipio } from 'src/app/models/municipio';
import { Departamento } from 'src/app/models/departamento';
import { DatosPersonalesService } from 'src/app/services/datos-personales.service';
import { DatosPersonales } from 'src/app/models/datos-personales';
import { DatosContacto } from 'src/app/models/datos-contacto';
import { AuthService } from 'src/app/services/auth.service';
import { DatosResidencia } from 'src/app/models/datos-residencia';
import { DatosExpedicion } from 'src/app/models/datos-expedicion';
import { SoporteExpedicionService } from 'src/app/services/soporte-expedicion.service';
import { SoporteExpedicion } from 'src/app/models/soporte-expedicion';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-datos-personales',
  templateUrl: './datos-personales.component.html',
  styleUrls: ['./datos-personales.component.css'],
})
export class DatosPersonalesComponent {
  listadoDatosPersonales: DatosPersonales[] = [];
  graduado: Graduado[] = [];

  listadoPaisesResidencia: Pais[] = [];
  listadoDepartamentosResidencia: Departamento[] = [];
  listadoMunicipiosResidencia: Municipio[] = [];

  identificacion: string = '';

  formDatosPersonales!: FormGroup;

  cargaFoto: boolean = false;

  nombreFoto = 'Seleccione la foto a cargar...';

  file!: FileList;

  foto: FotoAntigua = {
    url: '',
  };

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
  dialogRef!: MatDialogRef<any>;

  constructor(
    public authService: AuthService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    public graduadoService: GraduadoService,
    public fotoService: FotoService,
    public ubicacionService: UbicacionService,
    public datosPersonalesService: DatosPersonalesService,
    public soporteExpedicionService: SoporteExpedicionService,
    private dialog: MatDialog,
    private datePipe: DatePipe
  ) {
    this.activatedRoute.params.subscribe((params) => {
      this.identificacion = '' + authService.user.identificacion;
      this.graduado = [];
      this.foto.url = '';
      this.dataSource = new MatTableDataSource<Graduado>([]);
      this.buscarGraduado(this.identificacion);
    });
    this.crearFormularioDatosPersonales();
    this.datosPersonales();
  }

  private crearFormularioDatosPersonales(): void {
    this.formDatosPersonales = this.formBuilder.group({
      codigo: new FormControl(''),
      identificacionTipo: new FormControl('', Validators.required),
      identificacion: new FormControl('', Validators.required),
      identificacionFechaExpedicion: new FormControl('', Validators.required),
      paisExpedicion: new FormControl('', Validators.required),
      departamentoExpedicion: new FormControl('', Validators.required),
      municipioExpedicion: new FormControl('', Validators.required),
      apellido: new FormControl('', Validators.required),
      nombre: new FormControl('', Validators.required),
      genero: new FormControl('', Validators.required),
      estadoCivil: new FormControl('', Validators.required),
      grupoSanguineo: new FormControl('', Validators.required),
      fechaNacimiento: new FormControl('', Validators.required),
      paisNacimiento: new FormControl('', Validators.required),
      departamentoNacimiento: new FormControl('', Validators.required),
      municipioNacimiento: new FormControl('', Validators.required),
      emailPersonal: new FormControl('', Validators.required),
      paginaWeb: new FormControl('', Validators.required),
      telefonoFijo: new FormControl('', Validators.required),
      telefonoMovil: new FormControl('', Validators.required),
      paisResidencia: new FormControl('', Validators.required),
      departamentoResidencia: new FormControl('', Validators.required),
      municipioResidencia: new FormControl('', Validators.required),
      barrio: new FormControl('', Validators.required),
      direccion: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {}

  openDialogExpedicion(element: any): void {
    this.dialogRef = this.dialog.open(ModalExpedicion, {
      width: '60%',
      disableClose: true,
      data: { id: element },
    });
    this.dialogRef.afterClosed().subscribe(() => {
      this.onModalClosed();
    });
  }

  openDialogContacto(element: any): void {
    this.dialogRef = this.dialog.open(ModalContacto, {
      width: '60%',
      disableClose: true,
      data: { id: element },
    });
    this.dialogRef.afterClosed().subscribe(() => {
      this.onModalClosed();
    });
  }

  openDialogResidencia(element: any): void {
    this.dialogRef = this.dialog.open(ModalResidencia, {
      width: '60%',
      disableClose: true,
      data: { id: element },
    });
    this.dialogRef.afterClosed().subscribe(() => {
      this.onModalClosed();
    });
  }

  onModalClosed() {
    this.datosPersonales();
  }

  datosPersonales() {
    this.datosPersonalesService
      .obtenerDatosPersonales(this.identificacion)
      .subscribe((data) => {
        this.listadoDatosPersonales = data;
        this.precargaGraduado();
      });
  }

  obtenerDepartamentosResidencia(codigo: number) {
    this.ubicacionService
      .obtenerDepartamentosPorPais(codigo)
      .subscribe((data) => {
        this.listadoDepartamentosResidencia = data;
      });
  }

  obtenerMunicipiosResidencia(codigo: number) {
    this.ubicacionService
      .obtenerMunicipiosPorDepartamento(codigo)
      .subscribe((data) => {
        this.listadoMunicipiosResidencia = data;
      });
  }

  buscarGraduado(id: string) {
    this.graduadoService.obtenerGraduado(id).subscribe((data) => {
      if (JSON.stringify(data) !== '[]') {
        this.graduado = data;
        this.mostrarFoto('' + this.graduado[0].persona.codigo);
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

  precargaGraduado(): void {
    this.formDatosPersonales
      .get('codigo')!
      .setValue(this.listadoDatosPersonales[0].codigo);
    this.formDatosPersonales
      .get('identificacionTipo')!
      .setValue(this.listadoDatosPersonales[0].identificacionTipo);
    this.formDatosPersonales
      .get('identificacion')!
      .setValue(this.listadoDatosPersonales[0].identificacion);
    this.formDatosPersonales
      .get('identificacionFechaExpedicion')!
      .setValue(
        this.datePipe.transform(
          this.listadoDatosPersonales[0].identificacionFechaExpedicion,
          'dd/MM/yyyy'
        )
      );
    this.formDatosPersonales
      .get('paisExpedicion')!
      .setValue(this.listadoDatosPersonales[0].paisExpedicion.toUpperCase());
    this.formDatosPersonales
      .get('departamentoExpedicion')!
      .setValue(this.listadoDatosPersonales[0].departamentoExpedicion);
    this.formDatosPersonales
      .get('municipioExpedicion')!
      .setValue(this.listadoDatosPersonales[0].municipioExpedicion);
    this.formDatosPersonales
      .get('apellido')!
      .setValue(this.listadoDatosPersonales[0].apellido);
    this.formDatosPersonales
      .get('nombre')!
      .setValue(this.listadoDatosPersonales[0].nombre);
    this.formDatosPersonales
      .get('genero')!
      .setValue(this.listadoDatosPersonales[0].genero);
    this.formDatosPersonales
      .get('estadoCivil')!
      .setValue(this.listadoDatosPersonales[0].estadoCivil);
    this.formDatosPersonales
      .get('grupoSanguineo')!
      .setValue(this.listadoDatosPersonales[0].grupoSanguineo);
    this.formDatosPersonales
      .get('fechaNacimiento')!
      .setValue(
        this.datePipe.transform(
          this.listadoDatosPersonales[0].fechaNacimiento,
          'dd/MM/yyyy'
        )
      );
    this.formDatosPersonales
      .get('paisNacimiento')!
      .setValue(this.listadoDatosPersonales[0].paisNacimiento.toUpperCase());
    this.formDatosPersonales
      .get('departamentoNacimiento')!
      .setValue(this.listadoDatosPersonales[0].departamentoNacimiento);
    this.formDatosPersonales
      .get('municipioNacimiento')!
      .setValue(this.listadoDatosPersonales[0].municipioNacimiento);
    this.formDatosPersonales
      .get('emailPersonal')!
      .setValue(this.listadoDatosPersonales[0].emailPersonal);
    this.formDatosPersonales
      .get('paginaWeb')!
      .setValue(this.listadoDatosPersonales[0].paginaWeb);
    this.formDatosPersonales
      .get('telefonoFijo')!
      .setValue(this.listadoDatosPersonales[0].telefonoFijo);
    this.formDatosPersonales
      .get('telefonoMovil')!
      .setValue(this.listadoDatosPersonales[0].telefonoMovil);
    this.formDatosPersonales
      .get('paisResidencia')!
      .setValue(this.listadoDatosPersonales[0].paisResidencia.toUpperCase());
    this.formDatosPersonales
      .get('departamentoResidencia')!
      .setValue(this.listadoDatosPersonales[0].departamentoResidencia);
    this.formDatosPersonales
      .get('municipioResidencia')!
      .setValue(this.listadoDatosPersonales[0].municipioResidencia);
    this.formDatosPersonales
      .get('barrio')!
      .setValue(this.listadoDatosPersonales[0].barrio);
    this.formDatosPersonales
      .get('direccion')!
      .setValue(this.listadoDatosPersonales[0].direccion);
  }

  loadToken() {
    this.activatedRoute.params.subscribe((params) => {
      let key = params['id'];
    });
  }

  subirFoto() {
    let file: any = this.file;
    const foto = new File([file], this.graduado[0].persona.codigo + '.png', {
      type: file.type,
    });
    this.fotoService.subirFoto(foto).subscribe((data) => {
      this.cargaFoto = false;
      this.mensajeRealizado();
    });
  }

  change(file: any): void {
    this.nombreFoto = file.target.files[0].name.replace(/\s/g, '');
    const foto: any = (event?.target as HTMLInputElement)?.files?.[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.foto.url = reader.result as string;
    };
    reader.readAsDataURL(foto);
    if (file.target.files[0].size > 8100000) {
      Swal.fire({
        title: 'El archivo supera el limite de tamaño que es de 8mb',
        confirmButtonText: 'Entiendo',
        confirmButtonColor: '#8f141b',
        showConfirmButton: true,
      });
    } else {
      this.file = file.target.files[0];
      this.cargaFoto = true;
      Swal.fire({
        icon: 'success',
        title: 'Foto cargada, recuerde guardar los cambios realizados.',
        showConfirmButton: true,
        confirmButtonText: 'Listo',
        confirmButtonColor: '#8f141b',
      });
    }
  }

  mostrarFoto(perCodigo: String) {
    this.fotoService.mirarFoto(perCodigo).subscribe((data) => {
      var gg = new Blob([data], { type: 'application/json' });
      if (gg.size !== 4) {
        var blob = new Blob([data], { type: 'image/png' });
        const foto = blob;
        const reader = new FileReader();
        reader.onload = () => {
          this.foto.url = reader.result as string;
        };
        reader.readAsDataURL(foto);
      } else {
        this.fotoService
          .mirarFotoAntigua('' + this.graduado[0].persona.codigo)
          .subscribe((data) => {
            this.foto = data;
          });
      }
    });
  }

  mostrarArchivo() {
    this.soporteExpedicionService
      .mirarSoporte(+this.listadoDatosPersonales[0].urlAnexoExpedicion)
      .subscribe((data) => {
        var blob = new Blob([data], { type: 'application/pdf' });
        var fileURL = URL.createObjectURL(blob);
        window.open(fileURL);
      });
  }

  mensajeRealizado() {
    Swal.fire({
      icon: 'success',
      title: 'Proceso Realizado',
      showConfirmButton: false,
      timer: 1500,
    });
  }
}

//// MODAL - EXPEDICION

@Component({
  selector: 'modal-expedicion',
  templateUrl: 'modal-expedicion.html',
  styleUrls: ['./datos-personales.component.css'],
})
export class ModalExpedicion implements OnInit {
  nombreArchivo = 'Seleccione el documento a cargar...';
  file!: FileList;
  editar: boolean = false;
  actualizarArchivo: boolean = false;
  listadoPaises: Pais[] = [];
  listadoDepartamentosExpedicion: Departamento[] = [];
  listadoMunicipiosExpedicion: Municipio[] = [];
  listadoDatosPersonales: DatosPersonales[] = [];
  formDatosExpedicion!: FormGroup;
  identificacion: string = '';

  constructor(
    public dialogRef: MatDialogRef<ModalExpedicion>,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    public ubicacionService: UbicacionService,
    public authService: AuthService,
    public datosPersonalesService: DatosPersonalesService,
    public soporteExpedicionService: SoporteExpedicionService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.crearFormularioDatosExpedicion();
    this.datosPersonalesService
      .obtenerDatosPersonales(data.id)
      .subscribe((data) => {
        this.listadoDatosPersonales = data;
        this.precargaFormulario();
      });
  }

  ngOnInit() {
    Swal.fire({
      icon: 'warning',
      title: 'Información para tener en cuenta:',
      html: 'El documento que se adjunte para cambiar o asignar la fecha de expedición debe tener como nombre el número de documento de identidad y estar en formato PDF <br> <strong> Ej: 1075000000.pdf </strong> <br> Gracias por la atención prestada.',
      showConfirmButton: true,
      confirmButtonText: 'Listo',
      confirmButtonColor: '#8f141b',
    });
    this.obtenerPaises();
  }

  private crearFormularioDatosExpedicion(): void {
    this.formDatosExpedicion = this.formBuilder.group({
      codigo: new FormControl('', Validators.required),
      codigoSoporte: new FormControl(''),
      paisExpedicionCodigo: new FormControl(''),
      departamentoExpedicionCodigo: new FormControl(''),
      municipioExpedicionCodigo: new FormControl('', Validators.required),
      identificacionFechaExpedicion: new FormControl('', Validators.required),
      archivo: new FormControl('', Validators.required),
      url: new FormControl('', Validators.required),
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  precargaFormulario(): void {
    this.obtenerDepartamentosPais(
      this.listadoDatosPersonales[0].paisExpedicionCodigo
    );
    this.obtenerMunicipiosDepartamento(
      this.listadoDatosPersonales[0].departamentoExpedicionCodigo
    );
    this.formDatosExpedicion
      .get('codigo')!
      .setValue(this.listadoDatosPersonales[0].codigo);
    this.formDatosExpedicion
      .get('paisExpedicionCodigo')!
      .setValue(this.listadoDatosPersonales[0].paisExpedicionCodigo);
    this.formDatosExpedicion
      .get('departamentoExpedicionCodigo')!
      .setValue(this.listadoDatosPersonales[0].departamentoExpedicionCodigo);
    this.formDatosExpedicion
      .get('municipioExpedicionCodigo')!
      .setValue(this.listadoDatosPersonales[0].municipioExpedicionCodigo);
    let fechaExpedicion = new Date(
      this.listadoDatosPersonales[0].identificacionFechaExpedicion + ' 0:00:00'
    );
    this.formDatosExpedicion
      .get('identificacionFechaExpedicion')!
      .setValue(fechaExpedicion);
  }

  generarSoporteExpedicion(): void {
    let soporteExpedicion: SoporteExpedicion = new SoporteExpedicion();
    soporteExpedicion.codigo =
      this.formDatosExpedicion.get('codigoSoporte')!.value;
    soporteExpedicion.perCodigo = this.formDatosExpedicion.get('codigo')!.value;
    soporteExpedicion.nombre = this.formDatosExpedicion.get('archivo')!.value;
    //soporteExpedicion.ruta = this.formDatosExpedicion.get('url')!.value;
    let file: any = this.file;
    this.registrarSoporte(file, soporteExpedicion);
  }

  registrarSoporte(archivo: File, soporteExpedicion: SoporteExpedicion) {
    const arch = new File([archivo], this.nombreArchivo, {
      type: archivo.type,
    });
    this.soporteExpedicionService
      .registrarSoporte(arch, soporteExpedicion)
      .subscribe(
        (data) => {
          this.generarDatosExpedicion();
          //this.enviarEmailRector();
        },
        (err) => this.fError(err)
      );
  }

  generarDatosExpedicion(): void {
    let datosExpedicion: DatosExpedicion = new DatosExpedicion();
    datosExpedicion.codigo = this.formDatosExpedicion.get('codigo')!.value;
    datosExpedicion.municipioExpedicionCodigo = this.formDatosExpedicion.get(
      'municipioExpedicionCodigo'
    )!.value;
    datosExpedicion.identificacionFechaExpedicion =
      this.formDatosExpedicion.get('identificacionFechaExpedicion')!.value;
    this.actualizarDatosContacto(datosExpedicion);
  }

  actualizarDatosContacto(expedicion: DatosExpedicion) {
    this.datosPersonalesService.actualizarDatosExpedicion(expedicion).subscribe(
      (data) => {
        if (data > 0) {
          Swal.fire({
            icon: 'success',
            title: 'Actualizado',
            text: '¡Operación exitosa!',
            showConfirmButton: true,
            confirmButtonColor: '#8f141b',
            timer: 2500,
          });
          this.dialogRef.close();
        } else {
          this.mensajeError();
        }
      },
      (err) => this.fError(err)
    );
  }

  change(file: any): void {
    this.nombreArchivo = file.target.files[0].name.replace(/\s/g, '');
    this.formDatosExpedicion.get('archivo')!.setValue(this.nombreArchivo);
    if (file.target.files[0].size > 8100000) {
      Swal.fire({
        title: 'El archivo supera el limite de tamaño que es de 8mb',
        confirmButtonText: 'Entiendo',
        confirmButtonColor: '#8f141b',
        showConfirmButton: true,
      });
    } else {
      this.file = file.target.files[0];
      Swal.fire({
        icon: 'success',
        title: 'Documento cargado de manera exitosa.',
        showConfirmButton: true,
        confirmButtonText: 'Listo',
        confirmButtonColor: '#8f141b',
      });
    }
  }

  obtenerPaises() {
    this.ubicacionService.obtenerPaises().subscribe((data) => {
      this.listadoPaises = data;
      this.listadoPaises = data.map((pais: Pais) => {
        return {
          ...pais,
          nombre: pais.nombre,
        };
      });
    });
  }

  obtenerDepartamentosPais(codigo: number) {
    this.listadoDepartamentosExpedicion = [];
    this.listadoMunicipiosExpedicion = [];
    this.ubicacionService
      .obtenerDepartamentosPorPais(codigo)
      .subscribe((data) => {
        this.listadoDepartamentosExpedicion = data;
      });
  }

  obtenerMunicipiosDepartamento(codigo: number) {
    this.listadoMunicipiosExpedicion = [];
    this.ubicacionService
      .obtenerMunicipiosPorDepartamento(codigo)
      .subscribe((data) => {
        this.listadoMunicipiosExpedicion = data;
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

  mensajeCorrecto() {
    Swal.fire({
      icon: 'success',
      title: 'Registrado.',
      text: '¡Operación exitosa!',
      showConfirmButton: false,
      timer: 2500,
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

//// MODAL - CONTACTO

@Component({
  selector: 'modal-contacto',
  templateUrl: 'modal-contacto.html',
  styleUrls: ['./datos-personales.component.css'],
})
export class ModalContacto implements OnInit {
  listadoDatosPersonales: DatosPersonales[] = [];
  formDatosContacto!: FormGroup;
  identificacion: string = '';

  @Output() modalClosed = new EventEmitter<void>();

  constructor(
    public dialogRef: MatDialogRef<ModalExpedicion>,
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    public authService: AuthService,
    public datosPersonalesService: DatosPersonalesService,
    private formBuilder: FormBuilder,
    private router: Router,
    public ubicacionService: UbicacionService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.crearFormularioDatosContacto();
    this.datosPersonalesService
      .obtenerDatosPersonales(data.id)
      .subscribe((data) => {
        this.listadoDatosPersonales = data;
        this.precargaFormulario();
      });
  }

  ngOnInit() {}

  private crearFormularioDatosContacto(): void {
    this.formDatosContacto = this.formBuilder.group({
      codigo: new FormControl('', Validators.required),
      emailPersonal: new FormControl('', [
        Validators.required,
        Validators.email,
      ]),
      pagina: new FormControl(''),
      telefonoFijo: new FormControl('', [
        Validators.required,
        Validators.pattern('^[0-9]+$'),
      ]),
      telefonoMovil: new FormControl('', [
        Validators.required,
        Validators.pattern('^[0-9]+$'),
      ]),
    });
  }

  precargaFormulario(): void {
    this.formDatosContacto
      .get('codigo')!
      .setValue(this.listadoDatosPersonales[0].codigo);
    this.formDatosContacto
      .get('emailPersonal')!
      .setValue(this.listadoDatosPersonales[0].emailPersonal);
    this.formDatosContacto
      .get('pagina')!
      .setValue(this.listadoDatosPersonales[0].paginaWeb);
    this.formDatosContacto
      .get('telefonoFijo')!
      .setValue(this.listadoDatosPersonales[0].telefonoFijo);
    this.formDatosContacto
      .get('telefonoMovil')!
      .setValue(this.listadoDatosPersonales[0].telefonoMovil);
  }

  generarDatosContacto(): void {
    let datosContacto: DatosContacto = new DatosContacto();
    datosContacto.codigo = this.formDatosContacto.get('codigo')!.value;
    datosContacto.emailPersonal =
      this.formDatosContacto.get('emailPersonal')!.value;
    datosContacto.paginaWeb = this.formDatosContacto.get('pagina')!.value;
    datosContacto.telefonoFijo =
      '' + this.formDatosContacto.get('telefonoFijo')!.value;
    datosContacto.telefonoMovil =
      '' + this.formDatosContacto.get('telefonoMovil')!.value;
    this.actualizarDatosContacto(datosContacto);
  }

  actualizarDatosContacto(contacto: DatosContacto) {
    this.datosPersonalesService.actualizarDatosContacto(contacto).subscribe(
      (data) => {
        if (data > 0) {
          Swal.fire({
            icon: 'success',
            title: 'Actualizado',
            text: '¡Operación exitosa!',
            showConfirmButton: true,
            confirmButtonColor: '#8f141b',
            timer: 2500,
          });
          this.dialogRef.close();
        } else {
          this.mensajeError();
        }
      },
      (err) => this.fError(err)
    );
  }

  onNoClick(): void {
    this.dialogRef.close();
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

//// MODAL - RESIDENCIA

@Component({
  selector: 'modal-residencia',
  templateUrl: 'modal-residencia.html',
  styleUrls: ['./datos-personales.component.css'],
})
export class ModalResidencia implements OnInit {
  listadoPaises: Pais[] = [];
  listadoMunicipios: Municipio[] = [];
  listadoMunicipiosResidencia: Municipio[] = [];
  listadoDepartamentosResidencia: Departamento[] = [];
  listadoDatosPersonales: DatosPersonales[] = [];
  formDatosResidencia!: FormGroup;
  identificacion: string = '';

  constructor(
    public dialogRef: MatDialogRef<ModalExpedicion>,
    public dialog: MatDialog,
    public authService: AuthService,
    public datosPersonalesService: DatosPersonalesService,
    private formBuilder: FormBuilder,
    private router: Router,
    public ubicacionService: UbicacionService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.crearFormularioDatosResidencia();
    this.datosPersonalesService
      .obtenerDatosPersonales(data.id)
      .subscribe((data) => {
        this.listadoDatosPersonales = data;
        this.precargaFormulario();
      });
  }

  ngOnInit() {
    this.obtenerPaises();
    this.obtenerMunicipios();
  }

  private crearFormularioDatosResidencia(): void {
    this.formDatosResidencia = this.formBuilder.group({
      codigo: new FormControl('', Validators.required),
      paisResidenciaCodigo: new FormControl('', Validators.required),
      paisResidencia: new FormControl(''),
      departamentoResidenciaCodigo: new FormControl('', Validators.required),
      departamentoResidencia: new FormControl(''),
      municipioResidenciaCodigo: new FormControl('', Validators.required),
      municipioResidencia: new FormControl(''),
      barrio: new FormControl('', Validators.required),
      direccion: new FormControl('', Validators.required),
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  precargaFormulario(): void {
    this.obtenerDepartamentosPais(
      this.listadoDatosPersonales[0].paisResidenciaCodigo
    );
    this.obtenerMunicipiosDepartamento(
      this.listadoDatosPersonales[0].departamentoResidenciaCodigo
    );
    this.formDatosResidencia
      .get('codigo')!
      .setValue(this.listadoDatosPersonales[0].codigo);
    this.formDatosResidencia
      .get('paisResidenciaCodigo')!
      .setValue(this.listadoDatosPersonales[0].paisResidenciaCodigo);
    this.formDatosResidencia
      .get('departamentoResidenciaCodigo')!
      .setValue(this.listadoDatosPersonales[0].departamentoResidenciaCodigo);
    this.formDatosResidencia
      .get('municipioResidenciaCodigo')!
      .setValue(this.listadoDatosPersonales[0].municipioResidenciaCodigo);
    this.formDatosResidencia
      .get('barrio')!
      .setValue(this.listadoDatosPersonales[0].barrio);
    this.formDatosResidencia
      .get('direccion')!
      .setValue(this.listadoDatosPersonales[0].direccion);
  }

  generarDatosResidencia(): void {
    let datosResidencia: DatosResidencia = new DatosResidencia();
    datosResidencia.codigo = this.formDatosResidencia.get('codigo')!.value;
    datosResidencia.paisResidenciaCodigo = this.formDatosResidencia.get(
      'paisResidenciaCodigo'
    )!.value;
    datosResidencia.departamentoResidenciaCodigo = this.formDatosResidencia.get(
      'departamentoResidenciaCodigo'
    )!.value;
    datosResidencia.municipioResidenciaCodigo = this.formDatosResidencia.get(
      'municipioResidenciaCodigo'
    )!.value;
    datosResidencia.barrio = this.formDatosResidencia.get('barrio')!.value;
    datosResidencia.direccion =
      this.formDatosResidencia.get('direccion')!.value;
    this.actualizarDatosContacto(datosResidencia);
  }

  actualizarDatosContacto(datosResidencia: DatosResidencia) {
    this.datosPersonalesService
      .actualizarDatosResidencia(datosResidencia)
      .subscribe(
        (data) => {
          if (data > 0) {
            Swal.fire({
              icon: 'success',
              title: 'Actualizado',
              text: '¡Operación exitosa!',
              showConfirmButton: true,
              confirmButtonColor: '#8f141b',
              timer: 2500,
            });
            this.dialogRef.close();
          } else {
            this.mensajeError();
          }
        },
        (err) => this.fError(err)
      );
  }

  obtenerPaises() {
    this.ubicacionService.obtenerPaises().subscribe((data) => {
      this.listadoPaises = data;
      this.listadoPaises = data.map((pais: Pais) => {
        return {
          ...pais,
          nombre: pais.nombre,
        };
      });
    });
  }

  obtenerMunicipios() {
    this.ubicacionService.obtenerMunicipios().subscribe((data) => {
      this.listadoMunicipios = data;
    });
  }

  obtenerDepartamentosPais(codigo: number) {
    this.listadoDepartamentosResidencia = [];
    this.listadoMunicipiosResidencia = [];
    this.ubicacionService
      .obtenerDepartamentosPorPais(codigo)
      .subscribe((data) => {
        this.listadoDepartamentosResidencia = data;
      });
  }

  obtenerMunicipiosDepartamento(codigo: number) {
    this.listadoMunicipiosResidencia = [];
    this.ubicacionService
      .obtenerMunicipiosPorDepartamento(codigo)
      .subscribe((data) => {
        this.listadoMunicipiosResidencia = data;
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
