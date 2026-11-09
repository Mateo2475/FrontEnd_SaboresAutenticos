export interface Categoria {
  idCategoria: number;
  idCategoriaPadre?: number | null;
  nombre: string;
  descripcion?: string;
}

export interface CategoriaRequest {
  idCategoriaPadre?: number | null;
  nombre: string;
  descripcion?: string;
}
