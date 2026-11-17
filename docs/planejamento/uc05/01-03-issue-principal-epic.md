# 01-03 — Issue principal (Epic)

**Título:** `[UC05] Enviar Solicitação de Atendimento`
**Labels:** `usecase:uc05`, `domain:negociacao`, `type:epic`, `priority:high`
**Responsável:** @leohsm
**Estado inicial no board:** `Backlog`

O corpo abaixo, entre os marcadores, é publicado no GitHub. Os marcadores `{{SUB-XX}}` são substituídos pelos números reais após a criação das Sub-Issues.

<!-- BODY:START -->
## Objetivo

Permitir que um Cliente leve sua necessidade (Objetivo e Escopo) a um especialista escolhido, registrando uma Solicitação `Enviada` para que o especialista possa propor condições.

## Contexto e escopo

- **Contexto responsável:** C3 — Negociação e Contratação, consultando C1 (reconhecimento do cliente) e C2 (habilitação do especialista e, depois do UC03, o modelo do Serviço).
- **Arquitetura:** monólito modular (ADR-01), verificações síncronas (ADR-03), interfaces por propósito (ADR-04).
- **Dentro do escopo:** reconhecimento do cliente, verificação de RN01, registro da Solicitação, aviso ao especialista com falha tolerada, interface HTTP e, em extensão própria, a verificação de RN13 para Serviço indicado.
- **Fora do escopo:** variação do Representante (RN11), reentrega automática do aviso, consulta de solicitações recebidas, envio de proposta (UC06), autenticação e banco de dados.

## Referências

- `docs/trabalhos/trabalho5.md` — §6.2 (especificação do UC05), §8 (dependências), §9 (MVP), §26 (dúvidas)
- `docs/trabalhos/trabalho3.md` — §8 (cardinalidades), §9 (RN01, RN11, RN13)
- `docs/trabalhos/trabalho4.md` — §3.3 (C3), §6.1 (R2), §7, §12.4 (ADR-04), §13.4.1
- `docs/planejamento/uc05/` — análise técnica e artefatos deste planejamento

## Requisitos contemplados

| ID | Requisito |
| --- | --- |
| RN01 | Somente perfil de especialista ativo recebe novas solicitações |
| RN13 | Serviço indicado precisa ser Sob Proposta; Reserva Direta segue o UC08 |
| CARD-02 | A Solicitação é direcionada a um único especialista |
| POS-01 | Solicitação `Enviada` com Objetivo e Escopo |
| POS-02 | O especialista é avisado; falha do aviso não desfaz a solicitação (FA-02) |
| FE-01..03 | Especialista suspenso, especialista ou serviço inexistente, serviço de Reserva Direta |

## Sub-Issues planejadas

- [ ] {{SUB-01}} — Expor visão pública de habilitação do especialista (C2)
- [ ] {{SUB-02}} — Modelar Solicitação e implementar persistência em memória
- [ ] {{SUB-03}} — Definir porta de aviso ao especialista com falha tolerada
- [ ] {{SUB-04}} — Implementar serviço de aplicação Enviar Solicitação
- [ ] {{SUB-05}} — Expor endpoint HTTP e integrar C1, C2 e C3 com testes de ponta a ponta
- [ ] {{SUB-06}} — Estender o envio para Serviço indicado (RN13)
- [ ] {{SUB-07}} — Documentar o UC05 e o endpoint

## Critérios gerais de aceite

- [ ] Um cliente cadastrado envia uma solicitação a um especialista ativo e recebe a Solicitação `ENVIADA`.
- [ ] Solicitação para especialista suspenso é recusada e nada é registrado.
- [ ] Solicitação para especialista inexistente, ou de cliente não reconhecido, é recusada e nada é registrado.
- [ ] Objetivo ou Escopo vazio, ou campo não previsto, é recusado.
- [ ] Uma falha no aviso ao especialista não desfaz a solicitação e fica registrada como pendente.
- [ ] Com Serviço indicado: Sob Proposta é aceito; Reserva Direta é recusado com orientação ao UC08.
- [ ] C3 não importa classes internas de C1 nem de C2.
- [ ] Testes de UC01, UC02 e UC05 passam juntos; lint e build sem erros.

## Dependências externas e decisões pendentes

- **UC02 (#1):** a visão de habilitação depende do perfil e do repositório de C2 (#3). O reconhecimento do cliente reutiliza a porta de C1 (#2).
- **UC03 — Publicar Serviço:** ainda não especificado nem planejado. Bloqueia apenas a {{SUB-06}}.
- **D1 — Origem da identidade do agente:** pendente (mesma decisão do UC02, #6). Afeta a {{SUB-05}}.
- **D-UC05-01:** variação do Representante (RN11) fora deste épico, porque UC16/UC17 estão fora do MVP. Precisa de confirmação.
- **D-UC05-03:** limite máximo de Objetivo e Escopo não documentado. Afeta a {{SUB-02}}.
- **D-UC05-04:** dúvida aberta — o cliente pode solicitar ao próprio perfil? Nenhuma regra será implementada sem decisão.

## Condições de conclusão

O épico é concluído quando todas as Sub-Issues estiverem em `Done`, os critérios gerais estiverem verificados por testes e as decisões D1 e D-UC05-03 estiverem registradas nas Sub-Issues afetadas.
<!-- BODY:END -->
