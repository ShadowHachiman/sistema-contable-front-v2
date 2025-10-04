// src/app/users/users.ts

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog'; // Para el modal de creación

// Servicios y Modelos
import { UserService } from '../core/user.service';
import { User } from '../core/models/user.model';
import {Observable, of} from 'rxjs';
import { tap } from 'rxjs/operators';
// Importa el componente del modal que crearemos en el paso 2.B
import { UserFormComponent } from './user-form/user-form';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule, MatTableModule, MatButtonModule, MatIconModule, MatDialogModule
  ],
  templateUrl: './users.html',
  styleUrl: './users.scss'
})
export class UsersComponent implements OnInit {

  private userService = inject(UserService);
  private dialog = inject(MatDialog);

  users$: Observable<User[]> = of([]);
  displayedColumns: string[] = ['username', 'email', 'role', 'active', 'actions'];

  constructor() {
    this.users$ = new Observable<User[]>();
  }

  ngOnInit(): void {
    this.users$ = this.userService.getAllUsers();
  }

  loadUsers(): void {
    this.users$ = this.userService.getAllUsers().pipe(
      // Usamos tap para ver el progreso sin alterar el stream de datos
      tap(() => console.log('Usuarios cargados'))
    );
  }

  openCreateUserDialog(): void {
    const dialogRef = this.dialog.open(UserFormComponent, {
      width: '400px',
      data: { isEdit: false }
    });

    // Cuando el modal se cierra, si devolvió 'true' (guardado exitoso), recargamos la lista
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadUsers();
      }
    });
  }

  deleteUser(user: User): void {
    if (user.id && confirm(`¿Estás seguro de eliminar al usuario ${user.username}?`)) {
      this.userService.deleteUser(user.id).subscribe({
        next: () => {
          alert('Usuario eliminado con éxito.');
          this.loadUsers(); // Recarga la lista
        },
        error: (err) => {
          console.error('Error al eliminar:', err);
          alert('Error al eliminar el usuario.');
        }
      });
    }
  }
}
