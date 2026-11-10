# 01-10 — Roteiro operacional de configuração no GitHub

Repositório: `https://github.com/MindHub-DSC/Mindhub`

Os passos podem ser feitos pela interface web ou pelo GitHub CLI (`gh`). A execução real está registrada em [01-13 — Evidências da execução](01-13-execucao-github-evidencias.md).

1. **Acessar o repositório** e confirmar permissão de escrita: `gh repo view MindHub-DSC/Mindhub --json viewerPermission`.
2. **Criar as labels novas** do [plano de labels](01-07-plano-labels.md) (`usecase:uc05`, `domain:negociacao`, `layer:adapter`):
   `gh label create "usecase:uc05" --color 5319e7 --description "..." --force`.
3. **Criar a Issue principal** com o corpo de [01-03](01-03-issue-principal-epic.md):
   `gh issue create --title "[UC05] Enviar Solicitação de Atendimento" --body-file epic.md --label "usecase:uc05,domain:negociacao,type:epic,priority:high" --assignee leohsm`.
4. **Criar cada Sub-Issue** com o corpo de [01-04](01-04-sub-issues.md), substituindo `{{EPIC}}` pelo número real do épico e aplicando as labels indicadas.
5. **Vincular as Sub-Issues ao épico** pelo recurso nativo de sub-issues e substituir `{{SUB-XX}}` pelos números reais no épico e nas Sub-Issues.
6. **Registrar as dependências** como "blocked by": SUB-04 por SUB-01/02/03 e #2; SUB-05 por SUB-04 e #6; SUB-01 por #3; SUB-06 e SUB-07 por SUB-05.
7. **Criar o GitHub Project** `Planejamento - Mindhub` na organização (ou reutilizá-lo, se já existir) e deixar o campo **Status** com exatamente `Backlog`, `Ready`, `In Progress`, `In Review` e `Done`.
8. **Adicionar o épico e as Sub-Issues ao Project** com Status `Backlog`.
9. **Atribuir o responsável** (@leohsm) a todas as issues.
10. **Revisar o board e a rastreabilidade:** cada Sub-Issue aparece como filha do épico, as dependências aparecem como "blocked by", todas estão em `Backlog` e nenhuma label de status foi criada.

> O GitHub CLI precisa do escopo `project` para os passos 7 e 8: `gh auth refresh -s project`.
