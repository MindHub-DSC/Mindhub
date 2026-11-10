import { z } from 'zod';
import type { PerfilEspecialista } from '../dominio/perfil-especialista.js';

/**
 * Formato aceito em POST /especialistas. A fronteira confere só o formato
 * (tipos, UUID, campos não previstos como "situacao"). Limites de tamanho e
 * repetição são invariantes do domínio e são verificados lá.
 *
 * D1 (decidida em 10/11/2026): usuarioId vem no corpo como limitação
 * temporária, enquanto não existe autenticação.
 */
export const cadastrarPerfilSchema = z.strictObject({
  usuarioId: z.uuid(),
  descricao: z.string(),
  especialidades: z.array(z.string()),
});

export type CadastrarPerfilRequest = z.infer<typeof cadastrarPerfilSchema>;

export interface PerfilEspecialistaResponse {
  id: string;
  usuarioId: string;
  descricao: string;
  especialidades: string[];
  situacao: string;
  criadoEm: string;
}

/** Representação HTTP do perfil; a entidade de domínio não é exposta direto. */
export function paraResposta(
  perfil: PerfilEspecialista,
): PerfilEspecialistaResponse {
  return {
    id: perfil.id,
    usuarioId: perfil.usuarioId,
    descricao: perfil.descricao,
    especialidades: [...perfil.especialidades],
    situacao: perfil.situacao,
    criadoEm: perfil.criadoEm.toISOString(),
  };
}
