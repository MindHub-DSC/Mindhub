# 01-10 — Roteiro operacional de configuração no GitHub

Repositório: `https://github.com/MindHub-DSC/Mindhub`

Os passos podem ser feitos pela interface web ou pelo GitHub CLI (`gh`). Este roteiro **não foi executado**: o planejamento só produz os artefatos. A execução real deve ser registrada em um arquivo `01-13-execucao-github-evidencias.md`, como nos demais casos de uso.

1. **Acessar o repositório** e confirmar permissão de escrita: `gh repo view MindHub-DSC/Mindhub --json viewerPermission`.
2. **Criar as labels novas** do [plano de labels](01-07-plano-labels.md):
   `gh label create "usecase:uc11" --color 5319e7 --description "Caso de uso UC11 - Reagendar Sessão" --force`.
3. **Criar a Issue principal** com o corpo de [01-03](01-03-issue-principal-epic.md):
   `gh issue create --title "[UC11] Reagendar Sessão" --body-file epic.md --label "usecase:uc11,domain:agenda,type:epic,priority:medium" --assignee leohsm`.
4. **Criar cada uma das 5 Sub-Issues** com o corpo de [01-04](01-04-sub-issues.md) e as labels indicadas em cada uma.
5. **Substituir os tokens** `{{EPIC}}` e `{{SUB-XX}}` pelos números reais (`gh issue edit N --body-file ...`).
6. **Vincular as Sub-Issues ao épico** pelo recurso nativo de sub-issues (e pela checklist de `{{SUB-XX}}` já presente no corpo do épico).
7. **Registrar as dependências** como "blocked by", conforme a tabela de [01-06](01-06-matriz-dependencias.md).
8. **Adicionar o épico e as Sub-Issues ao Project** `Planejamento - Mindhub` com Status `Backlog` (o GitHub CLI precisa do escopo `project`: `gh auth refresh -s project`).
9. **Atribuir o responsável** (@leohsm) a todas as issues.
10. **Revisar o board e a rastreabilidade:** cada Sub-Issue aparece como filha do épico, as dependências aparecem como "blocked by", todas estão em `Backlog` e as dúvidas e decisões abertas estão escritas no épico.

> **Antes de publicar:** revisar as marcas [PROP] e as dúvidas de [01-01](01-01-analise-tecnica.md) §9 e registrar as respostas; publicar antes os planejamentos dos casos de uso dos quais este depende (ver o épico).
