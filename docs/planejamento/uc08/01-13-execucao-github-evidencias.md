# 01-13 — Execução no GitHub e evidências

**Data e hora da execução:** 10/11/2026 16:26  
**Repositório:** `MindHub-DSC/Mindhub` (https://github.com/MindHub-DSC/Mindhub)  
**Executado por:** GitHub CLI (`gh`) autenticado como `leohsm`, por script que lê `01-03` e `01-04`; cada issue foi criada uma vez.

## Issue principal

- **Número:** #55
- **URL:** https://github.com/MindHub-DSC/Mindhub/issues/55
- **Título:** `[UC08] Contratar Serviço de Reserva Direta`
- **Labels:** `usecase:uc08`, `domain:negociacao`, `domain:agenda`, `type:epic`, `priority:medium`
- **Responsável:** @leohsm
- **Estado no board:** `Backlog`

## Sub-Issues

| ID provisório | Número real | Título | URL | Estado no Board | Responsável |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `SUB-01` | `#56` | [UC08-SUB-01] [C2] Expor a visão pública do Serviço e suas condições vigentes | https://github.com/MindHub-DSC/Mindhub/issues/56 | Backlog | @leohsm |
| `SUB-02` | `#57` | [UC08-SUB-02] [C3] Estender a Contratação com origem Reserva Direta e snapshot das condições | https://github.com/MindHub-DSC/Mindhub/issues/57 | Backlog | @leohsm |
| `SUB-03` | `#58` | [UC08-SUB-03] [C3] Implementar o serviço de aplicação Contratar Reserva Direta | https://github.com/MindHub-DSC/Mindhub/issues/58 | Backlog | @leohsm |
| `SUB-04` | `#59` | [UC08-SUB-04] [C3] Expor o endpoint de contratação e verificar a jornada de ponta a ponta | https://github.com/MindHub-DSC/Mindhub/issues/59 | Backlog | @leohsm |
| `SUB-05` | `#60` | [UC08-SUB-05] [C3] Documentar o UC08 e o endpoint | https://github.com/MindHub-DSC/Mindhub/issues/60 | Backlog | @leohsm |

## Vínculos

- As 5 Sub-Issues foram vinculadas ao épico #55 pelo recurso nativo de sub-issues, e os `{{EPIC}}` e `{{SUB-XX}}` dos corpos foram trocados pelos números reais.
- As dependências internas da tabela [01-06](01-06-matriz-dependencias.md) foram registradas como "blocked by". As dependências de outros casos de uso e de decisões `D-...` constam só no texto das issues.

## GitHub Project

- Project: [Planejamento - Mindhub](https://github.com/orgs/MindHub-DSC/projects/1), com os 5 status `Backlog`, `Ready`, `In Progress`, `In Review` e `Done`.
- Todas as 6 issues deste caso de uso foram adicionadas com Status `Backlog`, conforme [01-08](01-08-planejamento-github-project.md). Nenhuma foi fechada ou movida para `In Progress` ou `Done`.

## Labels

- Criadas nesta execução: `usecase:uc08`.
- Reutilizadas: as demais labels do [plano](01-07-plano-labels.md).

## Pendências

- As marcas **[PROP]** e as dúvidas impeditivas ainda não foram confirmadas; nenhuma issue deve ir para `Ready` antes disso.
- A visualização do Project como Board (Kanban) não foi conferida pelo CLI.
