# 01-10 — Roteiro operacional de configuração no GitHub

Repositório: `https://github.com/MindHub-DSC/Mindhub`

Os passos podem ser feitos pela interface web ou pelo GitHub CLI (`gh`). A execução real está registrada em [01-13 — Evidências da execução](01-13-execucao-github-evidencias.md).

1. **Acessar o repositório** e confirmar permissão de escrita: `gh repo view MindHub-DSC/Mindhub --json viewerPermission`.
2. **Criar as labels** do [plano de labels](01-07-plano-labels.md):
   `gh label create "usecase:uc02" --color 5319e7 --description "..." --force` (repetir para cada label).
3. **Criar a Issue principal** com o corpo de [01-03](01-03-issue-principal-epic.md):
   `gh issue create --title "[UC02] Cadastrar Perfil de Especialista" --body-file epic.md --label "usecase:uc02,domain:oferta,type:epic,priority:high" --assignee leohsm`.
4. **Criar cada Sub-Issue** com o corpo de [01-04](01-04-sub-issues.md), substituindo `{{EPIC}}` pelo número real do épico e aplicando as labels indicadas.
5. **Vincular as Sub-Issues ao épico** pelo recurso nativo de sub-issues (botão "Add sub-issue" no épico) e atualizar a lista do épico com os números reais (`#N`).
6. **Conferir descrições e critérios de aceite** em cada issue, comparando com 01-04.
7. **Criar o GitHub Project** `Planejamento - Mindhub UC02` na organização e editar o campo **Status** para conter exatamente `Backlog`, `Ready`, `In Progress`, `In Review` e `Done`.
8. **Adicionar o épico e as Sub-Issues ao Project** e definir o Status inicial `Backlog` para todos.
9. **Atribuir o responsável** (@leohsm) a todas as issues.
10. **Revisar o board e a rastreabilidade:** cada Sub-Issue aparece como filha do épico, todas estão em `Backlog`, e nenhuma label de status foi criada.

> O GitHub CLI precisa do escopo `project` para os passos 7 e 8: `gh auth refresh -s project`.
