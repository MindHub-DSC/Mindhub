import { z } from 'zod';
import { idSchema, nomeSchema, textoSchema } from '../common/schemas.js';

export const modeloContratacaoSchema = z.enum([
  'RESERVA_DIRETA',
  'SOB_PROPOSTA',
]);
export const dinheiroSchema = z.strictObject({
  valorCentavos: z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER),
  moeda: z.string().regex(/^[A-Z]{3}$/),
});
export const condicoesComerciaisSchema = z.strictObject({
  preco: dinheiroSchema,
  quantidadeSessoes: z.number().int().min(1).max(100),
  duracaoMinutos: z.number().int().min(1).max(1440),
});
const camposServico = {
  especialistaId: idSchema,
  titulo: nomeSchema,
  descricao: textoSchema,
  tipo: z.enum(['MENTORIA', 'CONSULTORIA']),
};
export const criarServicoSchema = z.discriminatedUnion('modeloContratacao', [
  z.strictObject({
    ...camposServico,
    modeloContratacao: z.literal('RESERVA_DIRETA'),
    condicoesComerciais: condicoesComerciaisSchema,
  }),
  z.strictObject({
    ...camposServico,
    modeloContratacao: z.literal('SOB_PROPOSTA'),
  }),
]);
export const listarServicosSchema = z.strictObject({
  especialistaId: idSchema.optional(),
  modeloContratacao: modeloContratacaoSchema.optional(),
});
export type CriarServicoDto = z.infer<typeof criarServicoSchema>;
export type ListarServicosDto = z.infer<typeof listarServicosSchema>;
export type Servico = CriarServicoDto & { id: string; criadoEm: string };
