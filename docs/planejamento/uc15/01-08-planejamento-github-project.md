# 01-08 — Planejamento do GitHub Project

**Nome:** `Planejamento - Mindhub` (board único para todos os casos de uso, proposto em [uc05/01-08](../uc05/01-08-planejamento-github-project.md))  
**Proprietário:** organização `MindHub-DSC`  
**Visualização:** Board (Kanban) agrupado pelo campo Status; filtro `label:usecase:uc15` para ver só este épico

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
| Épico | [UC15] Indicar Participantes da Sessão | `Backlog` | Avança conforme as Sub-Issues |
| SUB-01 | [C1] Expor a visão pública de vínculos organizacionais em C1 | `Backlog` | Depende de UC17 |
| SUB-02 | [C4] Modelar a indicação de Participações na Sessão | `Backlog` | Depende de UC13, D-UC15-01, D-UC15-02, D-UC15-03 |
| SUB-03 | [C4] Implementar o serviço de aplicação Indicar Participantes | `Backlog` | Depende de SUB-01, SUB-02, D-UC15-04, D-UC15-05 |
| SUB-04 | [C4] Expor o endpoint de indicação e verificar a jornada | `Backlog` | Depende de SUB-03, D-UC15-06 |
| SUB-05 | [C4] Documentar o UC15 e o endpoint | `Backlog` | Depende de SUB-04 |
