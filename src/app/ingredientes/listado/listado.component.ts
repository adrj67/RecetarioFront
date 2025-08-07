import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { IngredienteService } from '../ingrediente.service';
import { Ingrediente } from '../ingrediente.model';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-listado',
  standalone: true,
  imports: [
    CommonModule, 
    MatCardModule, 
    MatButtonModule, 
    RouterModule, 
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './listado.component.html',
  styleUrl: './listado.component.scss'
})
export class ListadoComponent implements OnInit {

  ingredientes: Ingrediente[] = [];

  constructor(
    private ingredienteService: IngredienteService,
    private snackBar: MatSnackBar,
    ){}

  ngOnInit(): void {
    this.ingredienteService.obtenerTodos().subscribe({
      next: (datos) => this.ingredientes = datos.sort((a, b) => a.nombre.localeCompare(b.nombre)),
      error: (err) => console.error('Error cargando ingredientes: ', err)
    });
  }

  eliminarIngrediente(id: number): void {
  if (confirm('¿Estás seguro de que querés eliminar este ingrediente?')) {
    this.ingredienteService.eliminar(id).subscribe({
      next: () => {
        this.ingredientes = this.ingredientes.filter(i => i.id !== id);
        this.snackBar.open('Ingrediente eliminado con éxito', 'Cerrar', {
        duration: 3000,
        panelClass: ['snackbar-success'],
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
      },
      error: (error) => {
  this.snackBar.open(
    error?.error?.mensaje || 'No se pudo eliminar el ingrediente.',
    'Cerrar',
    { duration: 7000, panelClass: ['snackbar-error'],  horizontalPosition: 'center', verticalPosition: 'top'  }
  );
}
    });
  }
}

}
