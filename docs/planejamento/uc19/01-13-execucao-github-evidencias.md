# 01-13 — Execução no GitHub e evidências

**Data e hora da execução:** 10/11/2026 16:26  
**Repositório:** `MindHub-DSC/Mindhub` (https://github.com/MindHub-DSC/Mindhub)  
**Executado por:** GitHub CLI (`gh`) autenticado como `leohsm`, por script que lê `01-03` e `01-04`; cada issue foi criada uma vez.

## Issue principal

- **Número:** #112
- **URL:** https://github.com/MindHub-DSC/Mindhub/issues/112
- **Título:** `[UC19] Reativar Perfil de Especialista`
- **Labels:** `usecase:uc19`, `domain:oferta`, `domain:governanca`, `type:epic`, `priority:medium`
- **Responsável:** @leohsm
- **Estado no board:** `Backlog`

## Sub-Issues

| ID provisório | Número real | Título | URL | Estado no Board | Responsável |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `SUB-01` | `#113` | [UC19-SUB-01] [C2] Implementar a transição de reativação no Perfil de Especialista | https://github.com/MindHub-DSC/Mindhub/issues/113 | Backlog | @leohsm |
| `SUB-02` | `#114` | [UC19-SUB-02] [C2] Implementar o serviço de aplicação Reativar Perfil e o registro da ação | https://github.com/MindHub-DSC/Mindhub/issues/114 | Backlog | @leohsm |
| `SUB-03` | `#115` | [UC19-SUB-03] [C2] Expor o endpoint de reativação e provar o efeito de RN01 | https://github.com/MindHub-DSC/Mindhub/issues/115 | Backlog | @leohsm |
| `SUB-04` | `#116` | [UC19-SUB-04] [C6] Garantir a rastreabilidade do ciclo suspensão-reativação | https://github.com/MindHub-DSC/Mindhub/issues/116 | Backlog | @leohsm |
| `SUB-05` | `#117` | [UC19-SUB-05] [C2] Documentar o UC19 e o endpoint | https://github.com/MindHub-DSC/Mindhub/issues/117 | Backlog | @leohsm |

## Vínculos

- As 5 Sub-Issues foram vinculadas ao épico #112 pelo recurso nativo de sub-issues, e os `{{EPIC}}` e `{{SUB-XX}}` dos corpos foram trocados pelos números reais.
- As dependências internas da tabela [01-06](01-06-matriz-dependencias.md) foram registradas como "blocked by". As dependências de outros casos de uso e de decisões `D-...` constam só no texto das issues.

## GitHub Project

- Project: [Planejamento - Mindhub](https://github.com/orgs/MindHub-DSC/projects/1), com os 5 status `Backlog`, `Ready`, `In Progress`, `In Review` e `Done`.
- Todas as 6 issues deste caso de uso foram adicionadas com Status `Backlog`, conforme [01-08](01-08-planejamento-github-project.md). Nenhuma foi fechada ou movida para `In Progress` ou `Done`.

## Labels

- Criadas nesta execução: `usecase:uc19`.
- Reutilizadas: as demais labels do [plano](01-07-plano-labels.md).

## Pendências

- As marcas **[PROP]** e as dúvidas impeditivas ainda não foram confirmadas; nenhuma issue deve ir para `Ready` antes disso.
- A visualização do Project como Board (Kanban) não foi conferida pelo CLI.
