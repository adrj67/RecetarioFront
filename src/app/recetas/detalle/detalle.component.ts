import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RecetaService } from '../receta.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Receta } from '../receta.model'; 
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-detalle',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    RouterModule
  ],
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.scss']
})
export class DetalleComponent implements OnInit {
  recetas: Receta[] = [];
  recetasFiltradas: Receta[] = [];
  columnas: string[] = ['nombre', 'tipo', 'autor', 'acciones'];

  nombreFiltro = new FormControl('');
  tipoFiltro = new FormControl('');
  autorFiltro = new FormControl('');

  constructor(private recetaService: RecetaService) {}

  ngOnInit(): void {
    this.recetaService.obtenerTodas().subscribe({
      next: (data) => {
        this.recetas = data;
        this.filtrar();
      },
      error: (err) => console.error('Error cargando recetas', err)
    });

    // Escuchamos cambios
    this.nombreFiltro.valueChanges.subscribe(() => this.filtrar());
    this.tipoFiltro.valueChanges.subscribe(() => this.filtrar());
    this.autorFiltro.valueChanges.subscribe(() => this.filtrar());
  }

  filtrar() {
    const nombre = this.nombreFiltro.value?.toLowerCase() || '';
    const tipo = this.tipoFiltro.value?.toLowerCase() || '';
    const autor = this.autorFiltro.value?.toLowerCase() || '';

    this.recetasFiltradas = this.recetas.filter(receta =>
      receta.nombre.toLowerCase().includes(nombre) &&
      receta.tipo.toLowerCase().includes(tipo) &&
      receta.autor.toLowerCase().includes(autor)
    );
  }
}