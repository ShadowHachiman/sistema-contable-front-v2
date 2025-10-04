// src/app/auth/login/login.ts

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; // <-- Importar ReactiveFormsModule
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth'; // Asumo el nombre simplificado

// Importaciones de Angular Material (necesarias para Standalone)
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common'; // Necesario para *ngIf y *ngFor

@Component({
  selector: 'app-login',
  standalone: true, // <-- ¡ESTO ES CLAVE!
  imports: [
    CommonModule,
    ReactiveFormsModule, // Usamos formularios reactivos

    // Material Imports
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
  ],
  templateUrl: './login.html', // Asumo el nombre simplificado
  styleUrl: './login.scss'     // Asumo el nombre simplificado
})
export class LoginComponent {
  // ... (El resto de la lógica de tu LoginComponent sigue igual)
  loginForm: FormGroup;
  errorMessage: string | null = null;
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    // ... (El resto de la lógica de onSubmit sigue igual)
    if (this.loginForm.invalid) {
      this.errorMessage = 'Por favor, ingrese usuario y contraseña.';
      return;
    }

    this.loading = true;
    this.errorMessage = null;

    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.loading = false;
        if (err.status === 401) {
          this.errorMessage = 'Credenciales inválidas.';
        } else {
          this.errorMessage = 'Ocurrió un error en el servidor.';
        }
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
