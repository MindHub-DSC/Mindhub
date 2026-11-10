# 01-13 — Execução no GitHub e evidências

**Data e hora da execução:** 10/11/2026 16:26  
**Repositório:** `MindHub-DSC/Mindhub` (https://github.com/MindHub-DSC/Mindhub)  
**Executado por:** GitHub CLI (`gh`) autenticado como `leohsm`, por script que lê `01-03` e `01-04`; cada issue foi criada uma vez.

## Issue principal

- **Número:** #42
- **URL:** https://github.com/MindHub-DSC/Mindhub/issues/42
- **Título:** `[UC04] Buscar Especialistas e Serviços`
- **Labels:** `usecase:uc04`, `domain:oferta`, `type:epic`, `priority:medium`
- **Responsável:** @leohsm
- **Estado no board:** `Backlog`

## Sub-Issues

| ID provisório | Número real | Título | URL | Estado no Board | Responsável |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `SUB-01` | `#43` | [UC04-SUB-01] [C2] Definir o modelo de leitura público da oferta | https://github.com/MindHub-DSC/Mindhub/issues/43 | Backlog | @leohsm |
| `SUB-02` | `#44` | [UC04-SUB-02] [C2] Implementar a seleção de especialistas habilitados e Serviços publicados | https://github.com/MindHub-DSC/Mindhub/issues/44 | Backlog | @leohsm |
| `SUB-03` | `#45` | [UC04-SUB-03] [C2] Implementar a consulta da oferta no armazenamento | https://github.com/MindHub-DSC/Mindhub/issues/45 | Backlog | @leohsm |
| `SUB-04` | `#46` | [UC04-SUB-04] [C2] Expor o endpoint de busca e traduzir os erros | https://github.com/MindHub-DSC/Mindhub/issues/46 | Backlog | @leohsm |
| `SUB-05` | `#47` | [UC04-SUB-05] [C2] Documentar o UC04 e o endpoint | https://github.com/MindHub-DSC/Mindhub/issues/47 | Backlog | @leohsm |

## Vínculos

- As 5 Sub-Issues foram vinculadas ao épico #42 pelo recurso nativo de sub-issues, e os `{{EPIC}}` e `{{SUB-XX}}` dos corpos foram trocados pelos números reais.
- As dependências internas da tabela [01-06](01-06-matriz-dependencias.md) foram registradas como "blocked by". As dependências de outros casos de uso e de decisões `D-...` constam só no texto das issues.

## GitHub Project

- Project: [Planejamento - Mindhub](https://github.com/orgs/MindHub-DSC/projects/1), com os 5 status `Backlog`, `Ready`, `In Progress`, `In Review` e `Done`.
- Todas as 6 issues deste caso de uso foram adicionadas com Status `Backlog`, conforme [01-08](01-08-planejamento-github-project.md). Nenhuma foi fechada ou movida para `In Progress` ou `Done`.

## Labels

- Criadas nesta execução: `usecase:uc04`.
- Reutilizadas: as demais labels do [plano](01-07-plano-labels.md).

## Pendências

- As marcas **[PROP]** e as dúvidas impeditivas ainda não foram confirmadas; nenhuma issue deve ir para `Ready` antes disso.
- A visualização do Project como Board (Kanban) não foi conferida pelo CLI.
