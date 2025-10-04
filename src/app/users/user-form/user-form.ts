// src/app/users/user-form/user-form.ts

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
// Imports de Material para el formulario
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '../../core/user.service';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule,
    MatInputModule, MatButtonModule, MatFormFieldModule, MatSelectModule, MatIconModule
  ],
  templateUrl: './user-form.html',
  styleUrl: './user-form.scss'
})
export class UserFormComponent {

  private dialogRef = inject(MatDialogRef<UserFormComponent>);
  private fb = inject(FormBuilder);
  private userService = inject(UserService);

  userForm: FormGroup;
  roles = ['USER', 'ADMIN'];
  loading = false;

  constructor() {
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      // Solo pedimos la contraseña al crear, no en edición (simplificado)
      password: ['', Validators.required],
      role: ['USER', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const userData = this.userForm.value;

    // Asumimos que solo creamos, ya que la edición es más compleja y podemos simplificar
    this.userService.createUser(userData).subscribe({
      next: () => {
        alert('Usuario creado con éxito!');
        this.dialogRef.close(true); // Cierra y envía 'true' para indicar éxito
      },
      error: (err) => {
        this.loading = false;
        alert('Error al crear el usuario. Verifique si el nombre ya existe.');
        console.error('Error de creación de usuario:', err);
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
