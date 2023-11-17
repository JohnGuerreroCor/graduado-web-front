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
    public mencionReconocimientoService: MencionReconocimientoService
  ) {
    this.identificacion = '' + authService.user.identificacion;
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
      data: { sede: element },
    });
    this.dialogRef.afterClosed().subscribe(() => {
      this.onModalClosed();
    });
  }

  onModalClosed() {
    //this.obtenerListadoSedes();
  }
}

//// MODAL

@Component({
  selector: 'modal-membresia',
  templateUrl: 'modal-membresia.html',
  styleUrls: ['./distinciones-reconocimientos.component.css'],
})
export class ModalMembresia {
  constructor(
    public dialogRef: MatDialogRef<ModalMembresia>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
}
