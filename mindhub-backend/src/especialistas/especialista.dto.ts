import { z } from 'zod';
import { idSchema, nomeSchema, textoSchema } from '../common/schemas.js';

export const situacaoEspecialistaSchema = z.enum(['ATIVO', 'SUSPENSO']);
export const criarEspecialistaSchema = z.strictObject({
  usuarioId: idSchema,
  descricao: textoSchema,
  especialidades: z.array(nomeSchema).min(1).max(20),
});
export const alterarSituacaoSchema = z.strictObject({
  situacao: situacaoEspecialistaSchema,
});
export type CriarEspecialistaDto = z.infer<typeof criarEspecialistaSchema>;
export type AlterarSituacaoDto = z.infer<typeof alterarSituacaoSchema>;
export interface Especialista extends CriarEspecialistaDto {
  id: string;
  situacao: z.infer<typeof situacaoEspecialistaSchema>;
  criadoEm: string;
}
