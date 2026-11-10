# 01-08 — Planejamento do GitHub Project

**Nome:** `Planejamento - Mindhub` (board único para todos os casos de uso, proposto em [uc05/01-08](../uc05/01-08-planejamento-github-project.md))  
**Proprietário:** organização `MindHub-DSC`  
**Visualização:** Board (Kanban) agrupado pelo campo Status; filtro `label:usecase:uc06` para ver só este épico

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
| Épico | [UC06] Enviar Proposta | `Backlog` | Avança conforme as Sub-Issues |
| SUB-01 | [C3] Modelar as Condições Comerciais | `Backlog` | Depende de D-UC06-02 |
| SUB-02 | [C3] Modelar a Proposta, suas Versões e o repositório em memória | `Backlog` | Depende de SUB-01, D-UC06-01, D-UC06-03, D-UC06-04 |
| SUB-03 | [C3] Expor a Solicitação recebida ao Especialista destinatário | `Backlog` | Depende de UC05 |
| SUB-04 | [C3] Implementar os serviços de aplicação Enviar Proposta e Enviar Nova Versão | `Backlog` | Depende de SUB-02, SUB-03, UC05 |
| SUB-05 | [C3] Expor os endpoints de Proposta e verificar o envio de ponta a ponta | `Backlog` | Depende de SUB-04, D-UC06-08, D-UC06-09 |
| SUB-06 | [C3] Documentar o UC06 e os endpoints | `Backlog` | Depende de SUB-05 |
