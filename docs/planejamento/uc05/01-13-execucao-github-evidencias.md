# 01-13 — Evidências da execução no GitHub

**Caso de uso:** UC05 — Enviar Solicitação de Atendimento
**Data da execução:** 10/11/2026, por volta de 15h (horário local)
**Repositório:** [MindHub-DSC/Mindhub](https://github.com/MindHub-DSC/Mindhub)
**Executado por:** GitHub CLI autenticado como @leohsm, com confirmação do estudante, por script que lê os artefatos [01-03](01-03-issue-principal-epic.md) e [01-04](01-04-sub-issues.md)
**Issue principal:** [#10 — [UC05] Enviar Solicitação de Atendimento](https://github.com/MindHub-DSC/Mindhub/issues/10)
**GitHub Project:** [Planejamento - Mindhub](https://github.com/orgs/MindHub-DSC/projects/1)

## Sub-Issues criadas

Todas foram vinculadas ao épico como sub-issues nativas do GitHub (7 de 7).

| ID provisório | Número real | Título | URL | Estado no board | Responsável |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `SUB-01` | `#11` | [UC05-SUB-01] Expor visão pública de habilitação do especialista (C2) | https://github.com/MindHub-DSC/Mindhub/issues/11 | `Backlog` | @leohsm |
| `SUB-02` | `#12` | [UC05-SUB-02] Modelar Solicitação e implementar persistência em memória | https://github.com/MindHub-DSC/Mindhub/issues/12 | `Backlog` | @leohsm |
| `SUB-03` | `#13` | [UC05-SUB-03] Definir porta de aviso ao especialista com falha tolerada | https://github.com/MindHub-DSC/Mindhub/issues/13 | `Backlog` | @leohsm |
| `SUB-04` | `#14` | [UC05-SUB-04] Implementar serviço de aplicação Enviar Solicitação | https://github.com/MindHub-DSC/Mindhub/issues/14 | `Backlog` | @leohsm |
| `SUB-05` | `#15` | [UC05-SUB-05] Expor endpoint HTTP e integrar C1, C2 e C3 com testes de ponta a ponta | https://github.com/MindHub-DSC/Mindhub/issues/15 | `Backlog` | @leohsm |
| `SUB-06` | `#16` | [UC05-SUB-06] Estender o envio para Serviço indicado (RN13) | https://github.com/MindHub-DSC/Mindhub/issues/16 | `Backlog` | @leohsm |
| `SUB-07` | `#17` | [UC05-SUB-07] Documentar o UC05 e o endpoint | https://github.com/MindHub-DSC/Mindhub/issues/17 | `Backlog` | @leohsm |

## Rastreabilidade registrada

- O corpo do épico lista as Sub-Issues com os números reais; os tokens `{{SUB-XX}}` foram substituídos numa segunda passada (`gh issue edit --body-file`). Nenhum token restou (verificado após a execução).
- Cada Sub-Issue referencia o épico (`Relacionada ao Épico #10`) e as demais pelo número real.
- As Sub-Issues referenciam issues do UC02 pelos números reais (#2, #3, #6) e são referenciadas pelo UC07 (#22 e #23 dependem de #12, #13 e #15).

### Dependências "blocked by"

- #11 (SUB-01) — blocked by #3
- #14 (SUB-04) — blocked by #2, #11, #12, #13
- #15 (SUB-05) — blocked by #6, #14
- #16 (SUB-06) — blocked by #15
- #17 (SUB-07) — blocked by #15

## Labels

`usecase:uc05`, `domain:negociacao`, `layer:adapter` (novas); `domain:oferta`, `type:epic`, `type:feature`, `type:docs`, `layer:domain`, `layer:application`, `layer:repository`, `layer:api`, `layer:integration`, `priority:high`, `priority:medium`, `priority:low` (reutilizadas).

## GitHub Project

- Project `Planejamento - Mindhub` (número 1) criado na organização `MindHub-DSC` e vinculado ao repositório, depois de `gh auth refresh -h github.com -s project`.
- Campo **Status** reconfigurado com exatamente `Backlog`, `Ready`, `In Progress`, `In Review` e `Done` (as opções padrão `Todo`, `In Progress` e `Done` foram substituídas).
- Épico e Sub-Issues adicionados com Status `Backlog`. O board também contém as issues dos demais casos de uso (#1 a #8 e #10 a #33, 32 itens).
- **Pendente (manual):** a API do GitHub não cria visualizações. A visualização padrão é tabela; para o Kanban, abrir o Project e mudar o layout para **Board**, agrupado por Status.

## Versionamento

Os documentos de `docs/planejamento/` não foram commitados nesta execução.
