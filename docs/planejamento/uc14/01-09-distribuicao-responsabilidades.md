# 01-09 — Distribuição de responsabilidades

**Equipe:** Leonardo Herrero S. Martins (@leohsm) — trabalho individual.

| Issue | Atividade técnica | Responsável | Dependências de execução | Estado inicial |
| --- | --- | --- | --- | --- |
| Épico | [UC14] Avaliar Sessão | @leohsm | Sub-Issues | `Backlog` |
| SUB-01 | Modelar a Avaliação (C4) | @leohsm | D-UC14-01 | `Backlog` |
| SUB-02 | Garantir a unicidade da Avaliação por Sessão no repositório (C4) | @leohsm | SUB-01 | `Backlog` |
| SUB-03 | Implementar o serviço de aplicação Avaliar Sessão (C4) | @leohsm | SUB-01, SUB-02, UC13 | `Backlog` |
| SUB-04 | Expor o endpoint de avaliação e verificar a concorrência (C4) | @leohsm | SUB-03, D-UC14-05, D-UC14-06 | `Backlog` |
| SUB-05 | Documentar o UC14 e o endpoint (C4) | @leohsm | SUB-04 | `Backlog` |

## Recomendações de alinhamento

- **Trabalho individual:** a revisão é autorrevisão em duas perspectivas, como definido no `trabalho5.md` §24. Uma pré-análise feita por IA deve ser registrada separadamente, sem ser apresentada como revisão independente.
- **Ordem sugerida:** iniciar pelas Sub-Issues sem dependências de entrada (nenhuma) depois de confirmar as marcas [PROP]; as demais seguem a [matriz de dependências](01-06-matriz-dependencias.md).
- **Decisões:** registrar cada decisão `D-UC14-XX` como comentário na issue afetada, com data, antes de movê-la para `Ready`.
- **WIP:** manter o limite de 2 issues em `In Progress`, somando todos os épicos.
