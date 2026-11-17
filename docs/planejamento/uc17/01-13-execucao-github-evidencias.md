# 01-13 — Execução no GitHub e evidências

**Data e hora da execução:** 10/11/2026 16:26  
**Repositório:** `MindHub-DSC/Mindhub` (https://github.com/MindHub-DSC/Mindhub)  
**Executado por:** GitHub CLI (`gh`) autenticado como `leohsm`, por script que lê `01-03` e `01-04`; cada issue foi criada uma vez.

## Issue principal

- **Número:** #100
- **URL:** https://github.com/MindHub-DSC/Mindhub/issues/100
- **Título:** `[UC17] Vincular Membro à Organização`
- **Labels:** `usecase:uc17`, `domain:identidade`, `type:epic`, `priority:medium`
- **Responsável:** @leohsm
- **Estado no board:** `Backlog`

## Sub-Issues

| ID provisório | Número real | Título | URL | Estado no Board | Responsável |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `SUB-01` | `#101` | [UC17-SUB-01] [C1] Estender o Vínculo Organizacional com papéis de membro | https://github.com/MindHub-DSC/Mindhub/issues/101 | Backlog | @leohsm |
| `SUB-02` | `#102` | [UC17-SUB-02] [C1] Verificar o vínculo do Representante no instante da operação | https://github.com/MindHub-DSC/Mindhub/issues/102 | Backlog | @leohsm |
| `SUB-03` | `#103` | [UC17-SUB-03] [C1] Implementar o serviço de aplicação Vincular Membro | https://github.com/MindHub-DSC/Mindhub/issues/103 | Backlog | @leohsm |
| `SUB-04` | `#104` | [UC17-SUB-04] [C1] Expor o endpoint de vínculo e verificar a jornada | https://github.com/MindHub-DSC/Mindhub/issues/104 | Backlog | @leohsm |
| `SUB-05` | `#105` | [UC17-SUB-05] [C1] Documentar o UC17 e o endpoint | https://github.com/MindHub-DSC/Mindhub/issues/105 | Backlog | @leohsm |

## Vínculos

- As 5 Sub-Issues foram vinculadas ao épico #100 pelo recurso nativo de sub-issues, e os `{{EPIC}}` e `{{SUB-XX}}` dos corpos foram trocados pelos números reais.
- As dependências internas da tabela [01-06](01-06-matriz-dependencias.md) foram registradas como "blocked by". As dependências de outros casos de uso e de decisões `D-...` constam só no texto das issues.

## GitHub Project

- Project: [Planejamento - Mindhub](https://github.com/orgs/MindHub-DSC/projects/1), com os 5 status `Backlog`, `Ready`, `In Progress`, `In Review` e `Done`.
- Todas as 6 issues deste caso de uso foram adicionadas com Status `Backlog`, conforme [01-08](01-08-planejamento-github-project.md). Nenhuma foi fechada ou movida para `In Progress` ou `Done`.

## Labels

- Criadas nesta execução: `usecase:uc17`.
- Reutilizadas: as demais labels do [plano](01-07-plano-labels.md).

## Pendências

- As marcas **[PROP]** e as dúvidas impeditivas ainda não foram confirmadas; nenhuma issue deve ir para `Ready` antes disso.
- A visualização do Project como Board (Kanban) não foi conferida pelo CLI.
