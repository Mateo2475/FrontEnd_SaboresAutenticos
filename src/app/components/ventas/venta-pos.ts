import { Component, OnInit, computed, inject, signal, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { ProductoService } from '../../servicios/producto.service';
import { ClienteService } from '../../servicios/cliente.service';
import { VentaService } from '../../servicios/venta.service';
import { Producto } from '../../models/producto.models';
import { Cliente } from '../../models/cliente.models';
import { TipoPago, Venta, VentaRequest } from '../../models/venta.models';
import { NotificacionService } from '../../service/notificacion.service';
import { mensajeError } from '../../service/error.util';
import { catchError, debounceTime, distinctUntilChanged, filter, finalize, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

interface LineaCarrito {
  producto: Producto;
  cantidad: number;
}

@Component({
  selector: 'app-venta-pos',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './venta-pos.html',
  styleUrl: './venta-pos.css'
})


export class VentaPos implements OnInit {
  private readonly productoService = inject(ProductoService);
  private readonly clienteService = inject(ClienteService);
  private readonly ventaService = inject(VentaService);
  private readonly notificacionService = inject(NotificacionService);

  private readonly destroyRef = inject(DestroyRef);

  readonly productos = signal<Producto[]>([]);
  readonly clientes = signal<Cliente[]>([]);
  readonly carrito = signal<LineaCarrito[]>([]);
  readonly buscador = signal('');
  readonly tipoPago = signal<TipoPago>('CONTADO');
  readonly idCliente = signal<number | null>(null);
  readonly clienteSeleccionado = signal<Cliente | null>(null);
  readonly busquedaCliente = new FormControl('', { nonNullable: true });
  readonly montoRecibido = signal(0);
  readonly montoYape = signal(0);
  readonly procesando = signal(false);
  readonly ultimaVenta = signal<Venta | null>(null);

  metodoPago = 'EFECTIVO';

  readonly productosFiltrados = computed(() => {
    const texto = this.buscador().toLowerCase().trim();
    return this.productos().filter(
      (producto) => producto.disponible && (texto.length === 0 || producto.nombre.toLowerCase().includes(texto)),
    );
  });

  readonly total = computed(() =>
    this.carrito().reduce((suma, linea) => suma + linea.producto.precio * linea.cantidad, 0),
  );

  readonly diferencia = computed(() => this.montoRecibido() - this.total());

  readonly montoEfectivo = signal(0);

  readonly puedeRegistrar = computed(() => {
    if (this.carrito().length === 0) {
      return false;
    }
    if (this.tipoPago() === 'CREDITO') {
      return this.idCliente() !== null;
    }
    if (this.metodoPago === 'COMBINADO') {
      return Math.abs(this.montoYape() + this.montoEfectivo() - this.total()) < 0.001 && this.montoYape() > 0;
    }
    return Math.abs(this.diferencia()) < 0.001;
  });

  ngOnInit(): void {
    this.cargarProductos();
    this.busquedaCliente.valueChanges
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
        filter((texto) => texto.trim().length >= 3),
        switchMap((texto) =>
          this.clienteService.buscar(texto.trim()).pipe(
            catchError((error: unknown) => {
              this.notificacionService.error(mensajeError(error));
              return of<Cliente[]>([]);
            }),
          ),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((clientes: Cliente[]) => this.clientes.set(clientes.filter((cliente: Cliente) => cliente.activo)));
  }

  cargarProductos(): void {
    this.productoService.listar().subscribe({
      next: (productos) => this.productos.set(productos),
      error: (error: unknown) => this.notificacionService.error(mensajeError(error)),
    });
  }

  agregar(producto: Producto): void {
    if (producto.stock <= 0) {
      return;
    }
    this.carrito.update((lineas) => {
      const existente = lineas.find((linea) => linea.producto.idProducto === producto.idProducto);
      if (existente) {
        if (existente.cantidad >= producto.stock) {
          return lineas;
        }
        return lineas.map((linea) =>
          linea.producto.idProducto === producto.idProducto
            ? { ...linea, cantidad: linea.cantidad + 1 }
            : linea,
        );
      }
      return [...lineas, { producto, cantidad: 1 }];
    });
    this.montoRecibido.set(this.total());
    if (this.metodoPago === 'COMBINADO') {
      this.montoEfectivo.set(Math.max(0, this.total() - this.montoYape()));
    }
  }

  actualizarCantidad(linea: LineaCarrito, evento: Event): void {
    const cantidad = Number((evento.target as HTMLInputElement).value);
    const nueva = Math.max(1, Math.min(cantidad, linea.producto.stock));
    this.carrito.update((lineas) =>
      lineas.map((item) => (item.producto.idProducto === linea.producto.idProducto ? { ...item, cantidad: nueva } : item)),
    );
    this.montoRecibido.set(this.total());
    if (this.metodoPago === 'COMBINADO') {
      this.montoEfectivo.set(Math.max(0, this.total() - this.montoYape()));
    }
  }

  quitar(linea: LineaCarrito): void {
    this.carrito.update((lineas) => lineas.filter((item) => item.producto.idProducto !== linea.producto.idProducto));
  }

  limpiar(): void {
    this.carrito.set([]);
    this.montoRecibido.set(0);
    this.montoYape.set(0);
    this.montoEfectivo.set(0);
    this.idCliente.set(null);
    this.tipoPago.set('CONTADO');
  }

  cambiarTipoPago(tipo: TipoPago): void {
    this.tipoPago.set(tipo);
    if (tipo === 'CREDITO') {
      this.montoRecibido.set(0);
    } else {
      this.montoRecibido.set(this.total());
    }
  }

  seleccionarCliente(cliente: Cliente): void {
    this.idCliente.set(cliente.idCliente);
    this.clienteSeleccionado.set(cliente);
    this.busquedaCliente.setValue(`${cliente.nombres} ${cliente.apellidos}`, { emitEvent: false });
    this.clientes.set([]);
  }

  actualizarYape(evento: Event): void {
    const valor = Number((evento.target as HTMLInputElement).value);
    this.montoYape.set(Number.isNaN(valor) ? 0 : valor);
    this.montoEfectivo.set(Math.max(0, this.total() - this.montoYape()));
  }

  actualizarEfectivo(evento: Event): void {
    const valor = Number((evento.target as HTMLInputElement).value);
    this.montoEfectivo.set(Number.isNaN(valor) ? 0 : valor);
  }

  registrar(): void {
    if (!this.puedeRegistrar()) {
      return;
    }
    this.procesando.set(true);

    let pagos: { metodoPago: string; monto: number }[] | undefined;
    if (this.tipoPago() === 'CONTADO') {
      if (this.metodoPago === 'COMBINADO') {
        pagos = [
          { metodoPago: 'YAPE', monto: this.montoYape() },
          { metodoPago: 'EFECTIVO', monto: this.montoEfectivo() },
        ];
      } else if (this.metodoPago === 'YAPE') {
        pagos = [{ metodoPago: 'YAPE', monto: this.total() }];
      } else {
        pagos = [{ metodoPago: this.metodoPago, monto: this.total() }];
      }
    }

    const request: VentaRequest = {
      idCliente: this.idCliente(),
      tipoPago: this.tipoPago(),
      items: this.carrito().map((linea) => ({
        idProducto: linea.producto.idProducto,
        cantidad: linea.cantidad,
      })),
      pagos,
    };

    const ejecutar = (req: VentaRequest, esFallback = false) => {
      this.ventaService.registrar(req).pipe(finalize(() => this.procesando.set(false))).subscribe({
        next: (venta) => {
          this.ultimaVenta.set(venta);
          if (esFallback) {
            this.notificacionService.exito('Yape falló. Se registró el pago en Efectivo.');
          } else {
            this.notificacionService.exito('Venta registrada correctamente.');
          }
          this.limpiar();
          this.cargarProductos();
        },
        error: (error: unknown) => {
          if (!esFallback && this.metodoPago === 'YAPE') {
            const confirmar = window.confirm('Yape falló. ¿Desea registrar el pago en Efectivo?');
            if (confirmar) {
              const fallbackReq: VentaRequest = { ...req, pagos: [{ metodoPago: 'EFECTIVO', monto: this.total() }] };
              this.procesando.set(true);
              ejecutar(fallbackReq, true);
              return;
            }
          }
          this.notificacionService.error(mensajeError(error));
        },
      });
    };
    ejecutar(request);
  }
}
