# 01-09 — Distribuição de responsabilidades

**Equipe:** Leonardo Herrero S. Martins (@leohsm) — trabalho individual.

| Issue | Atividade técnica | Responsável | Dependências de execução | Estado inicial |
| --- | --- | --- | --- | --- |
| Épico | [UC09] Agendar Sessão Contratada | @leohsm | Sub-Issues | `Backlog` |
| SUB-01 | Modelar a Reserva, o Intervalo de Tempo e o ciclo da retenção (C4) | @leohsm | D-UC09-04, D-UC09-06 | `Backlog` |
| SUB-02 | Registrar a retenção de forma atômica e idempotente no repositório (C4) | @leohsm | SUB-01, D-UC09-02, D-UC09-05, D-UC09-08 | `Backlog` |
| SUB-03 | Implementar o contrato C01 (porta pública de retenção de horário) (C4) | @leohsm | SUB-01, SUB-02, D-UC09-01, D-UC09-04 | `Backlog` |
| SUB-04 | Implementar o serviço de C3 Agendar Sessão Contratada (C3) | @leohsm | SUB-03, UC07 | `Backlog` |
| SUB-05 | Liberar a retenção expirada por tempo (C4) | @leohsm | SUB-01, SUB-02, D-UC09-07 | `Backlog` |
| SUB-06 | Expor o endpoint de agendamento e verificar a concorrência de ponta a ponta (C3) | @leohsm | SUB-04, SUB-05, D-UC09-09, D-UC09-10 | `Backlog` |
| SUB-07 | Documentar o UC09 e o endpoint (C4) | @leohsm | SUB-06 | `Backlog` |

## Recomendações de alinhamento

- **Trabalho individual:** a revisão é autorrevisão em duas perspectivas, como definido no `trabalho5.md` §24. Uma pré-análise feita por IA deve ser registrada separadamente, sem ser apresentada como revisão independente.
- **Ordem sugerida:** iniciar pelas Sub-Issues sem dependências de entrada (nenhuma) depois de confirmar as marcas [PROP]; as demais seguem a [matriz de dependências](01-06-matriz-dependencias.md).
- **Decisões:** registrar cada decisão `D-UC09-XX` como comentário na issue afetada, com data, antes de movê-la para `Ready`.
- **WIP:** manter o limite de 2 issues em `In Progress`, somando todos os épicos.
