# 02-06 — Aplicação da Definition of Ready (DoR)

Situação em 10/11/2026, após a pré-análise e antes da revisão humana.

| Critério | Pergunta |
| --- | --- |
| DoR-01 | O objetivo está claramente definido? |
| DoR-02 | O escopo está delimitado (inclui / não inclui)? |
| DoR-03 | Os critérios de aceite são verificáveis? |
| DoR-04 | As dependências estão identificadas? |
| DoR-05 | As informações para começar estão disponíveis? |
| DoR-06 | Há responsável definido? |
| DoR-07 | A revisão humana foi realizada e registrada? |

| Issue | DoR-01 | DoR-02 | DoR-03 | DoR-04 | DoR-05 | DoR-06 | DoR-07 | Resultado | Pendências | Status recomendado |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| #2 SUB-01 | Atende | Atende | Atende | Atende | Atende | Atende | Não atende | Não pronta | Registro da revisão humana | `Backlog` |
| #3 SUB-02 | Atende | Atende | Atende | Atende | Atende | Atende | Não atende | Não pronta | Revisão humana (validar ajustes) | `Backlog` |
| #4 SUB-03 | Atende | Atende | Atende | Atende | Atende | Atende | Não atende | Não pronta | Revisão humana (validar ajuste) | `Backlog` |
| #5 SUB-04 | Atende | Atende | Atende | Atende | Atende | Atende | Não atende | Não pronta | Revisão humana (validar ajuste) | `Backlog` |
| #6 SUB-05 | Atende | Atende | Atende | Atende | **Não atende** | Atende | Não atende | Não pronta | Decisão D1; revisão humana | `Backlog` |
| #7 SUB-06 | Atende | Atende | Atende | Atende | **Não atende** | Atende | Não atende | Não pronta | Decisão D1 (via SUB-05); revisão humana | `Backlog` |
| #8 SUB-07 | Atende | Atende | Atende | Atende | Atende | Atende | Não atende | Não pronta | Registro da revisão humana | `Backlog` |

## Leitura do resultado

- Nenhuma issue foi promovida a `Ready`: o DoR-07 exige a revisão humana registrada, e ela ainda não existe.
- Quando @leohsm registrar a revisão, **#2, #3, #4, #5 e #8** podem ir para `Ready`.
- **#6 e #7** continuam em `Backlog` até a decisão D1 ser registrada na #6.
- Uma dependência ainda não implementada não impede o `Ready`, desde que o contrato necessário para começar esteja definido. Por isso a #5 pode ficar pronta antes de a #2 e a #4 estarem implementadas.
