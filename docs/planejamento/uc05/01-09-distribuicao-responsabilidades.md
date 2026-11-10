# 01-09 — Distribuição de responsabilidades

**Equipe:** Leonardo Herrero S. Martins (@leohsm) — trabalho individual.

| Issue | Atividade técnica | Responsável | Dependências de execução | Estado inicial |
| --- | --- | --- | --- | --- |
| Épico | [UC05] Enviar Solicitação de Atendimento | @leohsm | Sub-Issues | `Backlog` |
| SUB-01 | Visão pública de habilitação do especialista (C2) | @leohsm | #3 (UC02) | `Backlog` |
| SUB-02 | Solicitação e persistência em memória | @leohsm | D-UC05-03 | `Backlog` |
| SUB-03 | Porta de aviso com falha tolerada | @leohsm | — | `Backlog` |
| SUB-04 | Serviço de aplicação Enviar Solicitação | @leohsm | SUB-01, SUB-02, SUB-03, #2 | `Backlog` |
| SUB-05 | Endpoint HTTP e integração | @leohsm | SUB-04, #6, D1 | `Backlog` |
| SUB-06 | Serviço indicado (RN13) | @leohsm | SUB-05, UC03 | `Backlog` |
| SUB-07 | Documentação | @leohsm | SUB-05 | `Backlog` |

## Recomendações de alinhamento

- **Trabalho individual:** a revisão é autorrevisão em duas perspectivas — proprietário (C3) e consumidor (C2, que fornece a visão; UC06, que vai ler a Solicitação) — como definido no `trabalho5.md` §24. Uma pré-análise feita por IA deve ser registrada separadamente, sem ser apresentada como revisão independente.
- **Contrato C2 → C3 (SUB-01):** registrar a assinatura na issue antes de iniciar a SUB-04. É o ponto em que uma mudança posterior custa mais.
- **Decisões:** D1 e D-UC05-03 devem ser registradas como comentário nas issues afetadas, com data, antes de mover para `Ready`.
- **WIP:** manter o limite de 2 issues em `In Progress` definido no `planejamento-operacional.md`, somando todos os épicos.
- **Ordem com o UC02:** o UC05 não deve começar antes de #3 e #2 estarem integradas, para não criar dublês de contratos que ainda podem mudar.
