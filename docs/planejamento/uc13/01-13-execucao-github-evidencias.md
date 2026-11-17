# 01-13 — Execução no GitHub e evidências

**Data e hora da execução:** 10/11/2026 16:26  
**Repositório:** `MindHub-DSC/Mindhub` (https://github.com/MindHub-DSC/Mindhub)  
**Executado por:** GitHub CLI (`gh`) autenticado como `leohsm`, por script que lê `01-03` e `01-04`; cada issue foi criada uma vez.

## Issue principal

- **Número:** #75
- **URL:** https://github.com/MindHub-DSC/Mindhub/issues/75
- **Título:** `[UC13] Realizar Sessão`
- **Labels:** `usecase:uc13`, `domain:agenda`, `type:epic`, `priority:high`
- **Responsável:** @leohsm
- **Estado no board:** `Backlog`

## Sub-Issues

| ID provisório | Número real | Título | URL | Estado no Board | Responsável |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `SUB-01` | `#76` | [UC13-SUB-01] [C4] Modelar a Sessão, a Participação e o ciclo de vida | https://github.com/MindHub-DSC/Mindhub/issues/76 | Backlog | @leohsm |
| `SUB-02` | `#77` | [UC13-SUB-02] [C4] Criar a Sessão  | https://github.com/MindHub-DSC/Mindhub/issues/77 | Backlog | @leohsm |
| `SUB-03` | `#78` | [UC13-SUB-03] [C4] Definir a porta do Serviço de videoconferência e o adaptador simulado | https://github.com/MindHub-DSC/Mindhub/issues/78 | Backlog | @leohsm |
| `SUB-04` | `#79` | [UC13-SUB-04] [C4] Implementar o serviço de aplicação Iniciar e Concluir Sessão | https://github.com/MindHub-DSC/Mindhub/issues/79 | Backlog | @leohsm |
| `SUB-05` | `#80` | [UC13-SUB-05] [C4] Expor os endpoints de início e conclusão e verificar a jornada | https://github.com/MindHub-DSC/Mindhub/issues/80 | Backlog | @leohsm |
| `SUB-06` | `#81` | [UC13-SUB-06] [C4] Documentar o UC13 e o endpoint | https://github.com/MindHub-DSC/Mindhub/issues/81 | Backlog | @leohsm |

## Vínculos

- As 6 Sub-Issues foram vinculadas ao épico #75 pelo recurso nativo de sub-issues, e os `{{EPIC}}` e `{{SUB-XX}}` dos corpos foram trocados pelos números reais.
- As dependências internas da tabela [01-06](01-06-matriz-dependencias.md) foram registradas como "blocked by". As dependências de outros casos de uso e de decisões `D-...` constam só no texto das issues.

## GitHub Project

- Project: [Planejamento - Mindhub](https://github.com/orgs/MindHub-DSC/projects/1), com os 5 status `Backlog`, `Ready`, `In Progress`, `In Review` e `Done`.
- Todas as 7 issues deste caso de uso foram adicionadas com Status `Backlog`, conforme [01-08](01-08-planejamento-github-project.md). Nenhuma foi fechada ou movida para `In Progress` ou `Done`.

## Labels

- Criadas nesta execução: `usecase:uc13`.
- Reutilizadas: as demais labels do [plano](01-07-plano-labels.md).

## Pendências

- As marcas **[PROP]** e as dúvidas impeditivas ainda não foram confirmadas; nenhuma issue deve ir para `Ready` antes disso.
- A visualização do Project como Board (Kanban) não foi conferida pelo CLI.
