# 01-09 — Distribuição de responsabilidades

**Equipe:** Leonardo Herrero S. Martins (@leohsm) — trabalho individual.

| Issue | Atividade técnica | Responsável | Dependências de execução | Estado inicial |
| --- | --- | --- | --- | --- |
| Épico | [UC11] Reagendar Sessão | @leohsm | Sub-Issues | `Backlog` |
| SUB-01 | Implementar a operação de reagendamento na Reserva (C4) | @leohsm | UC09, UC10 | `Backlog` |
| SUB-02 | Trocar o intervalo de forma atômica no repositório (C4) | @leohsm | SUB-01, UC09 | `Backlog` |
| SUB-03 | Implementar o serviço de aplicação Reagendar Sessão (C4) | @leohsm | SUB-02, D-UC11-03, D-UC11-04, D-UC11-05 | `Backlog` |
| SUB-04 | Expor o endpoint de reagendamento e verificar a concorrência (C4) | @leohsm | SUB-03, D-UC11-06, D-UC11-07 | `Backlog` |
| SUB-05 | Documentar o UC11 e o endpoint (C4) | @leohsm | SUB-04 | `Backlog` |

## Recomendações de alinhamento

- **Trabalho individual:** a revisão é autorrevisão em duas perspectivas, como definido no `trabalho5.md` §24. Uma pré-análise feita por IA deve ser registrada separadamente, sem ser apresentada como revisão independente.
- **Ordem sugerida:** iniciar pelas Sub-Issues sem dependências de entrada (nenhuma) depois de confirmar as marcas [PROP]; as demais seguem a [matriz de dependências](01-06-matriz-dependencias.md).
- **Decisões:** registrar cada decisão `D-UC11-XX` como comentário na issue afetada, com data, antes de movê-la para `Ready`.
- **WIP:** manter o limite de 2 issues em `In Progress`, somando todos os épicos.
