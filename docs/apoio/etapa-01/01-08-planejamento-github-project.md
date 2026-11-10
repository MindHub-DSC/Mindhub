# 01-08 — Planejamento do GitHub Project

**Nome proposto:** `Planejamento - Mindhub UC02`
**Proprietário:** organização `MindHub-DSC`
**Visualização:** Board (Kanban) agrupado pelo campo Status

## Campo Status

O campo **Status** possui exatamente os cinco estados da metodologia, nesta ordem:

| Ordem | Estado | Significado |
| --- | --- | --- |
| 1 | `Backlog` | Planejada, ainda sem cumprir a Definition of Ready |
| 2 | `Ready` | Cumpre a Definition of Ready e pode ser puxada |
| 3 | `In Progress` | Desenvolvimento iniciado |
| 4 | `In Review` | Pull Request aberto, aguardando revisão |
| 5 | `Done` | Integrada e verificada |

Os estados padrão do GitHub (`Todo`, `No Status`) não são usados.

## Distribuição inicial

Nesta etapa a Definition of Ready ainda não foi aplicada. Por isso, todas as issues começam em `Backlog`.

| Issue | Título | Status inicial | Motivo |
| --- | --- | --- | --- |
| Épico | [UC02] Cadastrar Perfil de Especialista | `Backlog` | Agrupa as Sub-Issues; avança conforme elas avançam |
| SUB-01 | Expor interface pública de reconhecimento de usuário (C1) | `Backlog` | DoR ainda não aplicada |
| SUB-02 | Modelar Perfil de Especialista e suas invariantes | `Backlog` | DoR ainda não aplicada |
| SUB-03 | Contrato de persistência e adaptador em memória | `Backlog` | DoR ainda não aplicada |
| SUB-04 | Serviço de aplicação Cadastrar Perfil | `Backlog` | DoR ainda não aplicada |
| SUB-05 | Endpoint HTTP de cadastro de perfil | `Backlog` | DoR ainda não aplicada; D1 pendente |
| SUB-06 | Integração e testes HTTP | `Backlog` | DoR ainda não aplicada |
| SUB-07 | Documentação do UC02 | `Backlog` | DoR ainda não aplicada |
