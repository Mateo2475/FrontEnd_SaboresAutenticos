import { Routes } from '@angular/router';
import { authGuard, loginGuard, roleGuard } from '../settings';
import { ROLES } from '../shared/roles-menu';

export const routes: Routes = [
  {
    path: 'login',
    title: 'Iniciar sesión',
    canActivate: [loginGuard],
    loadComponent: () => import('../components/login/login').then((m) => m.Login),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('../components/layout/layout').then((m) => m.Layout),
    children: [
      { path: 'dashboard', title: 'Dashboard', canActivate: [roleGuard], data: { roles: [ROLES.ADMIN, ROLES.CAJERO, ROLES.CONTADOR] }, loadComponent: () => import('../components/dashboard/dashboard').then((m) => m.Dashboard) },
      { path: 'clientes', title: 'Clientes', canActivate: [roleGuard], data: { roles: [ROLES.ADMIN, ROLES.CAJERO] }, loadComponent: () => import('../components/clientes/clientes').then((m) => m.Clientes) },
      { path: 'clientes/:id/historial', title: 'Historial de consumo', canActivate: [roleGuard], data: { roles: [ROLES.ADMIN, ROLES.CAJERO, ROLES.CONTADOR] }, loadComponent: () => import('../components/clientes/historial-cliente').then((m) => m.HistorialCliente) },
      { path: 'categorias', title: 'Categorías', canActivate: [roleGuard], data: { roles: [ROLES.ADMIN, ROLES.ALMACENERO] }, loadComponent: () => import('../components/categorias/categorias').then((m) => m.Categorias) },
      { path: 'productos', title: 'Productos', canActivate: [roleGuard], data: { roles: [ROLES.ADMIN, ROLES.ALMACENERO, ROLES.CAJERO] }, loadComponent: () => import('../components/productos/productos').then((m) => m.Productos) },
      { path: 'inventario', title: 'Inventario', canActivate: [roleGuard], data: { roles: [ROLES.ADMIN, ROLES.ALMACENERO, ROLES.CAJERO] }, loadComponent: () => import('../components/inventario/inventario').then((m) => m.Inventario) },
      { path: 'ventas/nueva', title: 'Nueva venta', canActivate: [roleGuard], data: { roles: [ROLES.ADMIN, ROLES.CAJERO] }, loadComponent: () => import('../components/ventas/venta-pos').then((m) => m.VentaPos) },
      { path: 'ventas/:id', title: 'Detalle de venta', canActivate: [roleGuard], data: { roles: [ROLES.ADMIN, ROLES.CAJERO, ROLES.CONTADOR] }, loadComponent: () => import('../components/ventas/venta-detalle').then((m) => m.VentaDetalle) },
      { path: 'ventas', title: 'Ventas', canActivate: [roleGuard], data: { roles: [ROLES.ADMIN, ROLES.CAJERO, ROLES.CONTADOR] }, loadComponent: () => import('../components/ventas/ventas').then((m) => m.Ventas) },
      { path: 'creditos/:idCliente', title: 'Créditos por cliente', canActivate: [roleGuard], data: { roles: [ROLES.ADMIN, ROLES.CAJERO, ROLES.CONTADOR] }, loadComponent: () => import('../components/creditos/credito-detalle').then((m) => m.CreditoDetalle) },
      { path: 'creditos', title: 'Créditos', canActivate: [roleGuard], data: { roles: [ROLES.ADMIN, ROLES.CAJERO, ROLES.CONTADOR] }, loadComponent: () => import('../components/creditos/creditos').then((m) => m.Creditos) },
      { path: 'abonos', title: 'Abonos', canActivate: [roleGuard], data: { roles: [ROLES.ADMIN, ROLES.CAJERO, ROLES.CONTADOR] }, loadComponent: () => import('../components/abonos/abonos').then((m) => m.Abonos) },
      { path: 'historial-cajero', title: 'Historial por cajero', canActivate: [roleGuard], data: { roles: [ROLES.ADMIN, ROLES.CONTADOR] }, loadComponent: () => import('../components/historial-cajero/historial-cajero').then((m) => m.HistorialCajero) },
      { path: 'comprobantes', title: 'Comprobantes', canActivate: [roleGuard], data: { roles: [ROLES.ADMIN, ROLES.CAJERO, ROLES.CONTADOR] }, loadComponent: () => import('../components/comprobantes/comprobantes').then((m) => m.Comprobantes) },
      { path: 'reportes', title: 'Reportes', canActivate: [roleGuard], data: { roles: [ROLES.ADMIN, ROLES.CONTADOR] }, loadComponent: () => import('../components/reportes/reportes').then((m) => m.Reportes) },
      { path: 'guias', title: 'Guías', canActivate: [roleGuard], data: { roles: [ROLES.ADMIN, ROLES.ALMACENERO] }, loadComponent: () => import('../components/guias/guias').then((m) => m.Guias) },
      { path: 'alertas', title: 'Alertas', canActivate: [roleGuard], data: { roles: [ROLES.ADMIN, ROLES.CONTADOR] }, loadComponent: () => import('../components/alertas/alertas').then((m) => m.Alertas) },
      { path: 'empleados', title: 'Empleados', canActivate: [roleGuard], data: { roles: [ROLES.ADMIN] }, loadComponent: () => import('../components/empleados/empleados').then((m) => m.Empleados) },
      { path: 'usuarios', title: 'Usuarios', canActivate: [roleGuard], data: { roles: [ROLES.ADMIN] }, loadComponent: () => import('../components/usuarios/usuarios').then((m) => m.Usuarios) },
      { path: 'parametros', title: 'Parámetros', canActivate: [roleGuard], data: { roles: [ROLES.ADMIN] }, loadComponent: () => import('../components/parametros/parametros').then((m) => m.Parametros) },
      { path: 'forbidden', title: 'Sin permisos', loadComponent: () => import('../components/forbidden/forbidden').then((m) => m.Forbidden) },
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
    ],
  },
  { path: '404', loadComponent: () => import('../components/not-found/not-found').then((m) => m.NotFound) },
  { path: '**', redirectTo: '404' },
];
