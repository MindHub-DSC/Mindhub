# 01-13 — Evidências da execução no GitHub

**Caso de uso:** UC10 — Pagar Reserva
**Data da execução:** 10/11/2026, por volta de 15h (horário local)
**Repositório:** [MindHub-DSC/Mindhub](https://github.com/MindHub-DSC/Mindhub)
**Executado por:** GitHub CLI autenticado como @leohsm, com confirmação do estudante, por script que lê os artefatos [01-03](01-03-issue-principal-epic.md) e [01-04](01-04-sub-issues.md)
**Issue principal:** [#25 — [UC10] Pagar Reserva](https://github.com/MindHub-DSC/Mindhub/issues/25)
**GitHub Project:** [Planejamento - Mindhub](https://github.com/orgs/MindHub-DSC/projects/1)

## Sub-Issues criadas

Todas foram vinculadas ao épico como sub-issues nativas do GitHub (8 de 8).

| ID provisório | Número real | Título | URL | Estado no board | Responsável |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `SUB-01` | `#26` | [UC10-SUB-01] [C5] Modelar Pagamento e seu ciclo de vida com persistência em memória | https://github.com/MindHub-DSC/Mindhub/issues/26 | `Backlog` | @leohsm |
| `SUB-02` | `#27` | [UC10-SUB-02] [C5] Definir porta do Provedor de pagamento e adaptador simulado | https://github.com/MindHub-DSC/Mindhub/issues/27 | `Backlog` | @leohsm |
| `SUB-03` | `#28` | [UC10-SUB-03] [C4] Expor visão da Reserva retida e registrar a correlação do Pagamento | https://github.com/MindHub-DSC/Mindhub/issues/28 | `Backlog` | @leohsm |
| `SUB-04` | `#29` | [UC10-SUB-04] [C5] Implementar serviço Solicitar Pagamento | https://github.com/MindHub-DSC/Mindhub/issues/29 | `Backlog` | @leohsm |
| `SUB-05` | `#30` | [UC10-SUB-05] [C5] Processar o resultado do Provedor e publicar "Pagamento Decidido" | https://github.com/MindHub-DSC/Mindhub/issues/30 | `Backlog` | @leohsm |
| `SUB-06` | `#31` | [UC10-SUB-06] [C4] Aplicar "Pagamento Decidido" na Reserva | https://github.com/MindHub-DSC/Mindhub/issues/31 | `Backlog` | @leohsm |
| `SUB-07` | `#32` | [UC10-SUB-07] Expor endpoints HTTP e integrar C4 e C5 de ponta a ponta | https://github.com/MindHub-DSC/Mindhub/issues/32 | `Backlog` | @leohsm |
| `SUB-08` | `#33` | [UC10-SUB-08] Documentar o UC10 e os endpoints | https://github.com/MindHub-DSC/Mindhub/issues/33 | `Backlog` | @leohsm |

## Rastreabilidade registrada

- O corpo do épico lista as Sub-Issues com os números reais; os tokens `{{SUB-XX}}` foram substituídos numa segunda passada (`gh issue edit --body-file`). Nenhum token restou (verificado após a execução).
- Cada Sub-Issue referencia o épico (`Relacionada ao Épico #25`) e as demais pelo número real.
- A dependência do UC09 (não planejado) não tem issue; está registrada no texto do épico e das Sub-Issues #28, #31 e #32.

### Dependências "blocked by"

- #27 (SUB-02) — blocked by #26
- #29 (SUB-04) — blocked by #26, #27, #28
- #30 (SUB-05) — blocked by #26, #27
- #31 (SUB-06) — blocked by #28, #30
- #32 (SUB-07) — blocked by #23, #29, #30, #31
- #33 (SUB-08) — blocked by #32

## Labels

`usecase:uc10`, `domain:pagamentos`, `domain:agenda` (novas); `layer:adapter` (criada no UC05); `type:epic`, `type:feature`, `type:docs`, `layer:domain`, `layer:repository`, `layer:application`, `layer:api`, `layer:integration`, `priority:high`, `priority:medium`, `priority:low` (reutilizadas).

## GitHub Project

- Project `Planejamento - Mindhub` (número 1) criado na organização `MindHub-DSC` e vinculado ao repositório, depois de `gh auth refresh -h github.com -s project`.
- Campo **Status** reconfigurado com exatamente `Backlog`, `Ready`, `In Progress`, `In Review` e `Done` (as opções padrão `Todo`, `In Progress` e `Done` foram substituídas).
- Épico e Sub-Issues adicionados com Status `Backlog`. O board também contém as issues dos demais casos de uso (#1 a #8 e #10 a #33, 32 itens).
- **Pendente (manual):** a API do GitHub não cria visualizações. A visualização padrão é tabela; para o Kanban, abrir o Project e mudar o layout para **Board**, agrupado por Status.

## Versionamento

Os documentos de `docs/planejamento/` não foram commitados nesta execução.
