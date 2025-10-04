// src/app/journal-entries/journal-entries.ts

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray, AbstractControl
} from '@angular/forms';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table'; // Para la tabla de detalles

// Angular Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker'; // Para la fecha
import { MatNativeDateModule } from '@angular/material/core'; // Para el Datepicker
import { MatDividerModule } from '@angular/material/divider';

// Servicios y Modelos
import { AccountService } from '../core/account.service';
import { Account } from '../core/models/account.model';
import { JournalEntry } from '../core/models/journal-entry.model';
import { JournalEntryDetail } from '../core/models/journal-entry-detail.model';
import { Subscription } from 'rxjs';

// Interfaz para la Cuenta Imputable en el Formulario
interface ImputableAccountOption {
  id: number;
  code: string;
  name: string;
}

@Component({
  selector: 'app-journal-entries',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule, MatInputModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatSelectModule,
    MatDatepickerModule, MatNativeDateModule, MatTableModule, MatDividerModule
  ],
  templateUrl: './journal-entries.html',
  styleUrl: './journal-entries.scss'
})
export class JournalEntriesComponent implements OnInit {

  private fb = inject(FormBuilder);
  private accountService = inject(AccountService);
  private router = inject(Router);

  journalEntryForm: FormGroup;
  imputableAccounts: ImputableAccountOption[] = [];

  // Nombres de las columnas de la tabla de detalles
  displayedColumns: string[] = ['account', 'description', 'debit', 'credit', 'actions'];

  // Variables para mostrar el balance
  balanceSubscription: Subscription | undefined;
  totalDebit: number = 0;
  totalCredit: number = 0;

  constructor() {
    this.journalEntryForm = this.fb.group({
      date: [new Date(), Validators.required],
      description: ['', Validators.required],
      // FormArray para manejar la colección de detalles (líneas)
      details: this.fb.array([], [Validators.required, this.balanceValidator])
    });
  }

  ngOnInit(): void {
    this.loadImputableAccounts();
    this.addDetailRow(); // Agregar una línea por defecto
    this.subscribeToBalanceChanges();
  }

  // --- LÓGICA DE DATOS ---

  loadImputableAccounts(): void {
    this.accountService.getImputableAccounts().subscribe({
      next: (accounts: Account[]) => {
        this.imputableAccounts = accounts.map(a => ({ id: a.id, code: a.code, name: a.name }));
      },
      error: (err) => console.error('Error al cargar cuentas imputables:', err)
    });
  }

  // --- LÓGICA DE FORMULARIO DINÁMICO ---

  get detailsFormArray(): FormArray {
    return this.journalEntryForm.get('details') as FormArray;
  }

  private createDetailGroup(detail?: JournalEntryDetail): FormGroup {
    return this.fb.group({
      // Se usará el ID de la cuenta, no el ID del detalle del asiento
      accountId: [detail?.accountId || null, Validators.required],
      description: [detail?.description || '', Validators.required],
      debit: [detail?.debit || 0, Validators.min(0)],
      credit: [detail?.credit || 0, Validators.min(0)]
    });
  }

  addDetailRow(): void {
    this.detailsFormArray.push(this.createDetailGroup());
  }

  removeDetailRow(index: number): void {
    this.detailsFormArray.removeAt(index);
  }

  // --- LÓGICA DE VALIDACIÓN Y BALANCE (PARTIDA DOBLE) ---

  // Validador Custom para el FormArray
  private balanceValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const details = control as FormArray;
    let debit = 0;
    let credit = 0;

    details.controls.forEach((group: AbstractControl) => {
      debit += group.get('debit')?.value || 0;
      credit += group.get('credit')?.value || 0;
    });

    // Requerir al menos dos líneas y que el balance sea cero
    if (details.length < 2) {
      return { 'minTwoLines': true };
    }
    if (debit !== credit) {
      return { 'unbalanced': true };
    }

    return null;
  }

  // Suscribe el formulario para recalcular el balance en cada cambio
  subscribeToBalanceChanges(): void {
    this.balanceSubscription = this.detailsFormArray.valueChanges.subscribe((details: JournalEntryDetail[]) => {
      this.totalDebit = details.reduce((sum, item) => sum + (item.debit || 0), 0);
      this.totalCredit = details.reduce((sum, item) => sum + (item.credit || 0), 0);
    });
  }

  ngOnDestroy(): void {
    this.balanceSubscription?.unsubscribe();
  }

  // --- SUBMIT ---

  onSubmit(): void {
    this.journalEntryForm.markAllAsTouched();

    if (this.journalEntryForm.invalid) {
      alert('El asiento está incompleto o el Debe no cuadra con el Haber.');
      return;
    }

    const rawData = this.journalEntryForm.value;

    // Mapeo final de datos antes de enviar al backend
    const entryToSend: JournalEntry = {
      date: rawData.date.toISOString().substring(0, 10), // Formato YYYY-MM-DD
      description: rawData.description,
      totalDebit: this.totalDebit,
      totalCredit: this.totalCredit,
      details: rawData.details,
    };

    this.accountService.createJournalEntry(entryToSend).subscribe({
      next: (response) => {
        alert('Asiento contable registrado con éxito! ID: ' + response.id);
        this.router.navigate(['/']); // Redirige o limpia el formulario
      },
      error: (err) => {
        console.error('Error al registrar el asiento:', err);
        alert('Error al registrar el asiento. Verifique el backend.');
      }
    });
  }
}
