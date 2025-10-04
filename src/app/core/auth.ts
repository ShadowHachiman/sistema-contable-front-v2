// src/app/core/auth.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

// Define una interfaz simple para el usuario o la respuesta de login
interface LoginResponse {
  token: string;
  roles: string[]; // <-- Esto es lo que nos interesa: ['ADMIN'] o ['USER']
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Define un BehaviorSubject para almacenar el rol del usuario
  private userRoleSubject = new BehaviorSubject<string | null>(null);

  // URL del endpoint de login en tu Spring Boot (usando el proxy configurado)
  private loginUrl = '/api/auth/login';

  constructor(private http: HttpClient) {
    // Al iniciar el servicio, intenta cargar el rol guardado (si el usuario recarga la página)
    this.loadUserRole();
  }

  /**
   * 1. Lógica de LOGIN: Llama al backend e inicializa el rol
   */
  login(credentials: any): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.loginUrl, credentials).pipe(
      tap(response => {
        // Asumiendo que el backend te envía un array de roles, tomamos el primero
        const role = response.roles && response.roles.length > 0 ? response.roles[0] : 'USER';

        // 1. Guardar el token (típicamente en localStorage)
        localStorage.setItem('authToken', response.token);

        // 2. Guardar el rol y notificar a los componentes
        this.saveUserRole(role);
      })
    );
  }

  /**
   * 2. Lógica de ROLES: Funciones para verificar permisos
   */
  private saveUserRole(role: string): void {
    localStorage.setItem('userRole', role);
    this.userRoleSubject.next(role);
  }

  private loadUserRole(): void {
    const role = localStorage.getItem('userRole');
    if (role) {
      this.userRoleSubject.next(role);
    }
  }

  // MÉTODO CLAVE para el *ngIf en el menú
  isAdmin(): boolean {
    return this.userRoleSubject.getValue() === 'ADMIN';
  }

  // Puedes agregar otras funciones de verificación si fueran necesarias
  isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken'); // Verifica si hay un token
  }

  /**
   * 3. Lógica de LOGOUT
   */
  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    this.userRoleSubject.next(null);
  }
}
