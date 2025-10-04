// src/app/auth/auth.routes.ts

import { Routes } from '@angular/router';
import { LoginComponent } from './login/login'; // Importar el componente Standalone

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    title: 'SSAA2 - Login'
  },
  // Si tuvieras una ruta de 'registro', iría aquí
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];
