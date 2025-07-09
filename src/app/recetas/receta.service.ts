import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Receta } from './receta.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecetaService {

  private baseUrl = 'http://localhost:8080/api/recetas'; // Ajustar si es necesario

  constructor(private http: HttpClient) { }

  obtenerTodas(): Observable<Receta[]> {
    return this.http.get<Receta[]>(this.baseUrl);
  }

  obtenerPorId(id: number): Observable<Receta> {
    return this.http.get<Receta>(`${this.baseUrl}/${id}`);
  }

  crear(receta: any, imagen?: File): Observable<Receta> {
    const formData = this.buildFormData(receta, imagen);
    return this.http.post<Receta>(this.baseUrl, formData);
  }

  actualizar(id: number, receta: any, imagen?: File): Observable<Receta> {
    const formData = this.buildFormData(receta, imagen);
    return this.http.put<Receta>(`${this.baseUrl}/${id}`, formData);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
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
      formData.append(`ingredientes[${index}].ingredienteId`, ing.ingredienteId.toString());
      formData.append(`ingredientes[${index}].cantidad`, ing.cantidad.toString());
    });

    if (imagen) {
      formData.append('imagen', imagen);
    }

    return formData;
  }

}
