import { z } from 'zod';
import { idSchema, textoSchema } from '../common/schemas.js';

export const criarSolicitacaoSchema = z.strictObject({
  clienteId: idSchema,
  especialistaId: idSchema,
  servicoId: idSchema.optional(),
  objetivo: textoSchema,
  escopo: textoSchema,
});
export const listarSolicitacoesSchema = z.strictObject({
  clienteId: idSchema.optional(),
  especialistaId: idSchema.optional(),
});
export type CriarSolicitacaoDto = z.infer<typeof criarSolicitacaoSchema>;
export type ListarSolicitacoesDto = z.infer<typeof listarSolicitacoesSchema>;
export interface Solicitacao extends CriarSolicitacaoDto {
  id: string;
  criadoEm: string;
}
