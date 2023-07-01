import { Component, Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

@Component({
  selector: 'app-distinciones-reconocimientos',
  templateUrl: './distinciones-reconocimientos.component.html',
  styleUrls: ['./distinciones-reconocimientos.component.css'],
})
export class DistincionesReconocimientosComponent {
  constructor(public dialog: MatDialog) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(ModalMembresia, {});
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
