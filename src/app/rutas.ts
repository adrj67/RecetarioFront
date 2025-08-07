import { Routes } from '@angular/router';
import { ListadoComponent as ListadoRecetas } from './recetas/listado/listado.component';
import { FormularioComponent as FormularioReceta } from './recetas/formulario/formulario.component';
import { DetalleComponent } from './recetas/detalle/detalle.component';
import { ListadoComponent as ListadoIngredientes } from './ingredientes/listado/listado.component';
import { FormularioComponent as FormularioIngrediente } from './ingredientes/formulario/formulario.component';

export const rutas: Routes = [
  { path: '', redirectTo: 'recetas', pathMatch: 'full' },
  { path: 'recetas', component: ListadoRecetas },
  { path: 'recetas/nueva', loadComponent: () => import('./recetas/formulario/formulario.component').then(m => m.FormularioComponent)},
  { path: 'recetas/editar/:id', loadComponent: () => import('./recetas/formulario/formulario.component').then(m => m.FormularioComponent)},
  //{ path: 'recetas/detalle', component: DetalleComponent },
  { path: 'recetas/detalle', loadComponent: () => import('./recetas/detalle/detalle.component').then(m => m.DetalleComponent)},
  { path: 'recetas/:id', component: DetalleComponent },
  //{ path: 'recetas/:id/editar', component: FormularioReceta },
  { path: 'ingredientes', component: ListadoIngredientes },
  { path: 'ingredientes/nuevo', component: FormularioIngrediente },
  { path: 'ingredientes/:id/editar', component: FormularioIngrediente }
];
