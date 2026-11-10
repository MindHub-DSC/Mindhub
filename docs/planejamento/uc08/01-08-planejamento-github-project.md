# 01-08 — Planejamento do GitHub Project

**Nome:** `Planejamento - Mindhub` (board único para todos os casos de uso, proposto em [uc05/01-08](../uc05/01-08-planejamento-github-project.md))  
**Proprietário:** organização `MindHub-DSC`  
**Visualização:** Board (Kanban) agrupado pelo campo Status; filtro `label:usecase:uc08` para ver só este épico

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
| Épico | [UC08] Contratar Serviço de Reserva Direta | `Backlog` | Avança conforme as Sub-Issues |
| SUB-01 | [C2] Expor a visão pública do Serviço e suas condições vigentes | `Backlog` | Depende de UC03 |
| SUB-02 | [C3] Estender a Contratação com origem Reserva Direta e snapshot das condições | `Backlog` | Depende de UC07 |
| SUB-03 | [C3] Implementar o serviço de aplicação Contratar Reserva Direta | `Backlog` | Depende de SUB-01, SUB-02, UC09, D-UC08-06, D-UC08-07 |
| SUB-04 | [C3] Expor o endpoint de contratação e verificar a jornada de ponta a ponta | `Backlog` | Depende de SUB-03, UC09, D-UC08-08, D-UC08-09 |
| SUB-05 | [C3] Documentar o UC08 e o endpoint | `Backlog` | Depende de SUB-04 |
