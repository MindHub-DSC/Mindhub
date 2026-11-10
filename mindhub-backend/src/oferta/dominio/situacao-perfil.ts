/** Situação que define o que o perfil pode fazer (RN01). */
export const SituacaoPerfil = {
  ATIVO: 'ATIVO',
  SUSPENSO: 'SUSPENSO',
} as const;

export type SituacaoPerfil =
  (typeof SituacaoPerfil)[keyof typeof SituacaoPerfil];

export function ehSituacaoPerfil(valor: unknown): valor is SituacaoPerfil {
  return Object.values<unknown>(SituacaoPerfil).includes(valor);
}
