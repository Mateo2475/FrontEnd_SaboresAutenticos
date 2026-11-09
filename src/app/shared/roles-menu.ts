export const ROLES = {
  ADMIN: 'ADMIN',
  CAJERO: 'CAJERO',
  CONTADOR: 'CONTADOR',
  ALMACENERO: 'ALMACENERO',
} as const;

export type Rol = (typeof ROLES)[keyof typeof ROLES];

export interface MenuItem {
  etiqueta: string;
  ruta: string;
  roles: Rol[];
  icono: string;
}

export const MENU_ITEMS: MenuItem[] = [
  { etiqueta: 'Dashboard', ruta: '/dashboard', roles: [ROLES.ADMIN, ROLES.CAJERO, ROLES.CONTADOR], icono: '📊' },
  { etiqueta: 'Clientes', ruta: '/clientes', roles: [ROLES.ADMIN, ROLES.CAJERO], icono: '👥' },
  { etiqueta: 'Categorías', ruta: '/categorias', roles: [ROLES.ADMIN, ROLES.ALMACENERO], icono: '🗂️' },
  { etiqueta: 'Productos', ruta: '/productos', roles: [ROLES.ADMIN, ROLES.ALMACENERO, ROLES.CAJERO], icono: '🍰' },
  { etiqueta: 'Inventario', ruta: '/inventario', roles: [ROLES.ADMIN, ROLES.ALMACENERO, ROLES.CAJERO], icono: '📦' },
  { etiqueta: 'Nueva venta', ruta: '/ventas/nueva', roles: [ROLES.ADMIN, ROLES.CAJERO], icono: '🛒' },
  { etiqueta: 'Ventas', ruta: '/ventas', roles: [ROLES.ADMIN, ROLES.CAJERO, ROLES.CONTADOR], icono: '🧾' },
  { etiqueta: 'Créditos', ruta: '/creditos', roles: [ROLES.ADMIN, ROLES.CAJERO, ROLES.CONTADOR], icono: '💳' },
  { etiqueta: 'Abonos', ruta: '/abonos', roles: [ROLES.ADMIN, ROLES.CAJERO, ROLES.CONTADOR], icono: '💰' },
  { etiqueta: 'Comprobantes', ruta: '/comprobantes', roles: [ROLES.ADMIN, ROLES.CAJERO, ROLES.CONTADOR], icono: '📄' },
  { etiqueta: 'Reportes', ruta: '/reportes', roles: [ROLES.ADMIN, ROLES.CONTADOR], icono: '📈' },
  { etiqueta: 'Guías', ruta: '/guias', roles: [ROLES.ADMIN, ROLES.ALMACENERO], icono: '🚚' },
  { etiqueta: 'Alertas', ruta: '/alertas', roles: [ROLES.ADMIN, ROLES.CONTADOR], icono: '🔔' },
  { etiqueta: 'Empleados', ruta: '/empleados', roles: [ROLES.ADMIN], icono: '🧑‍🍳' },
  { etiqueta: 'Usuarios', ruta: '/usuarios', roles: [ROLES.ADMIN], icono: '🔐' },
  { etiqueta: 'Parámetros', ruta: '/parametros', roles: [ROLES.ADMIN], icono: '⚙️' },
  { etiqueta: 'Historial cajero', ruta: '/historial-cajero', roles: [ROLES.ADMIN, ROLES.CONTADOR], icono: '🧾' },
];

export const TODOS_LOS_ROLES: Rol[] = [ROLES.ADMIN, ROLES.CAJERO, ROLES.CONTADOR, ROLES.ALMACENERO];
