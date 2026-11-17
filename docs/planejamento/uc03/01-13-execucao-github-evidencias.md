# 01-13 — Execução no GitHub e evidências

**Data e hora da execução:** 10/11/2026 16:26  
**Repositório:** `MindHub-DSC/Mindhub` (https://github.com/MindHub-DSC/Mindhub)  
**Executado por:** GitHub CLI (`gh`) autenticado como `leohsm`, por script que lê `01-03` e `01-04`; cada issue foi criada uma vez.

## Issue principal

- **Número:** #35
- **URL:** https://github.com/MindHub-DSC/Mindhub/issues/35
- **Título:** `[UC03] Publicar Serviço`
- **Labels:** `usecase:uc03`, `domain:oferta`, `type:epic`, `priority:high`
- **Responsável:** @leohsm
- **Estado no board:** `Backlog`

## Sub-Issues

| ID provisório | Número real | Título | URL | Estado no Board | Responsável |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `SUB-01` | `#36` | [UC03-SUB-01] [C2] Modelar o Serviço e suas condições vigentes | https://github.com/MindHub-DSC/Mindhub/issues/36 | Backlog | @leohsm |
| `SUB-02` | `#37` | [UC03-SUB-02] [C2] Persistir o Serviço com TypeORM e migration | https://github.com/MindHub-DSC/Mindhub/issues/37 | Backlog | @leohsm |
| `SUB-03` | `#38` | [UC03-SUB-03] [C2] Implementar o serviço de aplicação Publicar Serviço | https://github.com/MindHub-DSC/Mindhub/issues/38 | Backlog | @leohsm |
| `SUB-04` | `#39` | [UC03-SUB-04] [C2] Proteger a publicação contra suspensão concorrente | https://github.com/MindHub-DSC/Mindhub/issues/39 | Backlog | @leohsm |
| `SUB-05` | `#40` | [UC03-SUB-05] [C2] Expor o endpoint de publicação de Serviço e traduzir os erros | https://github.com/MindHub-DSC/Mindhub/issues/40 | Backlog | @leohsm |
| `SUB-06` | `#41` | [UC03-SUB-06] [C2] Documentar o UC03 e o endpoint | https://github.com/MindHub-DSC/Mindhub/issues/41 | Backlog | @leohsm |

## Vínculos

- As 6 Sub-Issues foram vinculadas ao épico #35 pelo recurso nativo de sub-issues, e os `{{EPIC}}` e `{{SUB-XX}}` dos corpos foram trocados pelos números reais.
- As dependências internas da tabela [01-06](01-06-matriz-dependencias.md) foram registradas como "blocked by". As dependências de outros casos de uso e de decisões `D-...` constam só no texto das issues.

## GitHub Project

- Project: [Planejamento - Mindhub](https://github.com/orgs/MindHub-DSC/projects/1), com os 5 status `Backlog`, `Ready`, `In Progress`, `In Review` e `Done`.
- Todas as 7 issues deste caso de uso foram adicionadas com Status `Backlog`, conforme [01-08](01-08-planejamento-github-project.md). Nenhuma foi fechada ou movida para `In Progress` ou `Done`.

## Labels

- Criadas nesta execução: `usecase:uc03`.
- Reutilizadas: as demais labels do [plano](01-07-plano-labels.md).

## Pendências

- As marcas **[PROP]** e as dúvidas impeditivas ainda não foram confirmadas; nenhuma issue deve ir para `Ready` antes disso.
- A visualização do Project como Board (Kanban) não foi conferida pelo CLI.
