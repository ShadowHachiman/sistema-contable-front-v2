import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Observable, EMPTY } from 'rxjs'; // <-- IMPORTACIÓN DE EMPTY AGREGADA AQUÍ

// Angular Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

// Servicios y Modelos
// Nota: Las rutas relativas a los servicios y modelos (ej: ../core/account.service)
// están asumidas como correctas, sin la extensión .ts.
import { AccountService } from '../core/account.service';
import { Account } from '../core/models/account.model';
import { BalanceReportItem } from '../core/models/balance-report.model';
import { LedgerDetail } from '../core/models/ledger-detail.model';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatCardModule, MatTabsModule, MatTableModule, MatFormFieldModule, MatSelectModule, MatButtonModule, MatIconModule
  ],
  templateUrl: './reports.html',
  styleUrl: './reports.scss'
})
export class ReportsComponent implements OnInit { // <-- CLASE NOMBRADA COMO Component

  private accountService = inject(AccountService);
  private fb = inject(FormBuilder);

  // --- Balance de Comprobación ---
  balanceReportData: BalanceReportItem[] = [];
  balanceColumns: string[] = ['accountCode', 'accountName', 'debit', 'credit', 'balanceDebit', 'balanceCredit'];
  totalBalanceDebit: number = 0;
  totalBalanceCredit: number = 0;

  // --- Libro Mayor ---
  ledgerForm = this.fb.group({
    accountId: [null, Validators.required]
  });
  // CORREGIDO: Inicialización con EMPTY para resolver TS2564
  accounts$: Observable<Account[]> = EMPTY;

  ledgerReportData: LedgerDetail[] = [];
  ledgerColumns: string[] = ['date', 'journalEntryId', 'description', 'debit', 'credit', 'runningBalance'];

  constructor() {}

  ngOnInit(): void {
    // Cargar las cuentas disponibles para el selector del Libro Mayor
    this.accounts$ = this.accountService.getAllAccounts();

    // Cargar el Balance al iniciar
    this.loadBalanceReport();
  }

  // --- Métodos de Carga ---

  loadBalanceReport(): void {
    this.accountService.getBalanceReport().subscribe({
      next: (data) => {
        this.balanceReportData = data;
        // Calcular totales
        this.totalBalanceDebit = data.reduce((sum, item) => sum + item.balanceDebit, 0);
        this.totalBalanceCredit = data.reduce((sum, item) => sum + item.balanceCredit, 0);
      },
      error: (err) => console.error('Error al cargar Balance:', err)
    });
  }

  loadLedgerReport(): void {
    const accountId = this.ledgerForm.get('accountId')?.value;
    if (this.ledgerForm.valid && accountId) {
      this.accountService.getLedgerReport(accountId).subscribe({
        next: (data) => {
          this.ledgerReportData = data;
        },
        error: (err) => console.error('Error al cargar Libro Mayor:', err)
      });
    }
  }
}
