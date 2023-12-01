import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Usuario } from '../../models/usuario';
import { WebparametroService } from 'src/app/services/webparametro.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  usuario: Usuario;
  hide = true;
  ver = true;
  today = new Date();
  cargando: boolean = false;
  formLogin!: FormGroup;

  constructor(
    public authService: AuthService,
    private router: Router,
    public webparametroService: WebparametroService,
    private formBuilder: FormBuilder
  ) {
    this.usuario = new Usuario();
    this.crearFormularioLogin();
  }

  ngOnInit() {
    /*  Swal.fire({
      icon: 'warning',
      title: '!Atención!',
      background: '#8f141b',
      color: '#ffffff',
      html: 'Si es primera vez que va ingresar por favor cambiar la clave haciendo click <a href="https://www.usco.edu.co/cambio_clave/" target="_blank" class="text-white"> <u>aquí.</u></a>',
      showConfirmButton: false,
    }); */
    if (this.authService.isAuthenticated()) {
      if (this.authService.codigoverificacion != null) {
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
          },
        });

        Toast.fire({
          icon: 'info',
          title: 'Ya se ha iniciado sesión.',
        });
        this.router.navigate(['encuesta-seguimiento']);
      } else {
        this.router.navigate(['token']);
      }
    }
  }

  private crearFormularioLogin(): void {
    this.formLogin = this.formBuilder.group({
      usuario: new FormControl('', Validators.required),
      contrasenia: new FormControl('', Validators.required),
    });
  }

  informacion() {
    Swal.fire({
      icon: 'info',
      title: 'Tipos de Usuario USCO',
      imageUrl: 'assets/tipousuariousco2.png',
      imageWidth: 400,
      imageHeight: 280,
      imageAlt: 'USCO',
      confirmButtonColor: '#8f141b',
      confirmButtonText: 'Listo',
      showClass: {
        popup: 'slide-top',
      },
    });
  }

  login(): void {
    this.cargando = true;
    this.usuario.username = this.formLogin.get('usuario')!.value;
    this.usuario.password = this.formLogin.get('contrasenia')!.value;
    this.authService.login(this.usuario).subscribe(
      (response) => {
        this.authService.guardarUsuario(response.access_token);
        this.authService.guardarToken(response.access_token);
        // Mostrar mensaje de éxito y redirigir
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
          },
        });

        Toast.fire({
          icon: 'success',
          title: 'Inicio de sesión exitoso.',
        });
        this.router.navigate(['/token']);
      },
      (err) => this.fError(err)
    );
  }

  fError(er: { error: { error_description: any } }): void {
    let err = er.error.error_description;
    let arr: string[] = err.split(':');
    if (arr[0] == 'Access token expired') {
      this.router.navigate(['login']);
      this.cargando = false;
    } else {
      this.cargando = false;
    }
  }
}
