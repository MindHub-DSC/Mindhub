# 01-09 — Distribuição de responsabilidades

**Equipe:** Leonardo Herrero S. Martins (@leohsm) — trabalho individual.

| Issue | Atividade técnica | Responsável | Dependências de execução | Estado inicial |
| --- | --- | --- | --- | --- |
| Épico | [UC04] Buscar Especialistas e Serviços | @leohsm | Sub-Issues | `Backlog` |
| SUB-01 | Definir o modelo de leitura público da oferta (C2) | @leohsm | D-UC04-05 | `Backlog` |
| SUB-02 | Implementar a seleção de especialistas habilitados e Serviços publicados (C2) | @leohsm | SUB-01, UC03, D-UC04-01, D-UC04-02 | `Backlog` |
| SUB-03 | Implementar a consulta da oferta no armazenamento (C2) | @leohsm | SUB-01, UC03, D-UC04-03 | `Backlog` |
| SUB-04 | Expor o endpoint de busca e traduzir os erros (C2) | @leohsm | SUB-02, SUB-03, D-UC04-04 | `Backlog` |
| SUB-05 | Documentar o UC04 e o endpoint (C2) | @leohsm | SUB-04 | `Backlog` |

## Recomendações de alinhamento

- **Trabalho individual:** a revisão é autorrevisão em duas perspectivas, como definido no `trabalho5.md` §24. Uma pré-análise feita por IA deve ser registrada separadamente, sem ser apresentada como revisão independente.
- **Ordem sugerida:** iniciar pelas Sub-Issues sem dependências de entrada (nenhuma) depois de confirmar as marcas [PROP]; as demais seguem a [matriz de dependências](01-06-matriz-dependencias.md).
- **Decisões:** registrar cada decisão `D-UC04-XX` como comentário na issue afetada, com data, antes de movê-la para `Ready`.
- **WIP:** manter o limite de 2 issues em `In Progress`, somando todos os épicos.
