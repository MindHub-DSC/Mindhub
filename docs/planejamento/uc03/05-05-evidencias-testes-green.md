# 05-05 — Evidências dos testes GREEN

**Caso de uso:** UC03 — Publicar Serviço (épico [#35](https://github.com/MindHub-DSC/Mindhub/issues/35))
**Sub-Issue:** [#36](https://github.com/MindHub-DSC/Mindhub/issues/36), critério 1
**Branch:** `feature/36-uc03-modelar-servico`
**Data:** 12/11/2026

## RED × GREEN

| | RED (Material 04, reconfirmado em 12/11) | GREEN (12/11/2026) |
| --- | --- | --- |
| Comando | `cd mindhub-backend && pnpm test` | `cd mindhub-backend && pnpm test` |
| `servico.spec.ts` | `1 test \| 1 failed` | `1 passed` |
| Teste | `× nasce publicado, com identidade própria, referência ao perfil e Modelo de Contratação` | `✓ nasce publicado, com identidade própria, referência ao perfil e Modelo de Contratação` |
| Causa | `NaoImplementado` em `servico.ts:32` | — |
| Test Files | `1 failed \| 5 passed (6)` | `6 passed (6)` |
| Tests | `1 failed \| 41 passed (42)` | `42 passed (42)` |

## Saídas reais

### Teste específico

```text
$ pnpm test test/unit/oferta/servico.spec.ts
$ vitest run test/unit/oferta/servico.spec.ts

 RUN  v4.1.11 C:/Users/leonardo/Desktop/DSC/Mindhub/mindhub-backend

 Test Files  1 passed (1)
      Tests  1 passed (1)
   Start at  14:43:27
   Duration  201ms (transform 25ms, setup 0ms, import 38ms, tests 3ms, environment 0ms)
```

Com o reporter detalhado, para mostrar o nome do teste:

```text
$ pnpm exec vitest run test/unit/oferta/servico.spec.ts --reporter=verbose
 ✓ test/unit/oferta/servico.spec.ts > Servico.publicar > nasce publicado, com identidade própria, referência ao perfil e Modelo de Contratação 2ms
      Tests  1 passed (1)
```

### Suíte completa (regressão)

```text
$ pnpm test
$ vitest run

 RUN  v4.1.11 C:/Users/leonardo/Desktop/DSC/Mindhub/mindhub-backend

 Test Files  6 passed (6)
      Tests  42 passed (42)
   Start at  14:43:27
   Duration  555ms (transform 328ms, setup 0ms, import 662ms, tests 43ms, environment 1ms)
```

### Lint e build

```text
$ pnpm lint
$ oxlint --type-aware src/ test/
lint exit=0

$ pnpm build
build exit=0
```

### Teste inalterado

```text
$ git diff --exit-code -- test/ && echo "spec inalterado"
spec inalterado
```

## Verificação das asserções

O teste do Vitest só passa se todas as `expect` forem avaliadas sem falhar. Não há `skip`, `todo` nem `expect` dentro de condicional no spec.

| # | Asserção | Avaliada? | Por que passa |
| --- | --- | --- | --- |
| 1 | `servico.id` casa com a regex de UUID | Sim | `randomUUID()` gera UUID v4 em minúsculas |
| 2 | `servico.perfilId` igual a `perfilId` | Sim | Valor guardado da entrada |
| 3 | `servico.titulo` igual a `'Mentoria de produto'` | Sim | Valor guardado da entrada |
| 4 | `servico.modeloContratacao` igual a `'SOB_PROPOSTA'` | Sim | Valor guardado da entrada |
| 5 | `servico.situacao` igual a `'PUBLICADO'` | Sim | Situação inicial fixada em `publicar` |

## Validação do GREEN legítimo

| Critério | Resultado |
| --- | --- |
| Mesmo teste e mesmo caminho do Material 04? | Sim: `test/unit/oferta/servico.spec.ts`, mesmo `describe`/`it` |
| O teste passou? | Sim |
| Todas as asserções foram avaliadas? | Sim (5 de 5, sem desvio de fluxo) |
| O sucesso vem da implementação? | Sim: o único arquivo alterado é `servico.ts` e o spec está igual ao do commit `c1a8af0` |
| Regressão? | Nenhuma: os 41 testes anteriores continuam passando (42/42) |

## Conclusão

A transição **RED → GREEN** do critério 1 da #36 está confirmada: o mesmo teste, que falhava com `NaoImplementado`, agora passa por causa da implementação de `Servico.publicar`, sem alterar o teste e sem regressões. Lint e build estão limpos.
