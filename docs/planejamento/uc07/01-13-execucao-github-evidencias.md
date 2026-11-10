# 01-13 — Evidências da execução no GitHub

**Caso de uso:** UC07 — Aceitar Proposta
**Data da execução:** 10/11/2026, por volta de 15h (horário local)
**Repositório:** [MindHub-DSC/Mindhub](https://github.com/MindHub-DSC/Mindhub)
**Executado por:** GitHub CLI autenticado como @leohsm, com confirmação do estudante, por script que lê os artefatos [01-03](01-03-issue-principal-epic.md) e [01-04](01-04-sub-issues.md)
**Issue principal:** [#18 — [UC07] Aceitar Proposta](https://github.com/MindHub-DSC/Mindhub/issues/18)
**GitHub Project:** [Planejamento - Mindhub](https://github.com/orgs/MindHub-DSC/projects/1)

## Sub-Issues criadas

Todas foram vinculadas ao épico como sub-issues nativas do GitHub (6 de 6).

| ID provisório | Número real | Título | URL | Estado no board | Responsável |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `SUB-01` | `#19` | [UC07-SUB-01] Implementar o aceite no Agregado Proposta | https://github.com/MindHub-DSC/Mindhub/issues/19 | `Backlog` | @leohsm |
| `SUB-02` | `#20` | [UC07-SUB-02] Modelar Contratação Sob Proposta com snapshot imutável | https://github.com/MindHub-DSC/Mindhub/issues/20 | `Backlog` | @leohsm |
| `SUB-03` | `#21` | [UC07-SUB-03] Registrar aceite e Contratação na mesma unidade de consistência | https://github.com/MindHub-DSC/Mindhub/issues/21 | `Backlog` | @leohsm |
| `SUB-04` | `#22` | [UC07-SUB-04] Implementar serviço de aplicação Aceitar Proposta | https://github.com/MindHub-DSC/Mindhub/issues/22 | `Backlog` | @leohsm |
| `SUB-05` | `#23` | [UC07-SUB-05] Expor endpoints HTTP e verificar o aceite de ponta a ponta | https://github.com/MindHub-DSC/Mindhub/issues/23 | `Backlog` | @leohsm |
| `SUB-06` | `#24` | [UC07-SUB-06] Documentar o UC07 e os endpoints | https://github.com/MindHub-DSC/Mindhub/issues/24 | `Backlog` | @leohsm |

## Rastreabilidade registrada

- O corpo do épico lista as Sub-Issues com os números reais; os tokens `{{SUB-XX}}` foram substituídos numa segunda passada (`gh issue edit --body-file`). Nenhum token restou (verificado após a execução).
- Cada Sub-Issue referencia o épico (`Relacionada ao Épico #18`) e as demais pelo número real.
- A dependência do UC06 (não planejado) não tem issue; está registrada no texto do épico e das Sub-Issues #19, #20, #21 e #23.

### Dependências "blocked by"

- #21 (SUB-03) — blocked by #19, #20
- #22 (SUB-04) — blocked by #12, #13, #19, #20, #21
- #23 (SUB-05) — blocked by #15, #22
- #24 (SUB-06) — blocked by #23

## Labels

`usecase:uc07` (nova); `domain:negociacao` (criada no UC05); `type:epic`, `type:feature`, `type:docs`, `layer:domain`, `layer:repository`, `layer:application`, `layer:api`, `layer:integration`, `priority:high`, `priority:medium`, `priority:low` (reutilizadas).

## GitHub Project

- Project `Planejamento - Mindhub` (número 1) criado na organização `MindHub-DSC` e vinculado ao repositório, depois de `gh auth refresh -h github.com -s project`.
- Campo **Status** reconfigurado com exatamente `Backlog`, `Ready`, `In Progress`, `In Review` e `Done` (as opções padrão `Todo`, `In Progress` e `Done` foram substituídas).
- Épico e Sub-Issues adicionados com Status `Backlog`. O board também contém as issues dos demais casos de uso (#1 a #8 e #10 a #33, 32 itens).
- **Pendente (manual):** a API do GitHub não cria visualizações. A visualização padrão é tabela; para o Kanban, abrir o Project e mudar o layout para **Board**, agrupado por Status.

## Versionamento

Os documentos de `docs/planejamento/` não foram commitados nesta execução.
