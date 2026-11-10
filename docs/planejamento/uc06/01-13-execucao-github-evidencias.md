# 01-13 — Execução no GitHub e evidências

**Data e hora da execução:** 10/11/2026 16:26  
**Repositório:** `MindHub-DSC/Mindhub` (https://github.com/MindHub-DSC/Mindhub)  
**Executado por:** GitHub CLI (`gh`) autenticado como `leohsm`, por script que lê `01-03` e `01-04`; cada issue foi criada uma vez.

## Issue principal

- **Número:** #48
- **URL:** https://github.com/MindHub-DSC/Mindhub/issues/48
- **Título:** `[UC06] Enviar Proposta`
- **Labels:** `usecase:uc06`, `domain:negociacao`, `type:epic`, `priority:high`
- **Responsável:** @leohsm
- **Estado no board:** `Backlog`

## Sub-Issues

| ID provisório | Número real | Título | URL | Estado no Board | Responsável |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `SUB-01` | `#49` | [UC06-SUB-01] [C3] Modelar as Condições Comerciais | https://github.com/MindHub-DSC/Mindhub/issues/49 | Backlog | @leohsm |
| `SUB-02` | `#50` | [UC06-SUB-02] [C3] Modelar a Proposta, suas Versões e o repositório em memória | https://github.com/MindHub-DSC/Mindhub/issues/50 | Backlog | @leohsm |
| `SUB-03` | `#51` | [UC06-SUB-03] [C3] Expor a Solicitação recebida ao Especialista destinatário | https://github.com/MindHub-DSC/Mindhub/issues/51 | Backlog | @leohsm |
| `SUB-04` | `#52` | [UC06-SUB-04] [C3] Implementar os serviços de aplicação Enviar Proposta e Enviar Nova Versão | https://github.com/MindHub-DSC/Mindhub/issues/52 | Backlog | @leohsm |
| `SUB-05` | `#53` | [UC06-SUB-05] [C3] Expor os endpoints de Proposta e verificar o envio de ponta a ponta | https://github.com/MindHub-DSC/Mindhub/issues/53 | Backlog | @leohsm |
| `SUB-06` | `#54` | [UC06-SUB-06] [C3] Documentar o UC06 e os endpoints | https://github.com/MindHub-DSC/Mindhub/issues/54 | Backlog | @leohsm |

## Vínculos

- As 6 Sub-Issues foram vinculadas ao épico #48 pelo recurso nativo de sub-issues, e os `{{EPIC}}` e `{{SUB-XX}}` dos corpos foram trocados pelos números reais.
- As dependências internas da tabela [01-06](01-06-matriz-dependencias.md) foram registradas como "blocked by". As dependências de outros casos de uso e de decisões `D-...` constam só no texto das issues.

## GitHub Project

- Project: [Planejamento - Mindhub](https://github.com/orgs/MindHub-DSC/projects/1), com os 5 status `Backlog`, `Ready`, `In Progress`, `In Review` e `Done`.
- Todas as 7 issues deste caso de uso foram adicionadas com Status `Backlog`, conforme [01-08](01-08-planejamento-github-project.md). Nenhuma foi fechada ou movida para `In Progress` ou `Done`.

## Labels

- Criadas nesta execução: `usecase:uc06`.
- Reutilizadas: as demais labels do [plano](01-07-plano-labels.md).

## Pendências

- As marcas **[PROP]** e as dúvidas impeditivas ainda não foram confirmadas; nenhuma issue deve ir para `Ready` antes disso.
- A visualização do Project como Board (Kanban) não foi conferida pelo CLI.
