import { RecetaIngrediente } from './receta-ingrediente.model';

export interface Receta {
  id: number;
  nombre: string;
  autor: string;
  tipo: string;
  porciones: number;
  procedimiento: string;
  tips: string;
  costoTotal: number;
  imagenUrl: string;
  ingredientes: RecetaIngrediente[];
}
