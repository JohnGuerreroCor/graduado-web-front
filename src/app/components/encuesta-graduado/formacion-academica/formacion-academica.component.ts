import { Component, Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

@Component({
  selector: 'app-formacion-academica',
  templateUrl: './formacion-academica.component.html',
  styleUrls: ['./formacion-academica.component.css'],
})
export class FormacionAcademicaComponent {
  constructor(public dialog: MatDialog) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(ModalEstudio, {
    });
  }
}

//// MODAL

@Component({
  selector: 'modal-estudio',
  templateUrl: 'modal-estudio.html',
  styleUrls: ['./formacion-academica.component.css'],
})
export class ModalEstudio {
  constructor(
    public dialogRef: MatDialogRef<ModalEstudio>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
}
