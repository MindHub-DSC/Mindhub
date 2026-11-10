# 01-12 — Relatório de consistência e cobertura

**Caso de uso:** UC19 — Reativar Perfil de Especialista

## Quantidades

- **Issue principal:** 1 (`[UC19] Reativar Perfil de Especialista`).
- **Sub-Issues:** 5 (SUB-01 a SUB-05): 4 em C2, 1 em C6.
- **Labels novas:** `usecase:uc19`.

## Cobertura

| Elemento da especificação | Total | Cobertos | Parcial | Sem cobertura |
| --- | --- | --- | --- | --- |
| Pré-condições | 1 | 1 | 0 | 0 |
| Pós-condições | 3 | 3 | 0 | 0 |
| Passos do fluxo principal | 5 | 5 | 0 | 0 |
| Fluxos de exceção | 3 | 3 | 0 | 0 |
| Regras de negócio | 2 | 2 | 0 | 0 |

Não há cobertura parcial: todos os itens documentados têm Sub-Issue e critério de aceite.

## Dependências críticas

1. **UC18.** Entrega o registro, a verificação do Administrador e a situação `SUSPENSO`; este caso de uso não pode iniciar antes.
2. **Registro administrativo compartilhado.** Mudança de formato afeta UC18, UC19 e UC21.

## Decisões que dependem de validação

| ID | Decisão | Natureza | Quem decide | Quando |
| --- | --- | --- | --- | --- |
| D-UC19-01 | Há limite de suspensões e reativações ou prazo mínimo de suspensão? Não documentado; nenhuma regra é criada. | Dúvida documentada | @leohsm (domínio) | Antes de uso real |
| D-UC19-02 | Reativação exige justificativa e registra autor e instante, como a suspensão (proposta derivada de RN15). | Proposta técnica | @leohsm | Antes da SUB-01 |
| D-UC19-03 | O aviso ao especialista usa a mesma porta do UC18; falha não invalida a reativação. | Proposta técnica | @leohsm | Antes da SUB-02 |

## Riscos e recomendações

| Risco | Impacto | Recomendação |
| --- | --- | --- |
| Planejar a reativação antes do registro existir | Retrabalho no modelo de ação administrativa | Planejar e implementar o UC18 primeiro |
| Reativação sem prazo mínimo | Abuso do ciclo suspende-reativa | Manter como dúvida D-UC19-01; não criar regra sem decisão do domínio |

**Recomendação para o início:** aguardar a SUB-02 do UC18 (registro administrativo) e implementar o UC19 logo em seguida, no mesmo ciclo, como sugere o `trabalho5.md` §9.3.
