# 01-13 — Execução no GitHub e evidências

**Data e hora da execução:** 10/11/2026 16:26  
**Repositório:** `MindHub-DSC/Mindhub` (https://github.com/MindHub-DSC/Mindhub)  
**Executado por:** GitHub CLI (`gh`) autenticado como `leohsm`, por script que lê `01-03` e `01-04`; cada issue foi criada uma vez.

## Issue principal

- **Número:** #61
- **URL:** https://github.com/MindHub-DSC/Mindhub/issues/61
- **Título:** `[UC09] Agendar Sessão Contratada`
- **Labels:** `usecase:uc09`, `domain:agenda`, `domain:negociacao`, `type:epic`, `priority:high`
- **Responsável:** @leohsm
- **Estado no board:** `Backlog`

## Sub-Issues

| ID provisório | Número real | Título | URL | Estado no Board | Responsável |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `SUB-01` | `#62` | [UC09-SUB-01] [C4] Modelar a Reserva, o Intervalo de Tempo e o ciclo da retenção | https://github.com/MindHub-DSC/Mindhub/issues/62 | Backlog | @leohsm |
| `SUB-02` | `#63` | [UC09-SUB-02] [C4] Registrar a retenção de forma atômica e idempotente no repositório | https://github.com/MindHub-DSC/Mindhub/issues/63 | Backlog | @leohsm |
| `SUB-03` | `#64` | [UC09-SUB-03] [C4] Implementar o contrato C01 (porta pública de retenção de horário) | https://github.com/MindHub-DSC/Mindhub/issues/64 | Backlog | @leohsm |
| `SUB-04` | `#65` | [UC09-SUB-04] [C3] Implementar o serviço de C3 Agendar Sessão Contratada | https://github.com/MindHub-DSC/Mindhub/issues/65 | Backlog | @leohsm |
| `SUB-05` | `#66` | [UC09-SUB-05] [C4] Liberar a retenção expirada por tempo | https://github.com/MindHub-DSC/Mindhub/issues/66 | Backlog | @leohsm |
| `SUB-06` | `#67` | [UC09-SUB-06] [C3] Expor o endpoint de agendamento e verificar a concorrência de ponta a ponta | https://github.com/MindHub-DSC/Mindhub/issues/67 | Backlog | @leohsm |
| `SUB-07` | `#68` | [UC09-SUB-07] [C4] Documentar o UC09 e o endpoint | https://github.com/MindHub-DSC/Mindhub/issues/68 | Backlog | @leohsm |

## Vínculos

- As 7 Sub-Issues foram vinculadas ao épico #61 pelo recurso nativo de sub-issues, e os `{{EPIC}}` e `{{SUB-XX}}` dos corpos foram trocados pelos números reais.
- As dependências internas da tabela [01-06](01-06-matriz-dependencias.md) foram registradas como "blocked by". As dependências de outros casos de uso e de decisões `D-...` constam só no texto das issues.

## GitHub Project

- Project: [Planejamento - Mindhub](https://github.com/orgs/MindHub-DSC/projects/1), com os 5 status `Backlog`, `Ready`, `In Progress`, `In Review` e `Done`.
- Todas as 8 issues deste caso de uso foram adicionadas com Status `Backlog`, conforme [01-08](01-08-planejamento-github-project.md). Nenhuma foi fechada ou movida para `In Progress` ou `Done`.

## Labels

- Criadas nesta execução: `usecase:uc09`.
- Reutilizadas: as demais labels do [plano](01-07-plano-labels.md).

## Pendências

- As marcas **[PROP]** e as dúvidas impeditivas ainda não foram confirmadas; nenhuma issue deve ir para `Ready` antes disso.
- A visualização do Project como Board (Kanban) não foi conferida pelo CLI.
