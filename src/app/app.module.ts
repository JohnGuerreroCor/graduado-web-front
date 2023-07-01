import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { MaterialModules } from './material.modules';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { TokenComponent } from './components/token/token.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { EncuestaGraduadoComponent } from './components/encuesta-graduado/encuesta-graduado.component';
import { DatosPersonalesComponent } from './components/encuesta-graduado/datos-personales/datos-personales.component';
import { SatisfaccionFormacionComponent } from './components/encuesta-graduado/satisfaccion-formacion/satisfaccion-formacion.component';
import { SituacionLaboralComponent } from './components/encuesta-graduado/situacion-laboral/situacion-laboral.component';
import { FormacionAcademicaComponent, ModalEstudio  } from './components/encuesta-graduado/formacion-academica/formacion-academica.component';
import { ExpectativasCapacitacionComponent } from './components/encuesta-graduado/expectativas-capacitacion/expectativas-capacitacion.component';
import { DistincionesReconocimientosComponent, ModalMembresia } from './components/encuesta-graduado/distinciones-reconocimientos/distinciones-reconocimientos.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    TokenComponent,
    InicioComponent,
    EncuestaGraduadoComponent,
    DatosPersonalesComponent,
    SatisfaccionFormacionComponent,
    SituacionLaboralComponent,
    FormacionAcademicaComponent,
    ModalEstudio,
    ExpectativasCapacitacionComponent,
    DistincionesReconocimientosComponent,
    ModalMembresia
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    MaterialModules,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  entryComponents: [
    ModalEstudio,
    ModalMembresia
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
