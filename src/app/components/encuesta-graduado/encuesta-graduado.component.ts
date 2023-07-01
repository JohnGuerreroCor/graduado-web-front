import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-encuesta-graduado',
  templateUrl: './encuesta-graduado.component.html',
  styleUrls: ['./encuesta-graduado.component.css'],
})
export class EncuestaGraduadoComponent implements OnInit {
  hide: boolean = false;
  
  ngOnInit() {
   /*  const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger',
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons.fire({
      title: 'Información inicial',
      text: 'Apreciado estudiante, el siguiente formulario tiene como fin actualizar sus datos de contacto para que la Universidad a través de la Oficina de Egresados pueda compartir con usted información de interés a su formación posgradual y laboral. La información consignada solamente será utilizada para fines académicos, manteniendo la confidencialidad de los datos suministrados.',
      icon: 'info',
      confirmButtonText: 'He leido y acepto las condiciones.',
    }); */
  }
}
