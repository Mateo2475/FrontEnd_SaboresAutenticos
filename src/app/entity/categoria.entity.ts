import { Categoria as CategoriaModel, CategoriaRequest } from '../models/categoria.models';

export class Categoria implements CategoriaModel {
  idCategoria = 0;
  idCategoriaPadre: number | null = null;
  nombre = '';
  descripcion = '';

  static fromJson(json: Partial<CategoriaModel>): Categoria {
    const categoria = new Categoria();
    categoria.idCategoria = json.idCategoria ?? 0;
    categoria.idCategoriaPadre = json.idCategoriaPadre ?? null;
    categoria.nombre = json.nombre ?? '';
    categoria.descripcion = json.descripcion ?? '';
    return categoria;
  }

  toRequest(): CategoriaRequest {
    return {
      idCategoriaPadre: this.idCategoriaPadre,
      nombre: this.nombre,
      descripcion: this.descripcion,
    };
  }

  get esSubcategoria(): boolean {
    return this.idCategoriaPadre !== null && this.idCategoriaPadre !== undefined;
  }
}
