# 02-04 — Relatório de revisão das Issues

> **Pré-análise automatizada ≠ revisão humana.** Este relatório foi produzido por um assistente de IA em 10/11/2026. Ele não substitui a revisão do integrante designado (@leohsm). A revisão humana só conta como concluída quando registrada na issue com o template do [02-05](02-05-comentarios-github.md).

Elementos avaliados: (1) título; (2) objetivo e coerência com o UC02; (3) descrição e escopo; (4) critérios de aceite; (5) dependências e regras; (6) labels; (7) suficiência para iniciar.

Responsável e revisor de todas as issues: @leohsm (autorrevisão, trabalho individual).

| Issue | Elemento | Resultado | Apontamento | Recomendação | Situação |
| --- | --- | --- | --- | --- | --- |
| #2 SUB-01 | 1, 2, 3, 5, 6 | Conforme | Título, objetivo e escopo coerentes com RN-UC02-04 e ADR-04; labels corretas | — | Pré-análise concluída; aguardando revisão humana |
| #2 SUB-01 | 4 — critérios | Conforme | Critérios verificáveis por teste e por inspeção de tipos | — | Idem |
| #2 SUB-01 | 7 — suficiência | Conforme com ressalva | A assinatura `reconhecer(usuarioId): Promise<boolean>` é proposta | Registrar a assinatura acordada em comentário antes de puxar a SUB-04 | Idem |
| #3 SUB-02 | 1, 2, 5, 6 | Conforme | D2 e D3 decididas pelo estudante em 10/11/2026 | — | Idem |
| #3 SUB-02 | 3 — escopo | Ajuste necessário → **aplicado** | Não estava claro se o domínio ou o schema HTTP validava cada regra | Incluída a divisão: domínio protege invariantes; schema cuida do formato e de campos extras | Ajuste aplicado na descrição; validar na revisão humana |
| #3 SUB-02 | 4 — critérios | Ajuste necessário → **aplicado** | Comparação de repetidas sem regra de normalização; teste de `id` e `criadoEm` dependia de valores não determinísticos | Comparar após `trim` e minúsculas; testar presença e formato | Idem |
| #3 SUB-02 | 7 — suficiência | Conforme | — | — | Aguardando revisão humana |
| #4 SUB-03 | 1, 2, 5, 6 | Conforme | Risco de unicidade explícito e coberto | — | Idem |
| #4 SUB-03 | 3 — escopo | Ajuste necessário → **aplicado** | O erro de unicidade não tinha o mesmo nome do erro usado pela SUB-04 | Erro de domínio único `PerfilJaExistente`, definido aqui; nota sobre unicidade atômica em adaptadores futuros | Ajuste aplicado; validar na revisão humana |
| #4 SUB-03 | 4 — critérios | Conforme | Critério "sem `await` entre verificação e inserção" é verificável por inspeção de código | Anexar o trecho no PR como evidência | Idem |
| #5 SUB-04 | 1, 2, 3, 6 | Conforme | — | — | Idem |
| #5 SUB-04 | 4 — critérios | Ajuste necessário → **aplicado** | Não havia critério para dados recusados pelo domínio | Novo critério: violação de invariante é propagada sem acionar o armazenamento | Ajuste aplicado; validar na revisão humana |
| #5 SUB-04 | 5 — dependências | Conforme com ressalva | A dependência da SUB-02 é de **implementação** (o serviço usa a criação real do perfil), não apenas de contrato | Considerar na ordem de execução | Idem |
| #6 SUB-05 | 1, 2, 3, 4, 6 | Conforme | Mapeamento 201/400/404/409 completo | — | Idem |
| #6 SUB-05 | 5 e 7 — dependências e suficiência | **Não conforme** | A decisão D1 (origem de `usuarioId`) está pendente; o contrato HTTP não pode ser fechado | Registrar a decisão D1 na issue antes de movê-la para `Ready` | Bloqueada por decisão |
| #7 SUB-06 | 1, 2, 3, 6 | Conforme | — | — | Aguardando revisão humana |
| #7 SUB-06 | 4 — critérios | Ajuste necessário → **aplicado** | "Sem criar outro usuário" não era verificável por HTTP, porque não existe consulta de usuários | Critério reescrito: `usuarioId` do perfil igual ao `id` retornado por `POST /usuarios` | Ajuste aplicado |
| #7 SUB-06 | 7 — suficiência | **Não conforme** | Depende do contrato HTTP da SUB-05, ainda aberto por D1 | Aguardar D1 | Bloqueada por decisão |
| #8 SUB-07 | 1 a 6 | Conforme | — | — | Aguardando revisão humana |
| #8 SUB-07 | 7 — suficiência | Conforme com ressalva | A seção da API só pode ser finalizada após a SUB-05 e a verificação dos exemplos após a SUB-06 | Começar pela descrição do caso de uso e das regras | Idem |

## Síntese

- **Issues com ajustes aplicados na descrição:** 4 (#3, #4, #5, #7).
- **Issues bloqueadas por decisão pendente:** 2 (#6, #7), ambas por D1.
- **Issues que dependem apenas da revisão humana para o `Ready`:** 5 (#2, #3, #4, #5, #8).
