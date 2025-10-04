import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from './auth'; // Asegúrate que el nombre de archivo es 'auth.service'

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // 1. Verificar si está logueado
  if (!authService.isLoggedIn()) {
    // Si no está logueado, redirigir al login
    console.log('Guard: Usuario no logueado. Redirigiendo a login.');
    return router.parseUrl('/auth/login');
  }

  // 2. Verificar los roles requeridos
  // Accede al array de roles definido en la ruta (ej: data: { roles: ['ADMIN'] })
  const requiredRoles = route.data['roles'] as Array<string>;

  if (requiredRoles && requiredRoles.length > 0) {
    const userRole = localStorage.getItem('userRole');

    // Chequear si el rol del usuario (ADMIN o USER) está en los roles permitidos
    if (userRole && requiredRoles.includes(userRole)) {
      return true; // Acceso permitido (el usuario tiene el rol necesario)
    } else {
      // Usuario logueado pero sin el rol requerido
      console.error('Guard: Acceso denegado. Rol requerido:', requiredRoles.join(', '), 'Rol de Usuario:', userRole);

      // 🛑 CORRECCIÓN: Eliminamos el alert() y solo redirigimos.
      return router.parseUrl('/home'); // Redirige a una ruta accesible, como el Home
    }
  }

  // 3. Si está logueado y la ruta no requiere un rol específico, permite el acceso
  return true;
};
