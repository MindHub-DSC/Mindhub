# 01-09 — Distribuição de responsabilidades

**Equipe:** Leonardo Herrero S. Martins (@leohsm) — trabalho individual.

| Issue | Atividade técnica | Responsável | Dependências de execução | Estado inicial |
| --- | --- | --- | --- | --- |
| Épico | [UC06] Enviar Proposta | @leohsm | Sub-Issues | `Backlog` |
| SUB-01 | Modelar as Condições Comerciais (C3) | @leohsm | D-UC06-02 | `Backlog` |
| SUB-02 | Modelar a Proposta, suas Versões e o repositório em memória (C3) | @leohsm | SUB-01, D-UC06-01, D-UC06-03, D-UC06-04 | `Backlog` |
| SUB-03 | Expor a Solicitação recebida ao Especialista destinatário (C3) | @leohsm | UC05 | `Backlog` |
| SUB-04 | Implementar os serviços de aplicação Enviar Proposta e Enviar Nova Versão (C3) | @leohsm | SUB-02, SUB-03, UC05 | `Backlog` |
| SUB-05 | Expor os endpoints de Proposta e verificar o envio de ponta a ponta (C3) | @leohsm | SUB-04, D-UC06-08, D-UC06-09 | `Backlog` |
| SUB-06 | Documentar o UC06 e os endpoints (C3) | @leohsm | SUB-05 | `Backlog` |

## Recomendações de alinhamento

- **Trabalho individual:** a revisão é autorrevisão em duas perspectivas, como definido no `trabalho5.md` §24. Uma pré-análise feita por IA deve ser registrada separadamente, sem ser apresentada como revisão independente.
- **Ordem sugerida:** iniciar pelas Sub-Issues sem dependências de entrada (nenhuma) depois de confirmar as marcas [PROP]; as demais seguem a [matriz de dependências](01-06-matriz-dependencias.md).
- **Decisões:** registrar cada decisão `D-UC06-XX` como comentário na issue afetada, com data, antes de movê-la para `Ready`.
- **WIP:** manter o limite de 2 issues em `In Progress`, somando todos os épicos.
