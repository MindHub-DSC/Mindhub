# 01-13 — Execução no GitHub e evidências

**Data e hora da execução:** 10/11/2026 16:26  
**Repositório:** `MindHub-DSC/Mindhub` (https://github.com/MindHub-DSC/Mindhub)  
**Executado por:** GitHub CLI (`gh`) autenticado como `leohsm`, por script que lê `01-03` e `01-04`; cada issue foi criada uma vez.

## Issue principal

- **Número:** #106
- **URL:** https://github.com/MindHub-DSC/Mindhub/issues/106
- **Título:** `[UC18] Suspender Perfil de Especialista`
- **Labels:** `usecase:uc18`, `domain:oferta`, `domain:governanca`, `type:epic`, `priority:medium`
- **Responsável:** @leohsm
- **Estado no board:** `Backlog`

## Sub-Issues

| ID provisório | Número real | Título | URL | Estado no Board | Responsável |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `SUB-01` | `#107` | [UC18-SUB-01] [C2] Implementar a transição de suspensão no Perfil de Especialista | https://github.com/MindHub-DSC/Mindhub/issues/107 | Backlog | @leohsm |
| `SUB-02` | `#108` | [UC18-SUB-02] [C6] Registrar a ação administrativa em C6 | https://github.com/MindHub-DSC/Mindhub/issues/108 | Backlog | @leohsm |
| `SUB-03` | `#109` | [UC18-SUB-03] [C2] Implementar o serviço de aplicação Suspender Perfil | https://github.com/MindHub-DSC/Mindhub/issues/109 | Backlog | @leohsm |
| `SUB-04` | `#110` | [UC18-SUB-04] [C2] Expor o endpoint de suspensão e provar a concorrência com publicação | https://github.com/MindHub-DSC/Mindhub/issues/110 | Backlog | @leohsm |
| `SUB-05` | `#111` | [UC18-SUB-05] [C2] Documentar o UC18 e o endpoint | https://github.com/MindHub-DSC/Mindhub/issues/111 | Backlog | @leohsm |

## Vínculos

- As 5 Sub-Issues foram vinculadas ao épico #106 pelo recurso nativo de sub-issues, e os `{{EPIC}}` e `{{SUB-XX}}` dos corpos foram trocados pelos números reais.
- As dependências internas da tabela [01-06](01-06-matriz-dependencias.md) foram registradas como "blocked by". As dependências de outros casos de uso e de decisões `D-...` constam só no texto das issues.

## GitHub Project

- Project: [Planejamento - Mindhub](https://github.com/orgs/MindHub-DSC/projects/1), com os 5 status `Backlog`, `Ready`, `In Progress`, `In Review` e `Done`.
- Todas as 6 issues deste caso de uso foram adicionadas com Status `Backlog`, conforme [01-08](01-08-planejamento-github-project.md). Nenhuma foi fechada ou movida para `In Progress` ou `Done`.

## Labels

- Criadas nesta execução: `usecase:uc18`, `domain:governanca`.
- Reutilizadas: as demais labels do [plano](01-07-plano-labels.md).

## Pendências

- As marcas **[PROP]** e as dúvidas impeditivas ainda não foram confirmadas; nenhuma issue deve ir para `Ready` antes disso.
- A visualização do Project como Board (Kanban) não foi conferida pelo CLI.
