import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlatTreeControl } from '@angular/cdk/tree';
import { CdkTreeModule, NestedTreeControl } from '@angular/cdk/tree'; // Necesario para 'mat-tree-node-outlet'

// Módulos de Angular Material para el Árbol
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';


// Servicios y Modelos
// Asumiendo que esta es la ruta correcta para tu AccountService
import { AccountService } from '../../core/account.service';
import { Account } from '../../core/models/account.model';

// Definición de la interfaz para el nodo plano (FlatNode) que usas en el control del árbol
/** Flat node with expandable and level information */
interface AccountFlatNode {
  expandable: boolean;
  name: string;
  level: number;
  code: string;
}

@Component({
  selector: 'app-account-tree',
  standalone: true,
  imports: [
    CommonModule,
    // 🛑 CORRECCIÓN CLAVE: Debes importar CdkTreeModule para mat-tree-node-outlet
    CdkTreeModule,
    MatTreeModule,
    MatIconModule, MatButtonModule, MatCardModule, MatDividerModule
  ],
  templateUrl: './account-tree.html',
  styleUrl: './account-tree.scss'
})
export class AccountTreeComponent implements OnInit {

  private accountService = inject(AccountService);

  // 1. Definir el control del árbol (usando FlatTreeControl)
  treeControl = new FlatTreeControl<AccountFlatNode>(
    node => node.level,
    node => node.expandable,
  );

  // 2. Data Source (Aquí deberías usar MatTreeFlatDataSource)
  // Nota: Por simplicidad y para evitar errores de MatTreeFlatDataSource,
  // aquí deberás implementar la lógica de conversión de datos más adelante.
  // Por ahora, solo inicializamos la data base.
  dataSource: AccountFlatNode[] = [];

  constructor() { }

  ngOnInit(): void {
    // Aquí iría la lógica para cargar las cuentas y transformar la data
    // this.accountService.getAccountsTree().subscribe(data => { ... });
  }

  hasChild = (_: number, node: AccountFlatNode) => node.expandable;

  manageAccounts(): void {
    // Lógica para navegar a /accounts/manage
    console.log('Navegando a la gestión de cuentas...');
    // router.navigate(['/accounts/manage']); // si tuvieras el Router inyectado
  }
}
