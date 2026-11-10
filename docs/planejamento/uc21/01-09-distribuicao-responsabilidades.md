# 01-09 — Distribuição de responsabilidades

**Equipe:** Leonardo Herrero S. Martins (@leohsm) — trabalho individual.

| Issue | Atividade técnica | Responsável | Dependências de execução | Estado inicial |
| --- | --- | --- | --- | --- |
| Épico | [UC21] Decidir Disputa | @leohsm | Sub-Issues | `Backlog` |
| SUB-01 | Estender a Disputa com o ciclo de decisão (C6) | @leohsm | UC20, D-UC21-01 | `Backlog` |
| SUB-02 | Registrar as ações decorrentes separadamente da decisão (C6) | @leohsm | SUB-01 | `Backlog` |
| SUB-03 | Definir as portas de comandos dos contextos e o adaptador da suspensão (C6) | @leohsm | UC18, D-UC21-02 | `Backlog` |
| SUB-04 | Implementar o serviço de aplicação Decidir Disputa (C6) | @leohsm | SUB-01, SUB-02, SUB-03, D-UC21-04, D-UC21-05 | `Backlog` |
| SUB-05 | Expor os endpoints de decisão e verificar a jornada (C6) | @leohsm | SUB-04, D-UC21-06 | `Backlog` |
| SUB-06 | Documentar o UC21 e o endpoint (C6) | @leohsm | SUB-05 | `Backlog` |

## Recomendações de alinhamento

- **Trabalho individual:** a revisão é autorrevisão em duas perspectivas, como definido no `trabalho5.md` §24. Uma pré-análise feita por IA deve ser registrada separadamente, sem ser apresentada como revisão independente.
- **Ordem sugerida:** iniciar pelas Sub-Issues sem dependências de entrada (nenhuma) depois de confirmar as marcas [PROP]; as demais seguem a [matriz de dependências](01-06-matriz-dependencias.md).
- **Decisões:** registrar cada decisão `D-UC21-XX` como comentário na issue afetada, com data, antes de movê-la para `Ready`.
- **WIP:** manter o limite de 2 issues em `In Progress`, somando todos os épicos.
