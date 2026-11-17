# 01-09 — Distribuição de responsabilidades

**Equipe:** Leonardo Herrero S. Martins (@leohsm) — trabalho individual.

| Issue | Atividade técnica | Responsável | Dependências de execução | Estado inicial |
| --- | --- | --- | --- | --- |
| Épico | [UC19] Reativar Perfil de Especialista | @leohsm | Sub-Issues | `Backlog` |
| SUB-01 | Implementar a transição de reativação no Perfil de Especialista (C2) | @leohsm | UC18, D-UC19-02 | `Backlog` |
| SUB-02 | Implementar o serviço de aplicação Reativar Perfil e o registro da ação (C2) | @leohsm | SUB-01, UC18, D-UC19-03 | `Backlog` |
| SUB-03 | Expor o endpoint de reativação e provar o efeito de RN01 (C2) | @leohsm | SUB-02, UC03 | `Backlog` |
| SUB-04 | Garantir a rastreabilidade do ciclo suspensão-reativação (C6) | @leohsm | UC18, SUB-02 | `Backlog` |
| SUB-05 | Documentar o UC19 e o endpoint (C2) | @leohsm | SUB-03, SUB-04 | `Backlog` |

## Recomendações de alinhamento

- **Trabalho individual:** a revisão é autorrevisão em duas perspectivas, como definido no `trabalho5.md` §24. Uma pré-análise feita por IA deve ser registrada separadamente, sem ser apresentada como revisão independente.
- **Ordem sugerida:** iniciar pelas Sub-Issues sem dependências de entrada (nenhuma) depois de confirmar as marcas [PROP]; as demais seguem a [matriz de dependências](01-06-matriz-dependencias.md).
- **Decisões:** registrar cada decisão `D-UC19-XX` como comentário na issue afetada, com data, antes de movê-la para `Ready`.
- **WIP:** manter o limite de 2 issues em `In Progress`, somando todos os épicos.
