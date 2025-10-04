// src/app/app.routes.ts

import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard'; // 1. Asumiendo que auth.guard está en core/

// Importa aquí los componentes que vas a usar (deben ser Standalone)
// La ruta debe apuntar al archivo TypeScript dentro de la carpeta del componente.

// Componentes Simples (en subcarpeta directa)
import { HomeComponent } from './home/home';               // Apunta a src/app/home/home.ts
import { UsersComponent } from './users/users';             // Apunta a src/app/users/users.ts

// Componentes con ruta anidada
import { AccountTreeComponent } from './accounts/account-tree/account-tree';  // Apunta a src/app/accounts/account-tree/account-tree.ts
import { AccountManageComponent } from './accounts/account-manage/account-manage'; // Apunta a src/app/accounts/account-manage/account-manage.ts

// Componentes Faltantes (Asegúrate de que existen estos archivos)
import { JournalEntriesComponent } from './journal-entries/journal-entries'; // Apunta a src/app/journal-entries/journal-entries.ts
import { ReportsComponent } from './reports/reports';                       // Apunta a src/app/reports/reports.ts


export const routes: Routes = [
  // Redirección inicial
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },

  // Ruta de Autenticación (Lazy Loaded)
  { path: 'auth', loadChildren: () => import('./auth/auth.routes').then(m => m.AUTH_ROUTES) },

  // RUTAS PROTEGIDAS Y CARGADAS DENTRO DEL LAYOUT

  // Visible para USER y ADMIN
  { path: 'home', component: HomeComponent, canActivate: [authGuard] },
  { path: 'accounts/tree', component: AccountTreeComponent, canActivate: [authGuard] },
  { path: 'journal-entries', component: JournalEntriesComponent, canActivate: [authGuard] },
  { path: 'reports', component: ReportsComponent, canActivate: [authGuard] },

  // RESTRINGIDA: Solo ADMIN
  {
    path: 'users',
    component: UsersComponent,
    canActivate: [authGuard],
    data: { roles: ['ADMIN'] } // <-- Solo permite el acceso si el rol es 'ADMIN'
  },
  // RESTRINGIDA: Solo ADMIN
  {
    path: 'accounts/manage',
    component: AccountManageComponent,
    canActivate: [authGuard],
    data: { roles: ['ADMIN'] }
  },

  // Ruta comodín para cualquier otra URL
  { path: '**', redirectTo: 'home' }
];
