import { Producto as ProductoModel, ProductoRequest } from '../models/producto.models';

export class Producto implements ProductoModel {
  idProducto = 0;
  idCategoria?: number;
  nombre = '';
  categoria = '';
  precio = 0;
  stock = 0;
  stockMinimo = 0;
  activo = true;
  disponible = true;
  fechaCaducidad?: string;

  static fromJson(json: Partial<ProductoModel>): Producto {
    const producto = new Producto();
    producto.idProducto = json.idProducto ?? 0;
    producto.idCategoria = json.idCategoria;
    producto.nombre = json.nombre ?? '';
    producto.categoria = json.categoria ?? '';
    producto.precio = Number(json.precio ?? 0);
    producto.stock = json.stock ?? 0;
    producto.stockMinimo = json.stockMinimo ?? 0;
    producto.activo = json.activo ?? true;
    producto.disponible = json.disponible ?? producto.stock > 0;
    producto.fechaCaducidad = json.fechaCaducidad;
    return producto;
  }

  toRequest(): ProductoRequest {
    return {
      nombre: this.nombre,
      precio: this.precio,
      stock: this.stock,
      stockMinimo: this.stockMinimo,
      activo: this.activo,
      fechaCaducidad: this.fechaCaducidad,
      categoria: { idCategoria: this.idCategoria ?? 0 },
    };
  }

  get stockBajo(): boolean {
    return this.stock <= this.stockMinimo;
  }
}
