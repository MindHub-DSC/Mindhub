# 05-02 — Escopo, issues e branches

**Caso de uso:** UC03 — Publicar Serviço (épico [#35](https://github.com/MindHub-DSC/Mindhub/issues/35))
**Sub-Issue:** [#36](https://github.com/MindHub-DSC/Mindhub/issues/36) — [UC03-SUB-01] [C2] Modelar o Serviço e suas condições vigentes
**Data:** 12/11/2026

## Cenário adotado: A — uma única issue para teste e implementação

| Pergunta | Resposta | Fonte |
| --- | --- | --- |
| A issue do teste é a mesma da implementação? | **Sim.** O escopo da #36 inclui agregado, objeto de valor, erros, porta, adaptador em memória **e** testes | `04-01` (DoR-02) |
| Há outra Sub-Issue de implementação para o domínio do Serviço? | Não. As #37 (persistência) e #40 (API) consomem o domínio entregue pela #36 | `04-04`, `01-04` |
| A equipe já tinha decidido onde seria o GREEN? | Sim: "na mesma branch e no mesmo PR" | `04-08`, próxima ação 1 |

Como a #36 contempla o ciclo TDD inteiro, o GREEN continua na branch e no Draft PR do Material 04.

## Responsáveis e papéis

| Papel | Pessoa | Observação |
| --- | --- | --- |
| Responsável pela #36 (implementação) | @leohsm | Assignee confirmado no GitHub em 12/11/2026 |
| Revisor | @leohsm (autorrevisão) | Equipe de um integrante; limitação registrada no `04-08` |

## Definition of Ready da implementação

A issue de implementação é a própria #36, já avaliada no `04-01` (7 de 7 critérios em **Atende**). Reavaliação para a fase GREEN:

| Código | Situação em 12/11/2026 |
| --- | --- |
| DoR-01 Objetivo | Inalterado: modelar o Serviço como Agregado de C2 |
| DoR-02 Escopo | Inalterado. O GREEN cobre só o critério 1; persistência, RN01 e editar/despublicar continuam fora |
| DoR-03 Critérios verificáveis | O critério 1 é verificado pelas 5 asserções do teste RED |
| DoR-04 Dependências | Nenhuma dependência de entrada para o critério 1 |
| DoR-05 Informações técnicas | D-UC03-01 a 03 respondidas. O padrão do `PerfilEspecialista` serve de referência |
| DoR-06 Responsável | @leohsm |
| DoR-07 Revisão de planejamento | Autorrevisão registrada na #36 |

**Pronta para a implementação.**

## Estratégia de branch

| Item | Valor |
| --- | --- |
| Branch de trabalho | `feature/36-uc03-modelar-servico` (a mesma do RED) |
| Origem | `main` @ `cbf21f5` (criada no `04-03`) |
| Destino final | `main`, só por PR (a `main` é protegida) |
| Nova branch? | **Não**: o teste RED já está nesta branch |

Confirmação:

```text
$ git branch --show-current
feature/36-uc03-modelar-servico

$ git status -sb
## feature/36-uc03-modelar-servico...origin/feature/36-uc03-modelar-servico
?? docs/planejamento/
?? docs/prompts/
```

## Estratégia de Pull Request

- O commit GREEN será enviado com `git push` para a mesma branch e aparece no Draft PR [#131](https://github.com/MindHub-DSC/Mindhub/pull/131) sem precisar de outro PR.
- A descrição do #131 será atualizada: a caixa da fase GREEN fica marcada e a evidência do GREEN é anexada.
- O PR **continua em Draft**. Ainda faltam os critérios 2 a 6 da #36 e a fase REFACTOR, então não há motivo para pedir revisão final agora.
- Nenhum merge e nenhum novo PR.

## Riscos e plano de integração

| Risco | Mitigação |
| --- | --- |
| O PR sair de Draft sem querer (já aconteceu no `04-08`) | Conferir `isDraft` com `gh pr view 131` depois de atualizar a descrição |
| A `main` avançar enquanto a branch está aberta | Antes do merge final (depois do REFACTOR), atualizar a branch com `git merge origin/main` e rodar a suíte. Hoje `main` = `cbf21f5`, a base da branch |
| Os artefatos `05-*` entrarem no commit de código | `git add` por caminho, só com os arquivos de `mindhub-backend/`. Os artefatos vão para a branch `docs/planejamento-casos-de-uso` |
| Implementar além do critério 1 (validações de D-UC03-01/02) | O plano `05-03` limita a alteração às 5 asserções. As validações viram testes RED próprios |
| Autorrevisão sem segregação de funções | Limitação aceita e registrada. Se houver outro integrante, ele revisa o PR |

Integração: GREEN (este material) → testes dos critérios 2 a 6 → REFACTOR (Material 06) → PR sai de Draft → card em `In Review` → revisão → merge na `main` → card em `Done` e #36 fechada.
