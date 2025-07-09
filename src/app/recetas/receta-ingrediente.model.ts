import { Ingrediente } from './../ingredientes/ingrediente.model';

export interface RecetaIngrediente {
  id?: number;
  idIngrediente: number;
  nombreIngrediente?: string; // opcional, para mostrar en UI
  cantidad: number;
  unidad: string;
}
