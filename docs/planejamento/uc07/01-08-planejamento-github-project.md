# 01-08 — Planejamento do GitHub Project

**Nome:** `Planejamento - Mindhub` (board único para todos os casos de uso, proposto em [uc05/01-08](../uc05/01-08-planejamento-github-project.md))
**Proprietário:** organização `MindHub-DSC`
**Visualização:** Board (Kanban) agrupado pelo campo Status; filtro `label:usecase:uc07` para ver só este épico

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

Todas as issues começam em `Backlog`. Nenhuma cumpre a Definition of Ready: o UC06, do qual o modelo da Proposta depende, ainda não foi especificado.

| Issue | Título | Status inicial | Motivo |
| --- | --- | --- | --- |
| Épico | [UC07] Aceitar Proposta | `Backlog` | Avança conforme as Sub-Issues |
| SUB-01 | Implementar o aceite no Agregado Proposta | `Backlog` | Bloqueada pelo UC06; D-UC07-03 e D-UC07-04 pendentes |
| SUB-02 | Modelar Contratação Sob Proposta com snapshot imutável | `Backlog` | Bloqueada pelo UC06 (Condições Comerciais) |
| SUB-03 | Registrar aceite e Contratação na mesma unidade de consistência | `Backlog` | Depende de SUB-01 e SUB-02 |
| SUB-04 | Implementar serviço de aplicação Aceitar Proposta | `Backlog` | Depende de SUB-01 a SUB-03 e do UC05 |
| SUB-05 | Expor endpoints HTTP e verificar o aceite de ponta a ponta | `Backlog` | D1 pendente; depende do UC06 |
| SUB-06 | Documentar o UC07 e os endpoints | `Backlog` | Depende da SUB-05 |
