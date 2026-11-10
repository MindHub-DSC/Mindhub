# 01-08 — Planejamento do GitHub Project

**Nome:** `Planejamento - Mindhub` (board único para todos os casos de uso, proposto em [uc05/01-08](../uc05/01-08-planejamento-github-project.md))  
**Proprietário:** organização `MindHub-DSC`  
**Visualização:** Board (Kanban) agrupado pelo campo Status; filtro `label:usecase:uc17` para ver só este épico

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
| Épico | [UC17] Vincular Membro à Organização | `Backlog` | Avança conforme as Sub-Issues |
| SUB-01 | [C1] Estender o Vínculo Organizacional com papéis de membro | `Backlog` | Depende de UC16, D-UC17-01 |
| SUB-02 | [C1] Verificar o vínculo do Representante no instante da operação | `Backlog` | Depende de SUB-01, D-UC17-03 |
| SUB-03 | [C1] Implementar o serviço de aplicação Vincular Membro | `Backlog` | Depende de SUB-02, UC01, D-UC17-02, D-UC17-05 |
| SUB-04 | [C1] Expor o endpoint de vínculo e verificar a jornada | `Backlog` | Depende de SUB-03, D-UC17-06, D-UC17-07 |
| SUB-05 | [C1] Documentar o UC17 e o endpoint | `Backlog` | Depende de SUB-04 |
