import { Usuario as UsuarioModel } from '../models/usuario.models';

export class Usuario implements UsuarioModel {
  username = '';
  enabled = true;
  intentosFallidos = 0;
  bloqueadoHasta = 'NO';
  roles: string[] = [];

  static fromJson(json: Partial<UsuarioModel>): Usuario {
    const usuario = new Usuario();
    usuario.username = json.username ?? '';
    usuario.enabled = json.enabled ?? true;
    usuario.intentosFallidos = json.intentosFallidos ?? 0;
    usuario.bloqueadoHasta = json.bloqueadoHasta ?? 'NO';
    usuario.roles = json.roles ?? [];
    return usuario;
  }

  get bloqueado(): boolean {
    return this.bloqueadoHasta !== 'NO';
  }
}
