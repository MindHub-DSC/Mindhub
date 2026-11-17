# 05-01 — Diagnóstico do estado RED

**Caso de uso:** UC03 — Publicar Serviço (épico [#35](https://github.com/MindHub-DSC/Mindhub/issues/35))
**Sub-Issue:** [#36](https://github.com/MindHub-DSC/Mindhub/issues/36) — [UC03-SUB-01] [C2] Modelar o Serviço e suas condições vigentes
**Responsável:** Leonardo Herrero S. Martins (@leohsm)
**Data:** 12/11/2026
**Fontes:** `04-01` a `04-08` desta pasta; código da branch `feature/36-uc03-modelar-servico` @ `c1a8af0`.

## Identificação

| Item | Valor |
| --- | --- |
| Caso de uso / Épico | UC03 — Publicar Serviço / #35 |
| Issue do teste | #36 (a mesma issue cobre teste e implementação) |
| Critério de aceite | Critério 1 da #36: *"O Serviço nasce publicado, com identidade própria, referência ao perfil e Modelo de Contratação declarado."* |
| Branch | `feature/36-uc03-modelar-servico` (upstream `origin/feature/36-uc03-modelar-servico`) |
| Arquivo de teste | `mindhub-backend/test/unit/oferta/servico.spec.ts` |
| Código de produção | `mindhub-backend/src/oferta/dominio/servico.ts` (stub) |
| Framework / runner | Vitest 4.1.11, Node v24.19.0, pnpm 12.9.1 |
| Comando | `cd mindhub-backend && pnpm test` |
| Commit RED | `c1a8af0` — `test(oferta): add failing test for Servico.publicar (ref #36)` |
| Draft PR | [#131](https://github.com/MindHub-DSC/Mindhub/pull/131), `feature/36-uc03-modelar-servico` → `main`, `isDraft: true`, `state: OPEN`, 1 commit |
| GitHub Project | Card #36 em **`In Progress`** (Planejamento - Mindhub); issue **aberta** |

## Saída RED documentada (Material 04, 11/11/2026)

```text
 FAIL  test/unit/oferta/servico.spec.ts > Servico.publicar > nasce publicado, com identidade própria, referência ao perfil e Modelo de Contratação
NaoImplementado: Servico.publicar ainda não implementado.
 ❯ Servico.publicar src/oferta/dominio/servico.ts:32:11
 ❯ test/unit/oferta/servico.spec.ts:22:29

 Test Files  1 failed | 5 passed (6)
      Tests  1 failed | 41 passed (42)
```

## Reconfirmação do estado atual (12/11/2026)

```text
$ git switch feature/36-uc03-modelar-servico
Switched to branch 'feature/36-uc03-modelar-servico'
Your branch is up to date with 'origin/feature/36-uc03-modelar-servico'.

$ git status -sb
## feature/36-uc03-modelar-servico...origin/feature/36-uc03-modelar-servico
?? docs/planejamento/
?? docs/prompts/

$ git branch --show-current
feature/36-uc03-modelar-servico

$ cd mindhub-backend && pnpm test
 ❯ test/unit/oferta/servico.spec.ts (1 test | 1 failed) 7ms
     × nasce publicado, com identidade própria, referência ao perfil e Modelo de Contratação 5ms

 FAIL  test/unit/oferta/servico.spec.ts > Servico.publicar > nasce publicado, com identidade própria, referência ao perfil e Modelo de Contratação
NaoImplementado: Servico.publicar ainda não implementado.
 ❯ Servico.publicar src/oferta/dominio/servico.ts:32:11
 ❯ test/unit/oferta/servico.spec.ts:22:29

 Test Files  1 failed | 5 passed (6)
      Tests  1 failed | 41 passed (42)
```

- A branch local está no mesmo commit da remota (`c1a8af0`) e não tem alterações em arquivos rastreados. Os itens `??` são documentação não versionada, fora do escopo do código.
- Nada mudou desde o Material 04: a falha é a mesma, na mesma linha.

## Causa técnica da falha

O teste chama `Servico.publicar(dados)` no passo **Act** (linha 22 do spec). O stub (linha 32 de `servico.ts`) lança `NaoImplementado` sem construir nada, então a falha acontece antes de qualquer asserção.

**Comportamento ausente:** criar uma instância de `Servico` a partir dos dados recebidos, com:

| Asserção do teste | O que falta no código |
| --- | --- |
| `servico.id` casa com regex de UUID | Gerar uma identidade própria (UUID) |
| `servico.perfilId` igual ao recebido | Guardar a referência ao perfil |
| `servico.titulo` igual ao recebido | Guardar o título |
| `servico.modeloContratacao` igual a `'SOB_PROPOSTA'` | Guardar o modelo declarado |
| `servico.situacao` igual a `'PUBLICADO'` | Fixar a situação inicial `PUBLICADO` |

As propriedades hoje são `declare readonly` (só tipo, sem valor em tempo de execução) e não há construtor.

## Contratos e componentes envolvidos

| Elemento | Definição atual | Observação |
| --- | --- | --- |
| `ModeloContratacao` | `'RESERVA_DIRETA' \| 'SOB_PROPOSTA'` | Contrato fixado no RED |
| `SituacaoServico` | `'PUBLICADO'` | Contrato fixado no RED |
| `Servico.publicar(dados)` | Recebe `{ perfilId, titulo, descricao, modeloContratacao, agora }` e retorna `Servico` | Assinatura a preservar |
| Getters | `id`, `perfilId`, `titulo`, `descricao`, `modeloContratacao`, `situacao` | Contrato a preservar |
| `NaoImplementado` | Erro provisório da fase RED | Deixa de ser usado depois do GREEN |
| Camada | Domínio (`src/oferta/dominio`), sem Nest, banco ou HTTP | Mesmo nível do `PerfilEspecialista` |

## Validação do RED legítimo

| Verificação | Resultado |
| --- | --- |
| O runner carregou o módulo e executou o teste? | Sim |
| A falha é de comportamento (e não de sintaxe, import, dependência ou runner)? | Sim: `NaoImplementado` lançado pelo stub |
| Só o teste novo falha? | Sim: 41 de 41 testes anteriores passam |
| O teste tem asserções reais ligadas ao critério 1? | Sim: 5 asserções, uma por elemento do critério |

**RED válido.**

## Pendências herdadas do Material 04 (`04-08`)

1. Fase GREEN de `Servico.publicar` na mesma branch e no mesmo PR (esta etapa).
2. Testes RED dos critérios 2 a 6 da #36 (fora do escopo desta etapa).
3. REFACTOR e `pnpm test`, `pnpm lint`, `pnpm build` verdes (Material 06).
4. Versionar os artefatos `04-*` na branch `docs/planejamento-casos-de-uso`: feito no commit `e8df25c` (ainda não publicado, branch local `ahead 1`).
5. A autorrevisão continua sendo uma limitação (equipe de um integrante).

## Autorização

Evidências conferidas: o estado RED é legítimo, o repositório está limpo e sincronizado, e o Draft PR #131 e o card estão como o Material 04 deixou. **Autorizado prosseguir para a verificação de escopo, issues e branches (Fase 3).**
