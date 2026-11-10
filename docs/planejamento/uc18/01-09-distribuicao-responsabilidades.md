# 01-09 — Distribuição de responsabilidades

**Equipe:** Leonardo Herrero S. Martins (@leohsm) — trabalho individual.

| Issue | Atividade técnica | Responsável | Dependências de execução | Estado inicial |
| --- | --- | --- | --- | --- |
| Épico | [UC18] Suspender Perfil de Especialista | @leohsm | Sub-Issues | `Backlog` |
| SUB-01 | Implementar a transição de suspensão no Perfil de Especialista (C2) | @leohsm | UC02 | `Backlog` |
| SUB-02 | Registrar a ação administrativa em C6 (C6) | @leohsm | D-UC18-02 | `Backlog` |
| SUB-03 | Implementar o serviço de aplicação Suspender Perfil (C2) | @leohsm | SUB-01, SUB-02, D-UC18-01, D-UC18-05 | `Backlog` |
| SUB-04 | Expor o endpoint de suspensão e provar a concorrência com publicação (C2) | @leohsm | SUB-03, UC03, UC05 | `Backlog` |
| SUB-05 | Documentar o UC18 e o endpoint (C2) | @leohsm | SUB-04 | `Backlog` |

## Recomendações de alinhamento

- **Trabalho individual:** a revisão é autorrevisão em duas perspectivas, como definido no `trabalho5.md` §24. Uma pré-análise feita por IA deve ser registrada separadamente, sem ser apresentada como revisão independente.
- **Ordem sugerida:** iniciar pelas Sub-Issues sem dependências de entrada (nenhuma) depois de confirmar as marcas [PROP]; as demais seguem a [matriz de dependências](01-06-matriz-dependencias.md).
- **Decisões:** registrar cada decisão `D-UC18-XX` como comentário na issue afetada, com data, antes de movê-la para `Ready`.
- **WIP:** manter o limite de 2 issues em `In Progress`, somando todos os épicos.
