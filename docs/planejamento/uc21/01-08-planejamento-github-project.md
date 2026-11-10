# 01-08 — Planejamento do GitHub Project

**Nome:** `Planejamento - Mindhub` (board único para todos os casos de uso, proposto em [uc05/01-08](../uc05/01-08-planejamento-github-project.md))  
**Proprietário:** organização `MindHub-DSC`  
**Visualização:** Board (Kanban) agrupado pelo campo Status; filtro `label:usecase:uc21` para ver só este épico

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
| Épico | [UC21] Decidir Disputa | `Backlog` | Avança conforme as Sub-Issues |
| SUB-01 | [C6] Estender a Disputa com o ciclo de decisão | `Backlog` | Depende de UC20, D-UC21-01 |
| SUB-02 | [C6] Registrar as ações decorrentes separadamente da decisão | `Backlog` | Depende de SUB-01 |
| SUB-03 | [C6] Definir as portas de comandos dos contextos e o adaptador da suspensão | `Backlog` | Depende de UC18, D-UC21-02 |
| SUB-04 | [C6] Implementar o serviço de aplicação Decidir Disputa | `Backlog` | Depende de SUB-01, SUB-02, SUB-03, D-UC21-04, D-UC21-05 |
| SUB-05 | [C6] Expor os endpoints de decisão e verificar a jornada | `Backlog` | Depende de SUB-04, D-UC21-06 |
| SUB-06 | [C6] Documentar o UC21 e o endpoint | `Backlog` | Depende de SUB-05 |
