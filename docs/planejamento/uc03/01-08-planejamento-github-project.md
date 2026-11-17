# 01-08 — Planejamento do GitHub Project

**Nome:** `Planejamento - Mindhub` (board único para todos os casos de uso, proposto em [uc05/01-08](../uc05/01-08-planejamento-github-project.md))  
**Proprietário:** organização `MindHub-DSC`  
**Visualização:** Board (Kanban) agrupado pelo campo Status; filtro `label:usecase:uc03` para ver só este épico

## Campo Status

| Ordem | Estado | Significado |
| --- | --- | --- |
| 1 | `Backlog` | Planejada, ainda sem cumprir a Definition of Ready |
| 2 | `Ready` | Cumpre a Definition of Ready e pode ser puxada |
| 3 | `In Progress` | Desenvolvimento iniciado |
| 4 | `In Review` | Pull Request aberto, aguardando revisão |
| 5 | `Done` | Integrada e verificada |

Os estados padrão do GitHub (`Todo`, `No Status`) não são usados.

## Distribuição inicial

Todas as issues começam em `Backlog`, porque o caso de uso é *Derivado — a validar* e depende da confirmação das marcas [PROP]. Todas as unidades dependem de outras unidades, de casos de uso anteriores ou de decisões; nenhuma é candidata imediata a `Ready`.

| Issue | Título | Status inicial | Motivo |
| --- | --- | --- | --- |
| Épico | [UC03] Publicar Serviço | `Backlog` | Avança conforme as Sub-Issues |
| SUB-01 | [C2] Modelar o Serviço e suas condições vigentes | `Backlog` | Depende de D-UC03-01, D-UC03-02 |
| SUB-02 | [C2] Persistir o Serviço com TypeORM e migration | `Backlog` | Depende de SUB-01 |
| SUB-03 | [C2] Implementar o serviço de aplicação Publicar Serviço | `Backlog` | Depende de SUB-01, UC02 |
| SUB-04 | [C2] Proteger a publicação contra suspensão concorrente | `Backlog` | Depende de SUB-02, SUB-03, D-UC03-06 |
| SUB-05 | [C2] Expor o endpoint de publicação de Serviço e traduzir os erros | `Backlog` | Depende de SUB-03, SUB-04, D-UC03-05, D-UC03-07 |
| SUB-06 | [C2] Documentar o UC03 e o endpoint | `Backlog` | Depende de SUB-05 |
