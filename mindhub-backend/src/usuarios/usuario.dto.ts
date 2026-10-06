import { z } from 'zod';
import { nomeSchema } from '../common/schemas.js';

export const criarUsuarioSchema = z.strictObject({
  nome: nomeSchema,
  email: z.string().trim().toLowerCase().max(254).pipe(z.email()),
});
export type CriarUsuarioDto = z.infer<typeof criarUsuarioSchema>;
export interface Usuario extends CriarUsuarioDto {
  id: string;
  situacao: 'ATIVO';
  criadoEm: string;
}
