# 01-08 — Planejamento do GitHub Project

**Nome:** `Planejamento - Mindhub` (board único para todos os casos de uso, proposto em [uc05/01-08](../uc05/01-08-planejamento-github-project.md))  
**Proprietário:** organização `MindHub-DSC`  
**Visualização:** Board (Kanban) agrupado pelo campo Status; filtro `label:usecase:uc13` para ver só este épico

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
| Épico | [UC13] Realizar Sessão | `Backlog` | Avança conforme as Sub-Issues |
| SUB-01 | [C4] Modelar a Sessão, a Participação e o ciclo de vida | `Backlog` | Depende de D-UC13-06 |
| SUB-02 | [C4] Criar a Sessão `Programada` a partir da Reserva confirmada | `Backlog` | Depende de SUB-01, UC10, D-UC13-02 |
| SUB-03 | [C4] Definir a porta do Serviço de videoconferência e o adaptador simulado | `Backlog` | Depende de D-UC13-05 |
| SUB-04 | [C4] Implementar o serviço de aplicação Iniciar e Concluir Sessão | `Backlog` | Depende de SUB-01, SUB-03, D-UC13-01 |
| SUB-05 | [C4] Expor os endpoints de início e conclusão e verificar a jornada | `Backlog` | Depende de SUB-02, SUB-04, D-UC13-07, D-UC13-08 |
| SUB-06 | [C4] Documentar o UC13 e o endpoint | `Backlog` | Depende de SUB-05 |
