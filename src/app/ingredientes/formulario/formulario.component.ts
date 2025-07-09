import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { IngredienteService } from '../ingrediente.service';
import { Ingrediente } from '../ingrediente.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-formulario',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './formulario.component.html',
  styleUrl: './formulario.component.scss'
})
export class FormularioComponent implements OnInit {

  formulario!: FormGroup;
  esEdicion = false;
  ingredienteId?: number;

  constructor(
    private fb: FormBuilder,
    private ingredienteService: IngredienteService,
    private ruta: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.formulario = this.fb.group({
      nombre: ['', Validators.required],
      unidad: ['', Validators.required],
      costoUnitario: [0, [Validators.required, Validators.min(0)]]
    });

    const id = this.ruta.snapshot.paramMap.get('id');
    if (id) {
      this.esEdicion = true;
      this.ingredienteId = +id;
      this.ingredienteService.obtenerPorId(this.ingredienteId).subscribe((data) => {
        this.formulario.patchValue(data);
      });
    }
  }

  guardar() {
    const ingrediente: Ingrediente = {
      id: this.ingredienteId ?? 0,
      ...this.formulario.value
    };

    const peticion = this.esEdicion
      ? this.ingredienteService.actualizar(ingrediente.id, ingrediente)
      : this.ingredienteService.crear(ingrediente);

    peticion.subscribe( {
      next: () => {
      this.snackBar.open(
        'Ingrediente guardado correctamente',
        'Cerrar',
        {
          duration: 3000,
          panelClass: ['snackbar-success'],
          horizontalPosition: 'center',
          verticalPosition: 'top'
        }
      );
      this.router.navigate(['/ingredientes']);
    },
    error: (error) => {
      this.snackBar.open(
        error?.error?.mensaje || 'Error al guardar el ingrediente',
        'Cerrar',
        {
          duration: 5000,
          panelClass: ['snackbar-error'],
          horizontalPosition: 'center',
          verticalPosition: 'top'
        }
      );
    }
    });
  }

  volver(): void {
  this.router.navigate(['/ingredientes']);
  }

}
