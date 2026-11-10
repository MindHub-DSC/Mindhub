import { PerfilInvalido } from '../dominio/erros.js';
import { PerfilEspecialista } from '../dominio/perfil-especialista.js';
import { PerfilEspecialistaOrmEntity } from './perfil-especialista.orm-entity.js';

/** O banco devolveu um registro que não forma um perfil válido. */
export class RegistroDePerfilCorrompido extends Error {
  constructor(id: string, options: { cause: unknown }) {
    super(`Registro de perfil inválido no armazenamento (id ${id}).`, options);
    this.name = 'RegistroDePerfilCorrompido';
  }
}

/**
 * Tradução PerfilEspecialista ↔ PerfilEspecialistaOrmEntity.
 * Não decide nada: para restaurar, usa PerfilEspecialista.reconstituir, e não
 * cadastrar (que geraria outro id e voltaria a situação para ATIVO).
 */
export const PerfilEspecialistaMapper = {
  paraOrm(perfil: PerfilEspecialista): PerfilEspecialistaOrmEntity {
    const registro = new PerfilEspecialistaOrmEntity();
    registro.id = perfil.id;
    registro.usuarioId = perfil.usuarioId;
    registro.descricao = perfil.descricao;
    registro.especialidades = [...perfil.especialidades];
    registro.situacao = perfil.situacao;
    registro.criadoEm = perfil.criadoEm;
    return registro;
  },

  paraDominio(registro: PerfilEspecialistaOrmEntity): PerfilEspecialista {
    try {
      return PerfilEspecialista.reconstituir({
        id: registro.id,
        usuarioId: registro.usuarioId,
        descricao: registro.descricao,
        especialidades: registro.especialidades,
        situacao: registro.situacao,
        criadoEm: registro.criadoEm,
      });
    } catch (erro) {
      // Dado inválido vindo do banco é defeito técnico (500), não erro do cliente (400).
      if (erro instanceof PerfilInvalido) {
        throw new RegistroDePerfilCorrompido(registro.id, { cause: erro });
      }
      throw erro;
    }
  },
};
