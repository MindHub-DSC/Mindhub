# 01-10 — Roteiro operacional de configuração no GitHub

Repositório: `https://github.com/MindHub-DSC/Mindhub`

Os passos podem ser feitos pela interface web ou pelo GitHub CLI (`gh`). A execução real fica registrada em [01-13 — Evidências da execução](01-13-execucao-github-evidencias.md). O UC05 deve ser publicado antes, porque as Sub-Issues deste épico referenciam issues dele.

1. **Acessar o repositório** e confirmar permissão de escrita: `gh repo view MindHub-DSC/Mindhub --json viewerPermission`.
2. **Criar a label nova** do [plano de labels](01-07-plano-labels.md) (`usecase:uc07`) e conferir que `domain:negociacao` já existe:
   `gh label create "usecase:uc07" --color 5319e7 --description "Caso de uso UC07 - Aceitar Proposta" --force`.
3. **Criar a Issue principal** com o corpo de [01-03](01-03-issue-principal-epic.md):
   `gh issue create --title "[UC07] Aceitar Proposta" --body-file epic.md --label "usecase:uc07,domain:negociacao,type:epic,priority:high" --assignee leohsm`.
4. **Criar cada Sub-Issue** com o corpo de [01-04](01-04-sub-issues.md) e as labels indicadas.
5. **Substituir os tokens** `{{EPIC}}`, `{{SUB-XX}}` e `{{UC05-SUB-XX}}` pelos números reais (`gh issue edit N --body-file ...`).
6. **Vincular as Sub-Issues ao épico** pelo recurso nativo de sub-issues.
7. **Registrar as dependências** como "blocked by", conforme a tabela de [01-06](01-06-matriz-dependencias.md), inclusive as do UC05.
8. **Adicionar o épico e as Sub-Issues ao Project** `Planejamento - Mindhub` com Status `Backlog`.
9. **Atribuir o responsável** (@leohsm) a todas as issues.
10. **Revisar o board e a rastreabilidade:** cada Sub-Issue aparece como filha do épico, as dependências aparecem como "blocked by", todas estão em `Backlog` e o bloqueio pelo UC06 está escrito no épico.

> O GitHub CLI precisa do escopo `project` para o passo 8: `gh auth refresh -s project`.
