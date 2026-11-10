# 01-13 — Execução no GitHub e evidências

**Data e hora da execução:** 10/11/2026 16:26  
**Repositório:** `MindHub-DSC/Mindhub` (https://github.com/MindHub-DSC/Mindhub)  
**Executado por:** GitHub CLI (`gh`) autenticado como `leohsm`, por script que lê `01-03` e `01-04`; cada issue foi criada uma vez.

## Issue principal

- **Número:** #69
- **URL:** https://github.com/MindHub-DSC/Mindhub/issues/69
- **Título:** `[UC11] Reagendar Sessão`
- **Labels:** `usecase:uc11`, `domain:agenda`, `type:epic`, `priority:medium`
- **Responsável:** @leohsm
- **Estado no board:** `Backlog`

## Sub-Issues

| ID provisório | Número real | Título | URL | Estado no Board | Responsável |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `SUB-01` | `#70` | [UC11-SUB-01] [C4] Implementar a operação de reagendamento na Reserva | https://github.com/MindHub-DSC/Mindhub/issues/70 | Backlog | @leohsm |
| `SUB-02` | `#71` | [UC11-SUB-02] [C4] Trocar o intervalo de forma atômica no repositório | https://github.com/MindHub-DSC/Mindhub/issues/71 | Backlog | @leohsm |
| `SUB-03` | `#72` | [UC11-SUB-03] [C4] Implementar o serviço de aplicação Reagendar Sessão | https://github.com/MindHub-DSC/Mindhub/issues/72 | Backlog | @leohsm |
| `SUB-04` | `#73` | [UC11-SUB-04] [C4] Expor o endpoint de reagendamento e verificar a concorrência | https://github.com/MindHub-DSC/Mindhub/issues/73 | Backlog | @leohsm |
| `SUB-05` | `#74` | [UC11-SUB-05] [C4] Documentar o UC11 e o endpoint | https://github.com/MindHub-DSC/Mindhub/issues/74 | Backlog | @leohsm |

## Vínculos

- As 5 Sub-Issues foram vinculadas ao épico #69 pelo recurso nativo de sub-issues, e os `{{EPIC}}` e `{{SUB-XX}}` dos corpos foram trocados pelos números reais.
- As dependências internas da tabela [01-06](01-06-matriz-dependencias.md) foram registradas como "blocked by". As dependências de outros casos de uso e de decisões `D-...` constam só no texto das issues.

## GitHub Project

- Project: [Planejamento - Mindhub](https://github.com/orgs/MindHub-DSC/projects/1), com os 5 status `Backlog`, `Ready`, `In Progress`, `In Review` e `Done`.
- Todas as 6 issues deste caso de uso foram adicionadas com Status `Backlog`, conforme [01-08](01-08-planejamento-github-project.md). Nenhuma foi fechada ou movida para `In Progress` ou `Done`.

## Labels

- Criadas nesta execução: `usecase:uc11`.
- Reutilizadas: as demais labels do [plano](01-07-plano-labels.md).

## Pendências

- As marcas **[PROP]** e as dúvidas impeditivas ainda não foram confirmadas; nenhuma issue deve ir para `Ready` antes disso.
- A visualização do Project como Board (Kanban) não foi conferida pelo CLI.
