import { PerfilJaExistente } from '../../src/oferta/dominio/erros.js';
import {
  PerfilEspecialista,
  type DadosDoPerfil,
} from '../../src/oferta/dominio/perfil-especialista.js';
import type { PerfisEspecialistaRepositorio } from '../../src/oferta/dominio/perfis-especialista.repositorio.js';

/**
 * Implementação em memória da porta, só para testes.
 * Verificar e gravar acontecem no mesmo trecho síncrono (sem await entre eles),
 * por isso duas chamadas simultâneas nunca gravam dois perfis.
 * Guarda dados copiados, nunca a referência do objeto recebido.
 */
export class PerfisEspecialistaEmMemoria implements PerfisEspecialistaRepositorio {
  private readonly porUsuario = new Map<string, DadosDoPerfil>();
  chamadasDeAdicionar = 0;

  adicionar(perfil: PerfilEspecialista): Promise<void> {
    this.chamadasDeAdicionar++;
    if (this.porUsuario.has(perfil.usuarioId)) {
      return Promise.reject(new PerfilJaExistente());
    }
    this.porUsuario.set(perfil.usuarioId, {
      id: perfil.id,
      usuarioId: perfil.usuarioId,
      descricao: perfil.descricao,
      especialidades: [...perfil.especialidades],
      situacao: perfil.situacao,
      criadoEm: perfil.criadoEm,
    });
    return Promise.resolve();
  }

  buscarPorUsuario(usuarioId: string): Promise<PerfilEspecialista | null> {
    const dados = this.porUsuario.get(usuarioId);
    return Promise.resolve(
      dados ? PerfilEspecialista.reconstituir(dados) : null,
    );
  }
}
