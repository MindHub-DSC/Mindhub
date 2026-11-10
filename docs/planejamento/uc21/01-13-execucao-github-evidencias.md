# 01-13 — Execução no GitHub e evidências

**Data e hora da execução:** 10/11/2026 16:26  
**Repositório:** `MindHub-DSC/Mindhub` (https://github.com/MindHub-DSC/Mindhub)  
**Executado por:** GitHub CLI (`gh`) autenticado como `leohsm`, por script que lê `01-03` e `01-04`; cada issue foi criada uma vez.

## Issue principal

- **Número:** #124
- **URL:** https://github.com/MindHub-DSC/Mindhub/issues/124
- **Título:** `[UC21] Decidir Disputa`
- **Labels:** `usecase:uc21`, `domain:governanca`, `type:epic`, `priority:medium`
- **Responsável:** @leohsm
- **Estado no board:** `Backlog`

## Sub-Issues

| ID provisório | Número real | Título | URL | Estado no Board | Responsável |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `SUB-01` | `#125` | [UC21-SUB-01] [C6] Estender a Disputa com o ciclo de decisão | https://github.com/MindHub-DSC/Mindhub/issues/125 | Backlog | @leohsm |
| `SUB-02` | `#126` | [UC21-SUB-02] [C6] Registrar as ações decorrentes separadamente da decisão | https://github.com/MindHub-DSC/Mindhub/issues/126 | Backlog | @leohsm |
| `SUB-03` | `#127` | [UC21-SUB-03] [C6] Definir as portas de comandos dos contextos e o adaptador da suspensão | https://github.com/MindHub-DSC/Mindhub/issues/127 | Backlog | @leohsm |
| `SUB-04` | `#128` | [UC21-SUB-04] [C6] Implementar o serviço de aplicação Decidir Disputa | https://github.com/MindHub-DSC/Mindhub/issues/128 | Backlog | @leohsm |
| `SUB-05` | `#129` | [UC21-SUB-05] [C6] Expor os endpoints de decisão e verificar a jornada | https://github.com/MindHub-DSC/Mindhub/issues/129 | Backlog | @leohsm |
| `SUB-06` | `#130` | [UC21-SUB-06] [C6] Documentar o UC21 e o endpoint | https://github.com/MindHub-DSC/Mindhub/issues/130 | Backlog | @leohsm |

## Vínculos

- As 6 Sub-Issues foram vinculadas ao épico #124 pelo recurso nativo de sub-issues, e os `{{EPIC}}` e `{{SUB-XX}}` dos corpos foram trocados pelos números reais.
- As dependências internas da tabela [01-06](01-06-matriz-dependencias.md) foram registradas como "blocked by". As dependências de outros casos de uso e de decisões `D-...` constam só no texto das issues.

## GitHub Project

- Project: [Planejamento - Mindhub](https://github.com/orgs/MindHub-DSC/projects/1), com os 5 status `Backlog`, `Ready`, `In Progress`, `In Review` e `Done`.
- Todas as 7 issues deste caso de uso foram adicionadas com Status `Backlog`, conforme [01-08](01-08-planejamento-github-project.md). Nenhuma foi fechada ou movida para `In Progress` ou `Done`.

## Labels

- Criadas nesta execução: `usecase:uc21`.
- Reutilizadas: as demais labels do [plano](01-07-plano-labels.md).

## Pendências

- As marcas **[PROP]** e as dúvidas impeditivas ainda não foram confirmadas; nenhuma issue deve ir para `Ready` antes disso.
- A visualização do Project como Board (Kanban) não foi conferida pelo CLI.
