# 01-09 — Distribuição de responsabilidades

**Equipe:** Leonardo Herrero S. Martins (@leohsm) — trabalho individual.

| Issue | Atividade técnica | Responsável | Dependências de execução | Estado inicial |
| --- | --- | --- | --- | --- |
| Épico | [UC08] Contratar Serviço de Reserva Direta | @leohsm | Sub-Issues | `Backlog` |
| SUB-01 | Expor a visão pública do Serviço e suas condições vigentes (C2) | @leohsm | UC03 | `Backlog` |
| SUB-02 | Estender a Contratação com origem Reserva Direta e snapshot das condições (C3) | @leohsm | UC07 | `Backlog` |
| SUB-03 | Implementar o serviço de aplicação Contratar Reserva Direta (C3) | @leohsm | SUB-01, SUB-02, UC09, D-UC08-06, D-UC08-07 | `Backlog` |
| SUB-04 | Expor o endpoint de contratação e verificar a jornada de ponta a ponta (C3) | @leohsm | SUB-03, UC09, D-UC08-08, D-UC08-09 | `Backlog` |
| SUB-05 | Documentar o UC08 e o endpoint (C3) | @leohsm | SUB-04 | `Backlog` |

## Recomendações de alinhamento

- **Trabalho individual:** a revisão é autorrevisão em duas perspectivas, como definido no `trabalho5.md` §24. Uma pré-análise feita por IA deve ser registrada separadamente, sem ser apresentada como revisão independente.
- **Ordem sugerida:** iniciar pelas Sub-Issues sem dependências de entrada (nenhuma) depois de confirmar as marcas [PROP]; as demais seguem a [matriz de dependências](01-06-matriz-dependencias.md).
- **Decisões:** registrar cada decisão `D-UC08-XX` como comentário na issue afetada, com data, antes de movê-la para `Ready`.
- **WIP:** manter o limite de 2 issues em `In Progress`, somando todos os épicos.
