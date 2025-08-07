import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IngredienteService } from '../../../ingredientes/ingrediente.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-formulario-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './formulario-dialog.component.html',
  styleUrl: './formulario-dialog.component.scss'
})
export class FormularioDialogComponent {
  formulario: FormGroup;

  constructor(
    private fb: FormBuilder,
    private ingredienteService: IngredienteService,
    private dialogRef: MatDialogRef<FormularioDialogComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.formulario = this.fb.group({
      nombre: ['', Validators.required],
      unidad: ['', Validators.required],
      costoUnitario: [0, [Validators.required, Validators.min(0)]]
    });

    // Si viene un ingrediente para edición
    if (data?.ingrediente) {
      this.formulario.patchValue(data.ingrediente);
    }
  }

  guardar() {
    if (this.formulario.invalid) return;

    this.ingredienteService.crear(this.formulario.value).subscribe({
      next: (ingrediente) => {
        this.snackBar.open('Ingrediente creado', 'Cerrar', { duration: 3000 });
        this.dialogRef.close(ingrediente); // ✅ devolver el ingrediente al componente que lo llama
      },
      error: () => {
        this.snackBar.open('Error al crear ingrediente', 'Cerrar', { duration: 3000 });
      }
    });
  }

  cancelar() {
    this.dialogRef.close();
  }
}
