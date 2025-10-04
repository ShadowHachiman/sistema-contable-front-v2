// src/app/home/home.ts

import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true, // Asegúrate de que sea standalone si no lo generaste con el flag
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomeComponent { // <-- CORREGIDO: DEBE ser HomeComponent

}
