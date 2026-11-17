# 01-08 — Planejamento do GitHub Project

**Nome:** `Planejamento - Mindhub` (board único para todos os casos de uso, proposto em [uc05/01-08](../uc05/01-08-planejamento-github-project.md))
**Proprietário:** organização `MindHub-DSC`
**Visualização:** Board (Kanban) agrupado pelo campo Status; filtro `label:usecase:uc10` para ver só este épico

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

Todas as issues começam em `Backlog`. SUB-01, SUB-02 e SUB-05 não dependem do UC09 e são as candidatas a `Ready` depois da revisão humana; as demais estão bloqueadas pelo UC09 ou por decisões.

| Issue | Título | Status inicial | Motivo |
| --- | --- | --- | --- |
| Épico | [UC10] Pagar Reserva | `Backlog` | Avança conforme as Sub-Issues |
| SUB-01 | [C5] Modelar Pagamento e seu ciclo de vida | `Backlog` | DoR ainda não aplicada; candidata a `Ready` |
| SUB-02 | [C5] Porta do Provedor e adaptador simulado | `Backlog` | Depende do contrato da SUB-01 |
| SUB-03 | [C4] Visão da Reserva retida e correlação | `Backlog` | Bloqueada pelo UC09 |
| SUB-04 | [C5] Serviço Solicitar Pagamento | `Backlog` | Depende de SUB-01 a SUB-03 |
| SUB-05 | [C5] Resultado do Provedor e fato "Pagamento Decidido" | `Backlog` | Depende da SUB-01; D-UC10-04 a confirmar |
| SUB-06 | [C4] Aplicar "Pagamento Decidido" na Reserva | `Backlog` | Bloqueada pelo UC09 e por D-UC10-01 |
| SUB-07 | Endpoints HTTP e integração C4/C5 | `Backlog` | D1 e D-UC10-02 pendentes; depende do UC09 |
| SUB-08 | Documentar o UC10 e os endpoints | `Backlog` | Depende da SUB-07 |
