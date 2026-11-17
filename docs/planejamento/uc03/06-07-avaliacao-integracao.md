# 06-07 — Avaliação da integração controlada

**Caso de uso:** UC03 — Publicar Serviço (épico [#35](https://github.com/MindHub-DSC/Mindhub/issues/35))
**Sub-Issue:** [#36](https://github.com/MindHub-DSC/Mindhub/issues/36)
**PR avaliado:** [#131](https://github.com/MindHub-DSC/Mindhub/pull/131) — `feature/36-uc03-modelar-servico` → `main` @ `992c8f1`
**Data:** 17/11/2026

> **O merge não é obrigatório para concluir o Material 06.** Esta avaliação decide, com base em evidências, se o PR deve ou não ser integrado agora.

## 1. Dados coletados

```text
$ gh pr view 131 --json isDraft,mergeable,mergeStateStatus,reviewDecision,baseRefName
{"baseRefName":"main","isDraft":true,"mergeStateStatus":"BLOCKED","mergeable":"MERGEABLE","reviewDecision":"REVIEW_REQUIRED"}

$ git rev-list --left-right --count origin/main...HEAD
5	4
$ git merge-tree --write-tree origin/main HEAD
sem conflitos

$ gh api repos/MindHub-DSC/Mindhub/branches/main/protection
{"allow_force_pushes":false,"dismiss_stale":false,"enforce_admins":false,"required_approving_review_count":1,"status_checks":null}

$ gh api repos/MindHub-DSC/Mindhub   (estratégias de merge habilitadas)
{"merge_commit":true,"rebase":true,"squash":true}
```

Critérios de aceite da #36, como estão na issue:

```text
- [ ] O Serviço nasce publicado, com identidade própria, referência ao perfil e Modelo de Contratação declarado.
- [ ] Modelo de Contratação ausente ou fora de Reserva Direta/Sob Proposta é recusado pelo domínio.
- [ ] Reserva Direta só é criada com condições vigentes completas, conforme D-UC03-02.
- [ ] Sob Proposta é criada sem condições vigentes obrigatórias (D-UC03-03).
- [ ] Preço negativo ou não inteiro, moeda vazia e duração não positiva são recusados.
- [ ] A porta permite adicionar, buscar por identificador e listar por perfil; o adaptador em memória devolve cópias defensivas.
```

## 2. Os 10 critérios de integração

| # | Critério | Situação | Evidência |
| --- | --- | --- | --- |
| 1 | Escopo concluído | **Não atendido** | O PR entrega o critério 1; a #36 tem 6 critérios |
| 2 | Critérios de aceite satisfeitos | **Não atendido** | 1 de 6 com teste e implementação (B1). O critério 4 é tocado pelo teste atual (Sob Proposta criada sem condições), mas ainda não há o conceito de condições vigentes para verificá-lo de fato |
| 3 | Testes automatizados passando (local e CI) | **Parcial** | Local: 43/43 (`06-06`). CI: não existe no repositório (A5) |
| 4 | Linters, tipos e build | **Atendido** | `pnpm lint` exit 0; `pnpm build` (tsc) exit 0 |
| 5 | Revisão técnica por pares | **Não atendido** | Só autorrevisão e parecer de IA. `reviewDecision: REVIEW_REQUIRED` (`06-05`, seção 4) |
| 6 | Sem comentários bloqueantes pendentes | **Não atendido** | B1 aberto. A3 e A4 resolvidos; A2 e A5 postergados com justificativa |
| 7 | Branch-base correta | **Atendido** | `main`, conforme o fluxo do projeto (`05-02`) |
| 8 | Sem conflitos | **Atendido** | `mergeable: MERGEABLE`; `git merge-tree` sem conflitos. A `main` está 5 commits à frente (só documentação do PR #132) |
| 9 | Regras de proteção respeitadas | **Não atendido** | A `main` exige 1 aprovação; o PR tem 0 (`mergeStateStatus: BLOCKED`) |
| 10 | Autorização formal para merge | **Não existe** | Nenhuma autorização do responsável/professor para integrar o #131; o PR está em Draft por decisão da equipe |

Resultado: 3 atendidos, 1 parcial, 6 não atendidos.

## 3. Refinamento 2 — aprovação técnica × autorização para merge

| Conceito | Situação do #131 |
| --- | --- |
| **Aprovação técnica** | Existe para o critério 1: o código é correto, simples, testado (43/43) e passou por revisão com apontamentos tratados (`06-05`, `06-06`) |
| **Autorização para merge** | **Não existe.** Escopo da #36 incompleto, sem revisão humana, proteção da `main` não satisfeita e nenhuma autorização formal |

A boa qualidade do código entregue não autoriza o merge. O código está certo para o que faz, mas a Sub-Issue ainda não está pronta para entrar na linha principal.

### Estado formal

| Estado | Atingido? | Motivo |
| --- | --- | --- |
| A — Tecnicamente revisado | **Sim** | Revisão emitida e apontamentos tratados |
| B — Aprovado tecnicamente | Não | Falta revisão humana independente e o B1 está aberto |
| C — Autorizado para merge | Não | Critérios 1, 2, 5, 6, 9 e 10 não atendidos |
| D — Integrado | Não | Merge não realizado |

**O PR #131 está no Estado A.**

### Observação sobre a proteção da `main`

`enforce_admins: false`: um administrador consegue fazer o merge ignorando a aprovação obrigatória (`gh pr merge --admin`). Isso foi usado hoje no PR #132, que só trazia documentação, por decisão explícita do responsável. **Para o #131 esse caminho não é adequado**: contornar a revisão de código de produção, com o escopo incompleto, é exatamente a integração prematura que o Material 06 manda evitar.

## 4. Cadeia de branches

Não há cadeia de branches dependentes: `main` → `feature/36-uc03-modelar-servico`, sem branch intermediária de testes. Teste e implementação viajam juntos, então a `main` nunca recebe um teste RED falhando.

Mesmo assim, as perguntas do material ajudam a fixar a estratégia:

| Pergunta | Resposta no contexto do #131 |
| --- | --- |
| E se só os testes fossem para a `main` antes da implementação? | A `main` ficaria vermelha. Não se aplica aqui: o RED nunca foi integrado sozinho |
| E se uma branch de implementação fosse mergeada na de testes antes da `main`? | Não há branch de testes separada. Os ciclos dos critérios 2 a 6 seguirão no mesmo PR |
| Como reconfigurar a base de um PR dependente após o merge da base? | Não há PR dependente. Se #37 ou #40 criarem branches a partir desta, a base delas deve passar para `main` depois do merge do #131 |
| Como manter a `main` verde? | Antes do merge final: `git merge origin/main` na branch, rodar `pnpm test`, `pnpm lint` e `pnpm build`, e só então integrar |

## 5. Decisão

**Decisão C — Integração não recomendada no momento.**

Justificativa:

1. **Escopo:** a #36 tem 6 critérios e só o 1 está implementado. Integrar agora entregaria à #37 (persistência) e à #40 (API) um agregado que aceita qualquer Modelo de Contratação, título vazio e Reserva Direta sem condições.
2. **Revisão:** não houve revisão humana independente; a proteção da `main` não está satisfeita.
3. **Bloqueio aberto:** B1 continua sem resolução.
4. **Autorização:** não existe autorização formal para o merge.

O PR **permanece aberto em Draft**. Nenhum merge foi executado.

## 6. Próximas ações

| # | Ação | Responsável | Condição de saída |
| --- | --- | --- | --- |
| 1 | Ciclos RED → GREEN → REFACTOR dos critérios 2 a 6 da #36, neste mesmo PR | @leohsm | 6 de 6 critérios com teste passando |
| 2 | Decidir `agora`/`publicadoEm` (A2) antes da #37 | @leohsm | Decisão registrada na #36 |
| 3 | Atualizar a branch com a `main` e rodar `pnpm test`, `pnpm lint`, `pnpm build` | @leohsm | Tudo verde, sem conflitos |
| 4 | Tirar o PR de Draft e mover o card para `In Review` | @leohsm | Itens 1 a 3 concluídos |
| 5 | Obter revisão humana independente (outro integrante ou o professor) | Equipe / professor | `reviewDecision: APPROVED` |
| 6 | Autorização formal e merge com merge commit (padrão do projeto) | Responsável / professor | Estado C → D |
| 7 | Depois do merge: `git switch main`, `git pull`, rodar a suíte; mover o card para `Done` e fechar a #36 | @leohsm | `main` verde |
