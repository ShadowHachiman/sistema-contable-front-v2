// src/app/core/user.service.ts

import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, UserCreationDTO } from './models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = '/api/users';
  private http = inject(HttpClient);

  /**
   * Obtiene la lista de todos los usuarios.
   * Endpoint en Spring Boot: GET /api/users
   */
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  /**
   * Crea un nuevo usuario.
   * Endpoint en Spring Boot: POST /api/users
   */
  createUser(userData: UserCreationDTO): Observable<User> {
    return this.http.post<User>(this.apiUrl, userData);
  }

  /**
   * Elimina un usuario por ID.
   * Endpoint en Spring Boot: DELETE /api/users/{id}
   */
  deleteUser(userId: number): Observable<void> {
    const url = `${this.apiUrl}/${userId}`;
    return this.http.delete<void>(url);
  }

  /**
   * Actualiza el rol o estado de un usuario.
   * Endpoint en Spring Boot: PUT /api/users/{id}
   */
  updateUser(userId: number, userData: any): Observable<User> {
    const url = `${this.apiUrl}/${userId}`;
    // Usamos el mismo endpoint de creación o uno específico para actualización
    return this.http.put<User>(url, userData);
  }
}
