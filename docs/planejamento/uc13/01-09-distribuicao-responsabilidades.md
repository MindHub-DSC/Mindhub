# 01-09 — Distribuição de responsabilidades

**Equipe:** Leonardo Herrero S. Martins (@leohsm) — trabalho individual.

| Issue | Atividade técnica | Responsável | Dependências de execução | Estado inicial |
| --- | --- | --- | --- | --- |
| Épico | [UC13] Realizar Sessão | @leohsm | Sub-Issues | `Backlog` |
| SUB-01 | Modelar a Sessão, a Participação e o ciclo de vida (C4) | @leohsm | D-UC13-06 | `Backlog` |
| SUB-02 | Criar a Sessão `Programada` a partir da Reserva confirmada (C4) | @leohsm | SUB-01, UC10, D-UC13-02 | `Backlog` |
| SUB-03 | Definir a porta do Serviço de videoconferência e o adaptador simulado (C4) | @leohsm | D-UC13-05 | `Backlog` |
| SUB-04 | Implementar o serviço de aplicação Iniciar e Concluir Sessão (C4) | @leohsm | SUB-01, SUB-03, D-UC13-01 | `Backlog` |
| SUB-05 | Expor os endpoints de início e conclusão e verificar a jornada (C4) | @leohsm | SUB-02, SUB-04, D-UC13-07, D-UC13-08 | `Backlog` |
| SUB-06 | Documentar o UC13 e o endpoint (C4) | @leohsm | SUB-05 | `Backlog` |

## Recomendações de alinhamento

- **Trabalho individual:** a revisão é autorrevisão em duas perspectivas, como definido no `trabalho5.md` §24. Uma pré-análise feita por IA deve ser registrada separadamente, sem ser apresentada como revisão independente.
- **Ordem sugerida:** iniciar pelas Sub-Issues sem dependências de entrada (nenhuma) depois de confirmar as marcas [PROP]; as demais seguem a [matriz de dependências](01-06-matriz-dependencias.md).
- **Decisões:** registrar cada decisão `D-UC13-XX` como comentário na issue afetada, com data, antes de movê-la para `Ready`.
- **WIP:** manter o limite de 2 issues em `In Progress`, somando todos os épicos.
