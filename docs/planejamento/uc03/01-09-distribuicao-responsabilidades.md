# 01-09 — Distribuição de responsabilidades

**Equipe:** Leonardo Herrero S. Martins (@leohsm) — trabalho individual.

| Issue | Atividade técnica | Responsável | Dependências de execução | Estado inicial |
| --- | --- | --- | --- | --- |
| Épico | [UC03] Publicar Serviço | @leohsm | Sub-Issues | `Backlog` |
| SUB-01 | Modelar o Serviço e suas condições vigentes (C2) | @leohsm | D-UC03-01, D-UC03-02 | `Backlog` |
| SUB-02 | Persistir o Serviço com TypeORM e migration (C2) | @leohsm | SUB-01 | `Backlog` |
| SUB-03 | Implementar o serviço de aplicação Publicar Serviço (C2) | @leohsm | SUB-01, UC02 | `Backlog` |
| SUB-04 | Proteger a publicação contra suspensão concorrente (C2) | @leohsm | SUB-02, SUB-03, D-UC03-06 | `Backlog` |
| SUB-05 | Expor o endpoint de publicação de Serviço e traduzir os erros (C2) | @leohsm | SUB-03, SUB-04, D-UC03-05, D-UC03-07 | `Backlog` |
| SUB-06 | Documentar o UC03 e o endpoint (C2) | @leohsm | SUB-05 | `Backlog` |

## Recomendações de alinhamento

- **Trabalho individual:** a revisão é autorrevisão em duas perspectivas, como definido no `trabalho5.md` §24. Uma pré-análise feita por IA deve ser registrada separadamente, sem ser apresentada como revisão independente.
- **Ordem sugerida:** iniciar pelas Sub-Issues sem dependências de entrada (nenhuma) depois de confirmar as marcas [PROP]; as demais seguem a [matriz de dependências](01-06-matriz-dependencias.md).
- **Decisões:** registrar cada decisão `D-UC03-XX` como comentário na issue afetada, com data, antes de movê-la para `Ready`.
- **WIP:** manter o limite de 2 issues em `In Progress`, somando todos os épicos.
