# 04-01 — Verificação de prontidão (DoR)

**Caso de uso:** UC03 — Publicar Serviço (épico [#35](https://github.com/MindHub-DSC/Mindhub/issues/35))
**Sub-Issue de trabalho:** [#36](https://github.com/MindHub-DSC/Mindhub/issues/36) — [UC03-SUB-01] Modelar o Serviço e suas condições vigentes
**Responsável:** Leonardo Herrero S. Martins (@leohsm) — verificado no GitHub (assignee `leohsm`)
**Revisor:** @leohsm (autorrevisão; a equipe tem um integrante)
**Data:** 11/11/2026

Evidência do registro das decisões e da revisão: <https://github.com/MindHub-DSC/Mindhub/issues/36#issuecomment-6804988906>

## Matriz DoR

| Código | Condição | Resultado | Fundamento |
| --- | --- | --- | --- |
| DoR-01 | Objetivo claramente definido | **Atende** | A #36 declara o objetivo: representar o Serviço como Agregado de C2, com Modelo de Contratação e condições vigentes válidas. |
| DoR-02 | Escopo delimitado | **Atende** | A issue separa "Inclui" (agregado, objeto de valor, erros, porta, adaptador em memória, testes) de "Não inclui" (persistência, RN01, editar/despublicar). |
| DoR-03 | Critérios de aceite verificáveis | **Atende** | 6 critérios observáveis; o 1º guia o primeiro teste. |
| DoR-04 | Dependências identificadas | **Atende** | D-UC03-01 e D-UC03-02 mapeadas; fornece insumo às #37 e #38. |
| DoR-05 | Informações técnicas disponíveis | **Atende** (era *Não atende* no `02-06`) | D-UC03-01, D-UC03-02 e D-UC03-03 respondidas em 11/11/2026 no comentário da #36. A estrutura de `src/oferta/dominio` e o padrão do `PerfilEspecialista` já existem. |
| DoR-06 | Responsável definido | **Atende** | @leohsm é assignee da #36. |
| DoR-07 | Revisão de planejamento concluída | **Atende** (era *Não atende* no `02-06`) | Autorrevisão registrada no comentário citado acima. Limitação: sem revisor independente. |

## Decisões que tornaram a #36 pronta

- **D-UC03-01:** o Serviço é descrito por título e descrição (trim, mínimo 1).
- **D-UC03-02:** em Reserva Direta, as condições vigentes exigem preço (inteiro ≥ 0, unidade monetária mínima), moeda, duração (> 0) e modalidade.
- **D-UC03-03:** o Serviço Sob Proposta não tem preço de referência; as condições vigentes não são obrigatórias.

## Pendências

- Nenhuma que impeça o início. A D-UC03-06 (proteção contra suspensão concorrente) pertence à #39 e não afeta a #36.
- O status do card permanece `Backlog` até a abertura do Draft PR; a mudança para `In Progress` está no `04-08`.
- O Material 03 não foi gerado para o UC03 (priorização, política de WIP, plano de execução). A #36 foi escolhida por ser a primeira da ordem de dependência (as #37 e #38 consomem o que ela entrega). O limite de WIP é 2 issues em `In Progress` (`02-03`).

## Autorização

Com os 7 critérios em **Atende**, a #36 está **pronta** e a implementação do primeiro teste (TDD, fase RED) está autorizada. O escopo deste ciclo termina na fase RED, sem código de produção que faça o teste passar.
