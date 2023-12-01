import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { registerLocaleData } from '@angular/common';
import localeEsCO from '@angular/common/locales/es-CO';
import { DatePipe } from '@angular/common';
import { MAT_DATE_LOCALE } from '@angular/material/core';

import { MaterialModules } from './material.modules';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { TokenComponent } from './components/token/token.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { EncuestaGraduadoComponent } from './components/encuesta-graduado/encuesta-graduado.component';
import {
  DatosPersonalesComponent,
  ModalContacto,
  ModalExpedicion,
  ModalResidencia,
} from './components/encuesta-graduado/datos-personales/datos-personales.component';
import { SatisfaccionFormacionComponent } from './components/encuesta-graduado/satisfaccion-formacion/satisfaccion-formacion.component';
import { SituacionLaboralComponent } from './components/encuesta-graduado/situacion-laboral/situacion-laboral.component';
import {
  FormacionAcademicaComponent,
  ModalEstudio,
} from './components/encuesta-graduado/formacion-academica/formacion-academica.component';
import { ExpectativasCapacitacionComponent } from './components/encuesta-graduado/expectativas-capacitacion/expectativas-capacitacion.component';
import {
  DistincionesReconocimientosComponent,
  ModalMembresia,
} from './components/encuesta-graduado/distinciones-reconocimientos/distinciones-reconocimientos.component';
import { EmailHidePipe } from './pipes/email-hide.pipe';

registerLocaleData(localeEsCO, 'es-CO');

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
    ModalContacto,
    ModalExpedicion,
    ModalResidencia,
    ExpectativasCapacitacionComponent,
    DistincionesReconocimientosComponent,
    ModalMembresia,
    EmailHidePipe,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModules,
    AppRoutingModule,
    BrowserAnimationsModule,
  ],
  entryComponents: [
    ModalEstudio,
    ModalMembresia,
    ModalContacto,
    ModalExpedicion,
    ModalResidencia,
  ],
  providers: [
    DatePipe,
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
    { provide: LOCALE_ID, useValue: 'es-CO' },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
