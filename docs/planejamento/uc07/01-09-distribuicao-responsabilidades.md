# 01-09 — Distribuição de responsabilidades

**Equipe:** Leonardo Herrero S. Martins (@leohsm) — trabalho individual.

| Issue | Atividade técnica | Responsável | Dependências de execução | Estado inicial |
| --- | --- | --- | --- | --- |
| Épico | [UC07] Aceitar Proposta | @leohsm | Sub-Issues | `Backlog` |
| SUB-01 | Aceite no Agregado Proposta | @leohsm | UC06, D-UC07-03, D-UC07-04 | `Backlog` |
| SUB-02 | Contratação Sob Proposta com snapshot | @leohsm | UC06 | `Backlog` |
| SUB-03 | Gravação atômica de aceite e Contratação | @leohsm | SUB-01, SUB-02 | `Backlog` |
| SUB-04 | Serviço de aplicação Aceitar Proposta | @leohsm | SUB-01, SUB-02, SUB-03, UC05-SUB-02, UC05-SUB-03 | `Backlog` |
| SUB-05 | Endpoints HTTP e integração | @leohsm | SUB-04, UC05-SUB-05, UC06, D1 | `Backlog` |
| SUB-06 | Documentação | @leohsm | SUB-05 | `Backlog` |

## Recomendações de alinhamento

- **Trabalho individual:** a revisão é autorrevisão em duas perspectivas — proprietário (C3) e consumidor (UC09, que vai ler a Contratação para reter horário) — como definido no `trabalho5.md` §24. Uma pré-análise feita por IA deve ser registrada separadamente, sem ser apresentada como revisão independente.
- **UC06 antes do UC07:** especificar e planejar o UC06 antes de mover qualquer issue deste épico para `Ready`. Ao planejar o UC06, levar o requisito da SUB-03: a operação de nova versão precisa respeitar o mesmo controle de concorrência do aceite.
- **Contrato da Contratação:** a estrutura da Contratação (SUB-02) será consumida pelo UC09 e pelo UC10 (valor esperado). Registrar na issue os campos expostos antes de iniciar a SUB-04.
- **Decisões:** D1, D-UC07-03, D-UC07-04 e D-UC07-05 devem ser registradas como comentário nas issues afetadas, com data, antes de mover para `Ready`.
- **WIP:** manter o limite de 2 issues em `In Progress`, somando todos os épicos.
