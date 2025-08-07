import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RecetaService } from '../receta.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Ingrediente } from '../../ingredientes/ingrediente.model';
import { IngredienteService } from '../../ingredientes/ingrediente.service';
import { MatSelectModule } from '@angular/material/select';
import { RecetaIngrediente } from '../receta-ingrediente.model';
import { FormsModule, FormControl } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { MatDialog } from '@angular/material/dialog';
import { FormularioDialogComponent } from '../../ingredientes/formulario/formulario-dialog/formulario-dialog.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { map, Observable, startWith } from 'rxjs';

@Component({
  selector: 'app-formulario-receta',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatSelectModule,
    MatListModule,
    MatAutocompleteModule
  ],
  templateUrl: './formulario.component.html',
  styleUrl: './formulario.component.scss'
})
export class FormularioComponent implements OnInit {
  formulario!: FormGroup;
  esEdicion = false;
  recetaId?: number;

  ingredientesDisponibles: Ingrediente[] = [];
  ingredientesReceta: RecetaIngrediente[] = [];

  ingredienteSeleccionado?: number;
  cantidadSeleccionada?: number;
  unidadSeleccionada?: string;

  ingredienteControl = new FormControl('');
  ingredientesFiltrados!: Observable<Ingrediente[]>;
  //ingredienteSeleccionado?: number;

  constructor(
    private fb: FormBuilder,
    private recetaService: RecetaService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private ingredienteService: IngredienteService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.formulario = this.fb.group({
      nombre: ['', Validators.required],
      autor: ['', Validators.required],
      tipo: ['', Validators.required],
      porciones: [1, [Validators.required, Validators.min(1)]],
      procedimiento: ['', Validators.required],
      tips: [''],
      imagenUrl: ['']
    });

    this.ingredienteService.obtenerTodos().subscribe(data => {
    this.ingredientesDisponibles = data;
    this.ingredientesFiltrados = this.ingredienteControl.valueChanges.pipe(
      startWith(''),
      map(value => this.filtrarIngredientes(value || ''))
    );
  });  

    this.recetaId = Number(this.route.snapshot.paramMap.get('id'));
    this.esEdicion = !!this.recetaId;

    if (this.esEdicion) {
      this.recetaService.obtenerPorId(this.recetaId!).subscribe(receta => {
        console.log('Ingredientes desde backend:', receta.ingredientes);

        this.formulario.patchValue(receta);

        // ✅ Cargar ingredientes en la receta
        this.ingredientesReceta = receta.ingredientes.map((ri: any) => {
          const ing = this.ingredientesDisponibles.find(i => i.nombre === ri.nombreIngrediente); // corregí también esto si hace falta
          return {
            idIngrediente: ri.idIngrediente ?? ri.id, // asegurate de usar el nombre correcto del backend
            nombreIngrediente: ri.nombreIngrediente ?? ri.nombre, // compatibilidad con backend
            cantidad: ri.cantidad,
            unidad: ri.unidad
          };
        });
      });
    }
  }

  // Filtra los ingredientes a medida que escribimos los nombres
  private filtrarIngredientes(valor: string): Ingrediente[] {
    const filtro = valor.toLowerCase();
    return this.ingredientesDisponibles.filter(ing => ing.nombre.toLowerCase().includes(filtro));
  } 

  seleccionarIngrediente(ingrediente: Ingrediente): void {
    this.ingredienteSeleccionado = ingrediente.id;
    this.ingredienteControl.setValue(ingrediente.nombre, { emitEvent: false });
  }
  imagenSeleccionada: File | null = null;

  guardar(): void {
    if (this.formulario.invalid || this.ingredientesReceta.length === 0) {
      // mostrar error
      return;
    }

    const receta = {
      ...this.formulario.value,
      ingredientes: this.ingredientesReceta.map(i => ({
        ingredienteId: i.idIngrediente,
        cantidad: i.cantidad
      }))
    };

    if (this.esEdicion) {
      this.recetaService.actualizar(this.recetaId!, receta, this.imagenSeleccionada ?? undefined)
        .subscribe({ next: r => this.volver(), error: err => console.error(err) });
    } else {
      this.recetaService.crear(receta, this.imagenSeleccionada ?? undefined)
        .subscribe({ next: r => this.volver(), error: err => console.error(err) });
    }
  }

  private buildFormData(receta: any, imagen?: File): FormData {
    const formData = new FormData();

    formData.append('nombre', receta.nombre);
    formData.append('autor', receta.autor);
    formData.append('tipo', receta.tipo);
    formData.append('porciones', receta.porciones.toString());
    formData.append('procedimiento', receta.procedimiento || '');
    formData.append('tips', receta.tips || '');

    receta.ingredientes.forEach((ing: any, index: number) => {
      formData.append(`ingredientes[${index}].ingredienteId`, ing.idIngrediente?.toString());
      formData.append(`ingredientes[${index}].cantidad`, ing.cantidad.toString());
    });

    if (imagen) {
      formData.append('imagen', imagen);
    }

    return formData;
  }
  volver(): void {
    this.router.navigate(['/recetas']);
  }


  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.imagenSeleccionada = fileInput.files[0];
    }
  }

  cancelar(): void {
    this.router.navigate(['/recetas']);
  }

  agregarIngrediente() {
    if (this.ingredienteSeleccionado && this.cantidadSeleccionada && this.unidadSeleccionada) {
      const ingredienteEncontrado = this.ingredientesDisponibles.find(i => i.id === this.ingredienteSeleccionado);

      if (ingredienteEncontrado) {
        const ingrediente = {
          idIngrediente: ingredienteEncontrado.id, // ✅ nombre correcto que espera el backend
          nombreIngrediente: ingredienteEncontrado.nombre,
          cantidad: this.cantidadSeleccionada,
          unidad: this.unidadSeleccionada
        };
        console.log(ingrediente)
        this.ingredientesReceta.push(ingrediente);

        // Limpiar los campos
        this.ingredienteSeleccionado = undefined;
        this.cantidadSeleccionada = undefined;
        this.unidadSeleccionada = '';
      }
    }
  }

  abrirDialogoCrearIngrediente() {
  const dialogRef = this.dialog.open(FormularioDialogComponent, {
    width: '400px',
    height: '350px',
    panelClass: 'custom-dialog-container'
  });

  dialogRef.afterClosed().subscribe((nuevoIngrediente) => {
    if (nuevoIngrediente) {
      this.ingredientesDisponibles.push(nuevoIngrediente);
      this.snackBar.open('Ingrediente agregado exitosamente', 'Cerrar', { duration: 3000 });
    }
  });
}


}
