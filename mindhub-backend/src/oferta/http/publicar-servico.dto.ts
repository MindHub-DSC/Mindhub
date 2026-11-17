import { z } from 'zod';
import type { Servico } from '../dominio/servico.js';

/**
 * Formato aceito em POST /servicos (UC03, #40). A fronteira confere só o
 * formato: tipos, UUID, valores conhecidos do modelo e campos não previstos
 * (FE-01 → 400). Título vazio, preço negativo ou não inteiro, duração não
 * positiva e Reserva Direta sem condições são invariantes do domínio (#36) e
 * são verificados lá.
 *
 * D-UC03-05 (decidida em 17/11/2026): usuarioId identifica o ator no corpo,
 * enquanto não existe autenticação.
 */
export const publicarServicoSchema = z.strictObject({
  usuarioId: z.uuid(),
  titulo: z.string(),
  descricao: z.string(),
  modeloContratacao: z.enum(['RESERVA_DIRETA', 'SOB_PROPOSTA']),
  condicoes: z
    .strictObject({
      preco: z.number(),
      moeda: z.string(),
      duracaoMinutos: z.number(),
      modalidade: z.string(),
    })
    .optional(),
});

export type PublicarServicoRequest = z.infer<typeof publicarServicoSchema>;

export interface ServicoResponse {
  id: string;
  perfilId: string;
  titulo: string;
  descricao: string;
  modeloContratacao: string;
  condicoes: {
    preco: number;
    moeda: string;
    duracaoMinutos: number;
    modalidade: string;
  } | null;
  situacao: string;
}

/** Representação HTTP do Serviço; a entidade de domínio não é exposta direto. */
export function paraResposta(servico: Servico): ServicoResponse {
  return {
    id: servico.id,
    perfilId: servico.perfilId,
    titulo: servico.titulo,
    descricao: servico.descricao,
    modeloContratacao: servico.modeloContratacao,
    condicoes: servico.condicoes,
    situacao: servico.situacao,
  };
}
