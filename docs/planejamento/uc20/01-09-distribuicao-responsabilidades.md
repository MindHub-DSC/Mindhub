# 01-09 — Distribuição de responsabilidades

**Equipe:** Leonardo Herrero S. Martins (@leohsm) — trabalho individual.

| Issue | Atividade técnica | Responsável | Dependências de execução | Estado inicial |
| --- | --- | --- | --- | --- |
| Épico | [UC20] Abrir Disputa | @leohsm | Sub-Issues | `Backlog` |
| SUB-01 | Modelar a Disputa e seu ciclo provisório (C6) | @leohsm | D-UC20-03, D-UC20-04, D-UC20-05 | `Backlog` |
| SUB-02 | Definir as portas de verificação das partes e do pertencimento (C6) | @leohsm | UC07, UC13, UC10, UC15 | `Backlog` |
| SUB-03 | Implementar o serviço de aplicação Abrir Disputa (C6) | @leohsm | SUB-01, SUB-02, D-UC20-06 | `Backlog` |
| SUB-04 | Expor o endpoint de abertura de Disputa e verificar a jornada (C6) | @leohsm | SUB-03, D-UC20-07, D-UC20-08 | `Backlog` |
| SUB-05 | Documentar o UC20 e o endpoint (C6) | @leohsm | SUB-04 | `Backlog` |

## Recomendações de alinhamento

- **Trabalho individual:** a revisão é autorrevisão em duas perspectivas, como definido no `trabalho5.md` §24. Uma pré-análise feita por IA deve ser registrada separadamente, sem ser apresentada como revisão independente.
- **Ordem sugerida:** iniciar pelas Sub-Issues sem dependências de entrada (nenhuma) depois de confirmar as marcas [PROP]; as demais seguem a [matriz de dependências](01-06-matriz-dependencias.md).
- **Decisões:** registrar cada decisão `D-UC20-XX` como comentário na issue afetada, com data, antes de movê-la para `Ready`.
- **WIP:** manter o limite de 2 issues em `In Progress`, somando todos os épicos.
