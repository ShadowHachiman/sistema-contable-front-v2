// src/app/accounts/account-manage/account-manage.ts

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// Angular Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select'; // Para el selector de Cuenta Padre
import { MatCheckboxModule } from '@angular/material/checkbox'; // Para el campo imputable/activo

// Servicios y Modelos
import { AccountService } from '../../core/account.service';
import { Account } from '../../core/models/account.model';
import { Observable, EMPTY } from 'rxjs';

@Component({
  selector: 'app-account-manage',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDividerModule,
    MatCardModule, MatInputModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatSelectModule, MatCheckboxModule
  ],
  templateUrl: './account-manage.html',
  styleUrl: './account-manage.scss'
})
export class AccountManageComponent implements OnInit {

  private fb = inject(FormBuilder);
  private accountService = inject(AccountService);
  private router = inject(Router);

  accountForm: FormGroup;
  isEditMode: boolean = false;

  // Observable para almacenar las Cuentas Padre (No Imputables)
  parentAccounts$: Observable<Account[]> = EMPTY;

  constructor() {
    this.accountForm = this.fb.group({
      // Nota: El campo 'id' no es obligatorio al crear
      id: [null],
      code: ['', [Validators.required, Validators.maxLength(15)]],
      name: ['', Validators.required],
      // Importante: La cuenta Padre solo puede ser de Título (no imputable)
      parentId: [null],
      isImputable: [false],
      active: [true]
    });
  }

  ngOnInit(): void {
    // Carga las cuentas de Título para el selector de Cuenta Padre
    this.parentAccounts$ = this.accountService.getNonImputableAccounts();

    // Aquí puedes añadir lógica para cargar datos si estuvieras en modo edición
    // (ej: obtener el ID de la cuenta a editar de los parámetros de la ruta)
  }

  onSubmit(): void {
    if (this.accountForm.invalid) {
      alert('Por favor, complete todos los campos obligatorios.');
      return;
    }

    const formData = this.accountForm.value;

    // Decidir si es Crear o Editar
    const action = formData.id
      ? this.accountService.updateAccount(formData.id, formData)
      : this.accountService.createAccount(formData);

    action.subscribe({
      next: (account) => {
        alert(`Cuenta ${account.code} - ${account.name} guardada con éxito!`);
        this.router.navigate(['/accounts/tree']); // Redirige a la vista de árbol
      },
      error: (err) => {
        console.error('Error al guardar la cuenta:', err);
        alert('Error al guardar la cuenta. Verifique el código o la conexión.');
      }
    });
  }
}
