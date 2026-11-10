import type { DataSource } from 'typeorm';

/**
 * Remove SÓ os registros ligados aos usuários criados pelo teste.
 * Nunca usa TRUNCATE nem DELETE sem filtro: dados de outras execuções e de
 * outros testes ficam intactos.
 */
export async function limparDadosDosUsuarios(
  banco: DataSource,
  usuarioIds: string[],
): Promise<void> {
  if (usuarioIds.length === 0) return;
  await banco.query(
    'DELETE FROM oferta.perfis_especialista WHERE usuario_id = ANY($1::uuid[])',
    [usuarioIds],
  );
  await banco.query(
    'DELETE FROM identidade.usuarios WHERE id = ANY($1::uuid[])',
    [usuarioIds],
  );
}
