import { z } from 'zod';

export const criarUsuarioSchema = z.strictObject({
  nome: z.string().trim().min(1).max(120),
  email: z.string().trim().toLowerCase().max(254).pipe(z.email()),
});

export type CriarUsuarioDto = z.infer<typeof criarUsuarioSchema>;
