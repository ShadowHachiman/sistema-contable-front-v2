// src/app/core/account.service.ts

import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JournalEntry } from './models/journal-entry.model';
// **Ajuste de Ruta:** Importa el modelo desde la subcarpeta 'models'
import { Account } from './models/account.model';
import { BalanceReportItem } from './models/balance-report.model';
import { LedgerDetail } from './models/ledger-detail.model';

@Injectable({
  // Standalone: provisto en la raíz, disponible en toda la app
  providedIn: 'root'
})
export class AccountService {
  // El proxy redirigirá todas las llamadas a http://localhost:8080/api/accounts
  private apiUrl = '/api/accounts';

  // Inyección de dependencias moderna (Functional Injection)
  private http = inject(HttpClient);

  /**
   * Obtiene la estructura jerárquica (el árbol) del plan de cuentas.
   * Endpoint esperado en Spring Boot: GET /api/accounts/tree
   */
  getAccountTree(): Observable<Account[]> {
    const treeUrl = `${this.apiUrl}/tree`;
    // La respuesta del backend es un array de objetos Account jerárquicos
    return this.http.get<Account[]>(treeUrl);
  }

  /**
   * Obtiene la lista de cuentas (plana o para búsqueda).
   * Endpoint esperado en Spring Boot: GET /api/accounts
   */
  getAllAccounts(): Observable<Account[]> {
    return this.http.get<Account[]>(this.apiUrl);
  }

  /**
   * Obtiene todas las cuentas activas que NO son imputables (Cuentas de Título)
   * que pueden ser usadas como Cuentas Padre.
   * Endpoint esperado en Spring Boot: GET /accounts/non-imputable
   */
  getNonImputableAccounts(): Observable<Account[]> {
    const url = `${this.apiUrl}/non-imputable`;
    return this.http.get<Account[]>(url);
  }

  /**
   * Crea una nueva cuenta.
   * Endpoint esperado en Spring Boot: POST /accounts
   */
  createAccount(accountData: any): Observable<Account> {
    return this.http.post<Account>(this.apiUrl, accountData);
  }

  /**
   * Actualiza una cuenta existente.
   * Endpoint esperado en Spring Boot: PUT /accounts/{id}
   */
  updateAccount(id: number, accountData: any): Observable<Account> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<Account>(url, accountData);
  }

  /**
   * Obtiene todas las cuentas activas que SÍ son imputables.
   * Estas son las únicas cuentas que pueden usarse en un asiento contable.
   * Endpoint esperado en Spring Boot: GET /accounts/imputable
   */
  getImputableAccounts(): Observable<Account[]> {
    const url = `${this.apiUrl}/imputable`;
    return this.http.get<Account[]>(url);
  }

  /**
   * Crea un nuevo Asiento Contable.
   * Endpoint esperado en Spring Boot: POST /journal-entries
   */
  createJournalEntry(entry: JournalEntry): Observable<JournalEntry> {
    return this.http.post<JournalEntry>('/api/journal-entries', entry);
  }
  /**
   * Obtiene el Balance de Comprobación.
   * Endpoint esperado en Spring Boot: GET /reports/balance
   */
  getBalanceReport(): Observable<BalanceReportItem[]> {
    return this.http.get<BalanceReportItem[]>('/api/reports/balance');
  }

  /**
   * Obtiene el Libro Mayor para una cuenta específica.
   * Endpoint esperado en Spring Boot: GET /reports/ledger?accountId={id}
   */
  getLedgerReport(accountId: number): Observable<LedgerDetail[]> {
    const url = `/api/reports/ledger?accountId=${accountId}`;
    return this.http.get<LedgerDetail[]>(url);
  }
}
