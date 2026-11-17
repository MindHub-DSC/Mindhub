# 01-08 — Planejamento do GitHub Project

**Nome:** `Planejamento - Mindhub` (board único para todos os casos de uso, proposto em [uc05/01-08](../uc05/01-08-planejamento-github-project.md))  
**Proprietário:** organização `MindHub-DSC`  
**Visualização:** Board (Kanban) agrupado pelo campo Status; filtro `label:usecase:uc14` para ver só este épico

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
| Épico | [UC14] Avaliar Sessão | `Backlog` | Avança conforme as Sub-Issues |
| SUB-01 | [C4] Modelar a Avaliação | `Backlog` | Depende de D-UC14-01 |
| SUB-02 | [C4] Garantir a unicidade da Avaliação por Sessão no repositório | `Backlog` | Depende de SUB-01 |
| SUB-03 | [C4] Implementar o serviço de aplicação Avaliar Sessão | `Backlog` | Depende de SUB-01, SUB-02, UC13 |
| SUB-04 | [C4] Expor o endpoint de avaliação e verificar a concorrência | `Backlog` | Depende de SUB-03, D-UC14-05, D-UC14-06 |
| SUB-05 | [C4] Documentar o UC14 e o endpoint | `Backlog` | Depende de SUB-04 |
