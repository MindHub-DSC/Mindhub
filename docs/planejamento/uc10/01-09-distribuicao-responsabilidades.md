# 01-09 — Distribuição de responsabilidades

**Equipe:** Leonardo Herrero S. Martins (@leohsm) — trabalho individual.

| Issue | Atividade técnica | Responsável | Dependências de execução | Estado inicial |
| --- | --- | --- | --- | --- |
| Épico | [UC10] Pagar Reserva | @leohsm | Sub-Issues | `Backlog` |
| SUB-01 | Pagamento, ciclo de vida e persistência (C5) | @leohsm | — | `Backlog` |
| SUB-02 | Porta do Provedor e adaptador simulado (C5) | @leohsm | SUB-01 | `Backlog` |
| SUB-03 | Visão da retenção e correlação (C4) | @leohsm | UC09, D-UC10-03 | `Backlog` |
| SUB-04 | Serviço Solicitar Pagamento (C5) | @leohsm | SUB-01, SUB-02, SUB-03 | `Backlog` |
| SUB-05 | Resultado do Provedor e fato (C5) | @leohsm | SUB-01, SUB-02, D-UC10-04 | `Backlog` |
| SUB-06 | Aplicar o fato na Reserva (C4) | @leohsm | SUB-03, SUB-05, UC09, D-UC10-01, D-UC10-06 | `Backlog` |
| SUB-07 | Endpoints HTTP e integração | @leohsm | SUB-02 a SUB-06, UC07-SUB-05, UC09, D1, D-UC10-02 | `Backlog` |
| SUB-08 | Documentação | @leohsm | SUB-07 | `Backlog` |

## Recomendações de alinhamento

- **Trabalho individual:** a revisão é autorrevisão em duas perspectivas, como definido no `trabalho5.md` §24. No UC10 há dois proprietários: revisar SUB-05 do ponto de vista de C4 (consumidor do fato) e SUB-06 do ponto de vista de C5 (produtor). Uma pré-análise feita por IA deve ser registrada separadamente, sem ser apresentada como revisão independente.
- **Contrato C02 (SUB-05 → SUB-06):** registrar a estrutura do fato na SUB-05 antes de iniciar a SUB-06. É a fronteira que o TC-C5-02 testa.
- **UC09 antes da SUB-03:** ao planejar o UC09, incluir no Agregado Reserva o prazo da retenção, o valor esperado (C01) e o campo de correlação do Pagamento.
- **Decisões:** D-UC10-01 é de domínio e precisa ser respondida antes da SUB-06; D-UC10-02 antes da SUB-07. Registrar como comentário nas issues afetadas, com data, antes de mover para `Ready`.
- **WIP:** manter o limite de 2 issues em `In Progress`, somando todos os épicos.
