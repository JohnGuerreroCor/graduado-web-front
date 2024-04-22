import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { TokenComponent } from './components/token/token.component';
import { EncuestaGraduadoComponent } from './components/encuesta-graduado/encuesta-graduado.component';
import { DatosPersonalesComponent } from './components/encuesta-graduado/datos-personales/datos-personales.component';
import { NotfoundComponent } from './components/notfound/notfound.component';

const routes: Routes = [
  { path: 'acceso-denegado', component: NotfoundComponent },

  { path: 'login', component: LoginComponent },
  { path: 'token', component: TokenComponent },

  { path: 'encuesta-seguimiento', component: EncuestaGraduadoComponent },
  { path: 'datos-personales', component: DatosPersonalesComponent },

  { path: '**', pathMatch: 'full', redirectTo: '/acceso-denegado' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
      onSameUrlNavigation: 'reload',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
