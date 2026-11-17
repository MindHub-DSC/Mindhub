# 01-13 — Execução no GitHub e evidências

**Data e hora da execução:** 10/11/2026 16:26  
**Repositório:** `MindHub-DSC/Mindhub` (https://github.com/MindHub-DSC/Mindhub)  
**Executado por:** GitHub CLI (`gh`) autenticado como `leohsm`, por script que lê `01-03` e `01-04`; cada issue foi criada uma vez.

## Issue principal

- **Número:** #94
- **URL:** https://github.com/MindHub-DSC/Mindhub/issues/94
- **Título:** `[UC16] Registrar Organização`
- **Labels:** `usecase:uc16`, `domain:identidade`, `type:epic`, `priority:medium`
- **Responsável:** @leohsm
- **Estado no board:** `Backlog`

## Sub-Issues

| ID provisório | Número real | Título | URL | Estado no Board | Responsável |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `SUB-01` | `#95` | [UC16-SUB-01] [C1] Modelar a Organização e o Vínculo Organizacional | https://github.com/MindHub-DSC/Mindhub/issues/95 | Backlog | @leohsm |
| `SUB-02` | `#96` | [UC16-SUB-02] [C1] Persistir Organização e Vínculo na mesma transação | https://github.com/MindHub-DSC/Mindhub/issues/96 | Backlog | @leohsm |
| `SUB-03` | `#97` | [UC16-SUB-03] [C1] Implementar o serviço de aplicação Registrar Organização | https://github.com/MindHub-DSC/Mindhub/issues/97 | Backlog | @leohsm |
| `SUB-04` | `#98` | [UC16-SUB-04] [C1] Expor o endpoint de registro de Organização | https://github.com/MindHub-DSC/Mindhub/issues/98 | Backlog | @leohsm |
| `SUB-05` | `#99` | [UC16-SUB-05] [C1] Documentar o UC16 e o endpoint | https://github.com/MindHub-DSC/Mindhub/issues/99 | Backlog | @leohsm |

## Vínculos

- As 5 Sub-Issues foram vinculadas ao épico #94 pelo recurso nativo de sub-issues, e os `{{EPIC}}` e `{{SUB-XX}}` dos corpos foram trocados pelos números reais.
- As dependências internas da tabela [01-06](01-06-matriz-dependencias.md) foram registradas como "blocked by". As dependências de outros casos de uso e de decisões `D-...` constam só no texto das issues.

## GitHub Project

- Project: [Planejamento - Mindhub](https://github.com/orgs/MindHub-DSC/projects/1), com os 5 status `Backlog`, `Ready`, `In Progress`, `In Review` e `Done`.
- Todas as 6 issues deste caso de uso foram adicionadas com Status `Backlog`, conforme [01-08](01-08-planejamento-github-project.md). Nenhuma foi fechada ou movida para `In Progress` ou `Done`.

## Labels

- Criadas nesta execução: `usecase:uc16`.
- Reutilizadas: as demais labels do [plano](01-07-plano-labels.md).

## Pendências

- As marcas **[PROP]** e as dúvidas impeditivas ainda não foram confirmadas; nenhuma issue deve ir para `Ready` antes disso.
- A visualização do Project como Board (Kanban) não foi conferida pelo CLI.
