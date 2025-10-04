import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

// 🛑 CORRECCIÓN CLAVE: Importamos la función para proveer el HttpClient
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),

    // 🛑 CORRECCIÓN CLAVE: Agregamos el proveedor de HttpClient aquí
    provideHttpClient(),
  ]
};
