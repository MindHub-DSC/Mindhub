# 01-08 — Planejamento do GitHub Project

**Nome:** `Planejamento - Mindhub` (board único para todos os casos de uso, proposto em [uc05/01-08](../uc05/01-08-planejamento-github-project.md))  
**Proprietário:** organização `MindHub-DSC`  
**Visualização:** Board (Kanban) agrupado pelo campo Status; filtro `label:usecase:uc09` para ver só este épico

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
| Épico | [UC09] Agendar Sessão Contratada | `Backlog` | Avança conforme as Sub-Issues |
| SUB-01 | [C4] Modelar a Reserva, o Intervalo de Tempo e o ciclo da retenção | `Backlog` | Depende de D-UC09-04, D-UC09-06 |
| SUB-02 | [C4] Registrar a retenção de forma atômica e idempotente no repositório | `Backlog` | Depende de SUB-01, D-UC09-02, D-UC09-05, D-UC09-08 |
| SUB-03 | [C4] Implementar o contrato C01 (porta pública de retenção de horário) | `Backlog` | Depende de SUB-01, SUB-02, D-UC09-01, D-UC09-04 |
| SUB-04 | [C3] Implementar o serviço de C3 Agendar Sessão Contratada | `Backlog` | Depende de SUB-03, UC07 |
| SUB-05 | [C4] Liberar a retenção expirada por tempo | `Backlog` | Depende de SUB-01, SUB-02, D-UC09-07 |
| SUB-06 | [C3] Expor o endpoint de agendamento e verificar a concorrência de ponta a ponta | `Backlog` | Depende de SUB-04, SUB-05, D-UC09-09, D-UC09-10 |
| SUB-07 | [C4] Documentar o UC09 e o endpoint | `Backlog` | Depende de SUB-06 |
