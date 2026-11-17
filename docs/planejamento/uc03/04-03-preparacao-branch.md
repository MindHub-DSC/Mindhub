# 04-03 — Preparação da branch de trabalho

**Caso de uso:** UC03 — Publicar Serviço (épico [#35](https://github.com/MindHub-DSC/Mindhub/issues/35))
**Issue vinculada:** [#36](https://github.com/MindHub-DSC/Mindhub/issues/36)
**Data:** 11/11/2026

| Item | Valor |
| --- | --- |
| Branch | `feature/36-uc03-modelar-servico` |
| Padrão | `feature/<issue-id>-<descrição-curta>` (convenção da disciplina; o repositório usa `feat/issue-1-...` e `chore/...` em branches anteriores, e a opção da disciplina foi mantida) |
| Base | `main` @ `cbf21f5` |
| Cenário | A — branch nova, criada e publicada por @leohsm |

## Comandos e saídas

```text
$ git switch -c feature/36-uc03-modelar-servico
Switched to a new branch 'feature/36-uc03-modelar-servico'

$ git push -u origin feature/36-uc03-modelar-servico
remote:      https://github.com/MindHub-DSC/Mindhub/pull/new/feature/36-uc03-modelar-servico
To https://github.com/MindHub-DSC/Mindhub.git
 * [new branch]      feature/36-uc03-modelar-servico -> feature/36-uc03-modelar-servico
branch 'feature/36-uc03-modelar-servico' set up to track 'origin/feature/36-uc03-modelar-servico'.

$ git branch --show-current
feature/36-uc03-modelar-servico

$ git branch -vv
* feature/36-uc03-modelar-servico            cbf21f5 [origin/feature/36-uc03-modelar-servico] Merge pull request #34 ...
```

## Leitura

- O trabalho está isolado da `main`, que é protegida e só recebe alterações por PR.
- O upstream (`-u`) liga a branch local à `origin/feature/36-uc03-modelar-servico`, de modo que `git push` e `git pull` dispensam argumentos.
- Rastreabilidade: o número `36` no nome da branch e o `(ref #36)` no commit ligam a alteração à Sub-Issue.
