import { existsSync, readFileSync } from 'node:fs';
import { parseEnv } from 'node:util';
import { z } from 'zod';

/**
 * Lê o arquivo .env da pasta atual, sem sobrescrever variáveis já definidas
 * no ambiente. Assim, o terminal (ou o setup dos testes) tem prioridade.
 */
export function carregarArquivoEnv(caminho = '.env'): void {
  if (!existsSync(caminho)) return;
  const valores = parseEnv(readFileSync(caminho, 'utf8'));
  for (const [chave, valor] of Object.entries(valores)) {
    process.env[chave] ??= valor;
  }
}

const ambienteDoBancoSchema = z.object({
  DB_HOST: z.string().min(1),
  DB_PORT: z.coerce.number().int().positive(),
  DB_USER: z.string().min(1),
  DB_PASSWORD: z.string().min(1),
  DB_NAME: z.string().min(1),
});

export type AmbienteDoBanco = z.infer<typeof ambienteDoBancoSchema>;

/** Variáveis de conexão validadas. A mensagem de erro cita nomes, nunca valores. */
export function lerAmbienteDoBanco(): AmbienteDoBanco {
  carregarArquivoEnv();
  const resultado = ambienteDoBancoSchema.safeParse(process.env);
  if (!resultado.success) {
    const faltando = resultado.error.issues.map((i) => i.path.join('.'));
    throw new Error(
      `Configuração do banco inválida ou ausente: ${faltando.join(', ')}. ` +
        'Copie .env.example para .env.',
    );
  }
  return resultado.data;
}
