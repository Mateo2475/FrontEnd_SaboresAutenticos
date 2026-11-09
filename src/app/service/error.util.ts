export function mensajeError(error: unknown): string {
  if (typeof error === 'string') {
    return error;
  }
  if (error && typeof error === 'object') {
    const objeto = error as Record<string, unknown>;
    const mensaje = objeto['error'];
    if (typeof mensaje === 'string') {
      return mensaje;
    }
    const message = objeto['message'];
    if (typeof message === 'string') {
      return message;
    }
  }
  return 'Ocurrió un error inesperado.';
}
