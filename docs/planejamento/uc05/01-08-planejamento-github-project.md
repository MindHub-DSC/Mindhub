# 01-08 — Planejamento do GitHub Project

**Nome proposto:** `Planejamento - Mindhub` (um board único para todos os casos de uso, filtrável pela label `usecase:ucNN`)
**Proprietário:** organização `MindHub-DSC`
**Visualização:** Board (Kanban) agrupado pelo campo Status

**[PROP]** O UC02 previa um board próprio (`Planejamento - Mindhub UC02`), que ainda não foi criado. Com quatro casos de uso planejados, um board único evita duplicar a configuração do Status e mostra as dependências entre épicos no mesmo lugar.

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

Todas as issues começam em `Backlog`. Nenhuma cumpre a Definition of Ready, porque o UC02, do qual dependem, ainda não foi implementado, e há decisões pendentes.

| Issue | Título | Status inicial | Motivo |
| --- | --- | --- | --- |
| Épico | [UC05] Enviar Solicitação de Atendimento | `Backlog` | Avança conforme as Sub-Issues |
| SUB-01 | Expor visão pública de habilitação do especialista (C2) | `Backlog` | Depende da #3 (UC02) |
| SUB-02 | Modelar Solicitação e implementar persistência em memória | `Backlog` | D-UC05-03 pendente |
| SUB-03 | Definir porta de aviso ao especialista com falha tolerada | `Backlog` | DoR ainda não aplicada; poderia ir para `Ready` após revisão |
| SUB-04 | Implementar serviço de aplicação Enviar Solicitação | `Backlog` | Depende de SUB-01 a SUB-03 |
| SUB-05 | Expor endpoint HTTP e integrar C1, C2 e C3 | `Backlog` | D1 pendente; depende da #6 (UC02) |
| SUB-06 | Estender o envio para Serviço indicado (RN13) | `Backlog` | Bloqueada pelo UC03 |
| SUB-07 | Documentar o UC05 e o endpoint | `Backlog` | Depende da SUB-05 |
