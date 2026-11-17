# 05-07 — Versionamento e Pull Request

**Caso de uso:** UC03 — Publicar Serviço (épico [#35](https://github.com/MindHub-DSC/Mindhub/issues/35))
**Sub-Issue:** [#36](https://github.com/MindHub-DSC/Mindhub/issues/36)
**Branch:** `feature/36-uc03-modelar-servico`
**Data:** 12/11/2026

## Inspeção antes do commit

```text
$ git status -sb
## feature/36-uc03-modelar-servico...origin/feature/36-uc03-modelar-servico
 M mindhub-backend/src/oferta/dominio/servico.ts
?? docs/planejamento/
?? docs/prompts/
```

O `git diff` mostrou só `servico.ts`: o import de `randomUUID`, o comentário da classe, os `declare readonly` trocados por construtor privado e getters, e o `throw new NaoImplementado(...)` trocado por `return new Servico(...)`. Os itens `??` são documentação e ficaram fora do commit.

## Commit

Adicionado por caminho, sem `git add .`:

```text
$ git add mindhub-backend/src/oferta/dominio/servico.ts
```

- **Hash:** `db568844e2bb5f246fbe7cbda2aa8b8e34afb4cb` (`db56884`)
- **Pai:** `c1a8af0` (commit RED)
- **Mensagem:**

```text
feat(oferta): implement Servico.publicar to satisfy test (ref #36)

Fase GREEN do critério 1 da #36: o Serviço nasce publicado, com identidade
própria (UUID), referência ao perfil, título, descrição e Modelo de
Contratação. Troca o stub por construtor privado e getters, no padrão do
PerfilEspecialista. Sem validações: elas entram com os testes dos
critérios 2 a 6.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
```

```text
$ git log -1 --stat
commit db568844e2bb5f246fbe7cbda2aa8b8e34afb4cb
Date:   Thu Nov 12 14:45:38 2026 -0300

    feat(oferta): implement Servico.publicar to satisfy test (ref #36)

 mindhub-backend/src/oferta/dominio/servico.ts | 62 ++++++++++++++++++++++-----
 1 file changed, 51 insertions(+), 11 deletions(-)
```

## Diff resumido

| Arquivo | Linhas | Resumo |
| --- | --- | --- |
| `mindhub-backend/src/oferta/dominio/servico.ts` | +51 −11 | Implementação de `Servico.publicar` e getters |
| `mindhub-backend/test/unit/oferta/servico.spec.ts` | 0 | Inalterado |

## Push

O upstream já estava configurado desde o `04-03`, então bastou `git push`:

```text
$ git push
To https://github.com/MindHub-DSC/Mindhub.git
   c1a8af0..db56884  feature/36-uc03-modelar-servico -> feature/36-uc03-modelar-servico

$ git status -sb
## feature/36-uc03-modelar-servico...origin/feature/36-uc03-modelar-servico
```

## Pull Request

| Item | Valor |
| --- | --- |
| URL | <https://github.com/MindHub-DSC/Mindhub/pull/131> |
| Origem → destino | `feature/36-uc03-modelar-servico` → `main` |
| Commits | `c1a8af0` (RED), `db56884` (GREEN) |
| Estado | **Draft**, aberto (`isDraft: true`, `state: OPEN`, `mergedAt: null`), conferido depois da edição |

Descrição atualizada com `gh pr edit 131 --body-file ...`:

- a tabela de alterações passou a listar os commits RED e GREEN;
- foi adicionada a seção "Evidência da Fase GREEN" com a saída `42 passed (42)`;
- a caixa "Implementação de código de produção (fase GREEN - Material 05)" foi marcada;
- foi incluída uma caixa nova, ainda desmarcada, para os critérios 2 a 6 da #36;
- o aviso de não integrar foi ajustado: o merge só depois dos critérios restantes e do REFACTOR.

O PR fica em Draft porque a #36 ainda tem cinco critérios sem teste e a fase REFACTOR não foi feita.

## GitHub Project e issues

| Item | Estado |
| --- | --- |
| Card #36 (Planejamento - Mindhub) | **`In Progress`** (sem alteração, conferido com `gh issue view 36`) |
| Issue #36 | **Aberta** |
| Épico #35 | Aberto |
| Merge na `main` | **Não realizado** |

## Próximos passos de integração

1. Versionar os artefatos `05-*` na branch `docs/planejamento-casos-de-uso` (fora do PR #131).
2. REFACTOR (Material 06): remover `NaoImplementado` e revisar os comentários, com a suíte verde antes e depois.
3. Ciclos RED → GREEN dos critérios 2 a 6 da #36.
4. Atualizar a branch com a `main`, se ela avançar, e rodar `pnpm test`, `pnpm lint` e `pnpm build`.
5. Tirar o PR de Draft, mover o card para `In Review`, revisar, fazer o merge e então mover para `Done` e fechar a #36.
