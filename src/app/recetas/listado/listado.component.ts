import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecetaService } from '../receta.service';
import { Receta } from '../receta.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule, Router} from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-listado',
  standalone: true,
  imports: [
    CommonModule, 
    MatCardModule, 
    MatButtonModule, 
    MatIconModule,
    RouterModule
  ],
  templateUrl: './listado.component.html',
  styleUrl: './listado.component.scss'
})
export class ListadoComponent implements OnInit {

  recetas: Receta[] = [];

  constructor(
    private recetaService: RecetaService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.recetaService.obtenerTodas().subscribe({
      next: (res) => this.recetas = res,
      error: (err) => console.error('Error cargando recetas:', err)
    });
  }

  verFormulario(id: number): void {
    this.router.navigate(['/recetas/editar', id]);
  }

  nuevaReceta(): void {
    this.router.navigate(['/recetas/nueva']);
  }

  eliminar(id: number): void {
  const confirmado = confirm('¿Estás seguro que deseas eliminar esta receta?');

  if (confirmado) {
    this.recetaService.eliminar(id).subscribe({
      next: () => {
        this.recetas = this.recetas.filter(r => r.id !== id);
        this.snackBar.open('Receta eliminada correctamente', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['snackbar-success']
        });
      },
      error: () => {
        this.snackBar.open('No se pudo eliminar la receta', 'Cerrar', {
          duration: 4000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['snackbar-error']
        });
      }
    });
  }
}
  
}
