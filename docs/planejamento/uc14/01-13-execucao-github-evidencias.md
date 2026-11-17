# 01-13 — Execução no GitHub e evidências

**Data e hora da execução:** 10/11/2026 16:26  
**Repositório:** `MindHub-DSC/Mindhub` (https://github.com/MindHub-DSC/Mindhub)  
**Executado por:** GitHub CLI (`gh`) autenticado como `leohsm`, por script que lê `01-03` e `01-04`; cada issue foi criada uma vez.

## Issue principal

- **Número:** #82
- **URL:** https://github.com/MindHub-DSC/Mindhub/issues/82
- **Título:** `[UC14] Avaliar Sessão`
- **Labels:** `usecase:uc14`, `domain:agenda`, `type:epic`, `priority:medium`
- **Responsável:** @leohsm
- **Estado no board:** `Backlog`

## Sub-Issues

| ID provisório | Número real | Título | URL | Estado no Board | Responsável |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `SUB-01` | `#83` | [UC14-SUB-01] [C4] Modelar a Avaliação | https://github.com/MindHub-DSC/Mindhub/issues/83 | Backlog | @leohsm |
| `SUB-02` | `#84` | [UC14-SUB-02] [C4] Garantir a unicidade da Avaliação por Sessão no repositório | https://github.com/MindHub-DSC/Mindhub/issues/84 | Backlog | @leohsm |
| `SUB-03` | `#85` | [UC14-SUB-03] [C4] Implementar o serviço de aplicação Avaliar Sessão | https://github.com/MindHub-DSC/Mindhub/issues/85 | Backlog | @leohsm |
| `SUB-04` | `#86` | [UC14-SUB-04] [C4] Expor o endpoint de avaliação e verificar a concorrência | https://github.com/MindHub-DSC/Mindhub/issues/86 | Backlog | @leohsm |
| `SUB-05` | `#87` | [UC14-SUB-05] [C4] Documentar o UC14 e o endpoint | https://github.com/MindHub-DSC/Mindhub/issues/87 | Backlog | @leohsm |

## Vínculos

- As 5 Sub-Issues foram vinculadas ao épico #82 pelo recurso nativo de sub-issues, e os `{{EPIC}}` e `{{SUB-XX}}` dos corpos foram trocados pelos números reais.
- As dependências internas da tabela [01-06](01-06-matriz-dependencias.md) foram registradas como "blocked by". As dependências de outros casos de uso e de decisões `D-...` constam só no texto das issues.

## GitHub Project

- Project: [Planejamento - Mindhub](https://github.com/orgs/MindHub-DSC/projects/1), com os 5 status `Backlog`, `Ready`, `In Progress`, `In Review` e `Done`.
- Todas as 6 issues deste caso de uso foram adicionadas com Status `Backlog`, conforme [01-08](01-08-planejamento-github-project.md). Nenhuma foi fechada ou movida para `In Progress` ou `Done`.

## Labels

- Criadas nesta execução: `usecase:uc14`.
- Reutilizadas: as demais labels do [plano](01-07-plano-labels.md).

## Pendências

- As marcas **[PROP]** e as dúvidas impeditivas ainda não foram confirmadas; nenhuma issue deve ir para `Ready` antes disso.
- A visualização do Project como Board (Kanban) não foi conferida pelo CLI.
