import {CommonModule, registerLocaleData } from '@angular/common';
import { Component, LOCALE_ID } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import localeEs from '@angular/common/locales/es-AR';

@Component({
  selector: 'app-root',
  standalone: true,
  providers: [{ provide: LOCALE_ID, useValue: 'es-ES' }],
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'tickets-payments';

  constructor() {
    registerLocaleData(localeEs, 'es-ES');
  }
}
