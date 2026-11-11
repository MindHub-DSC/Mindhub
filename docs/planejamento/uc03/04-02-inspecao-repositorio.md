# 04-02 — Inspeção do repositório

**Caso de uso:** UC03 — Publicar Serviço (épico [#35](https://github.com/MindHub-DSC/Mindhub/issues/35))
**Sub-Issue de trabalho:** [#36](https://github.com/MindHub-DSC/Mindhub/issues/36) — Modelar o Serviço e suas condições vigentes
**Responsável:** Leonardo Herrero S. Martins (@leohsm)
**Data:** 11/11/2026

**Repositório:** <https://github.com/MindHub-DSC/Mindhub> (clone local em `C:\Users\leonardo\Desktop\DSC\Mindhub`)
**Branch base:** `main` (branch padrão, **protegida**: `gh api repos/MindHub-DSC/Mindhub/branches/main` retornou `{"protected":true}`)

## Comandos executados e saídas

```text
$ git fetch origin
$ git rev-list --left-right --count main...origin/main
0	0

$ git switch main
Switched to branch 'main'
Your branch is up to date with 'origin/main'.

$ git pull --ff-only origin main
From https://github.com/MindHub-DSC/Mindhub
 * branch            main       -> FETCH_HEAD
Already up to date.

$ git branch --show-current
main

$ git log --oneline -3
cbf21f5 Merge pull request #34 from MindHub-DSC/feat/issue-1-cadastrar-perfil-especialista
69d3e84 docs(backend): documenta o primeiro slice e a reprodução com PostgreSQL
b05c104 feat(oferta): expõe POST /especialistas com tradução de erros
```

`git status -sb` na `main`:

```text
## main...origin/main
?? docs/planejamento/
?? docs/prompts/
```

## Leitura do resultado

- `main` e `origin/main` estão no mesmo commit (`cbf21f5`); contagem de divergência `0 0`. Sincronismo confirmado por fast-forward (nada a puxar).
- Não há alterações em arquivos rastreados. Os dois itens `??` são documentação ainda não versionada (arquivos do planejamento e dos prompts), que não entra no commit do teste.
- A `main` é protegida: a alteração entra só por Pull Request.
- Os arquivos `01-*` do UC03 existem apenas na branch `docs/planejamento-casos-de-uso`; ao trocar para a `main` eles deixam de aparecer no diretório de trabalho. Nada foi perdido: continuam versionados naquela branch.

## Linha de base dos testes (antes de qualquer alteração)

```text
$ cd mindhub-backend && pnpm test
 RUN  v4.1.11 C:/Users/leonardo/Desktop/DSC/Mindhub/mindhub-backend

 Test Files  5 passed (5)
      Tests  41 passed (41)
```

Ambiente: Node v24.19.0, pnpm 12.9.1, Vitest 4.1.11. Com a suíte verde, qualquer falha futura vem do teste novo.
