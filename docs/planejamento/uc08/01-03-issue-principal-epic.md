# 01-03 — Issue principal (Epic)

**Título:** `[UC08] Contratar Serviço de Reserva Direta`  
**Labels:** `usecase:uc08`, `domain:negociacao`, `domain:agenda`, `type:epic`, `priority:medium`  
**Responsável:** @leohsm  
**Estado inicial no board:** `Backlog`

O corpo abaixo, entre os marcadores, é publicado no GitHub. Os marcadores `{{SUB-XX}}` são substituídos pelos números reais após a criação das issues.

<!-- BODY:START -->
## Objetivo

Permitir que o Cliente contrate um Serviço de Reserva Direta em um horário: o sistema verifica o Modelo de Contratação (RN13), forma a Contratação com o snapshot das condições vigentes (RN04) e obtém da Agenda a Reserva `Retida` com prazo, sem criar outra Reserva em repetições.

## Contexto e escopo

- **Contexto responsável:** C3 forma o acordo; C4 retém o horário pelo contrato C01 [T5 §5.3; T4 §8.1].
- **Arquitetura:** C3 conhece C2 apenas pela visão pública do Serviço e C4 apenas pelo contrato C01 (porta de retenção); persistência em memória, como no UC05.
- **Dentro do escopo:** visão pública do Serviço, Contratação de origem Reserva Direta com snapshot, serviço de aplicação com tradução das recusas da Agenda, endpoint HTTP e documentação.
- **Fora do escopo:** a Reserva e suas regras de disponibilidade (UC09, em C4), pagamento (UC10), contratação organizacional por Reserva Direta (não documentada), disponibilidade definida pelo especialista (lacuna), autenticação.

## Referências

- `docs/casos-de-uso.md` — especificação de UC08
- `docs/trabalhos/trabalho3.md` — §5, §6, §8, §9, §10, §11
- `docs/trabalhos/trabalho4.md` — §3.3, §6.1, §6.3, §8.1, §9
- `docs/trabalhos/trabalho5.md` — §3, §5, §8, §9
- `docs/planejamento/uc07/` — modelo de Contratação
- `docs/planejamento/uc08/` — artefatos deste planejamento

## Requisitos contemplados

| ID | Requisito |
| --- | --- |
| RN02 | Confirmação só com intervalo disponível (aplicada pela Agenda). |
| RN03 | Sem Reservas confirmadas sobrepostas (aplicada pela Agenda). |
| RN04 | Condições aceitas são preservadas na Contratação. |
| RN13 | Reserva Direta sem proposta; Sob Proposta com negociação. |
| INV-01 | O fim do intervalo é posterior ao início (verificado pela Agenda). |

**Fluxos:** passo 1 a 7 do fluxo principal; FE-01, FE-02, FE-03, FE-04, FE-05, FE-06.

## Sub-Issues planejadas

- [ ] {{SUB-01}} — [C2] Expor a visão pública do Serviço e suas condições vigentes
- [ ] {{SUB-02}} — [C3] Estender a Contratação com origem Reserva Direta e snapshot das condições
- [ ] {{SUB-03}} — [C3] Implementar o serviço de aplicação Contratar Reserva Direta
- [ ] {{SUB-04}} — [C3] Expor o endpoint de contratação e verificar a jornada de ponta a ponta
- [ ] {{SUB-05}} — [C3] Documentar o UC08 e o endpoint

## Critérios gerais de aceite

- [ ] O Cliente contrata um Serviço de Reserva Direta num horário válido e recebe a Contratação e a Reserva `Retida` com prazo.
- [ ] A Contratação preserva o snapshot das condições vigentes; mudar o Serviço depois não a altera.
- [ ] Serviço Sob Proposta é recusado com orientação para o UC05; horário ocupado e intervalo inválido são recusados com motivo.
- [ ] Repetir a operação com a mesma identificação recupera a Reserva original, sem Reserva nem Contratação duplicada.
- [ ] Retenção recusada depois de formada a Contratação mantém a Contratação e permite escolher outro horário (proposta).
- [ ] Testes do caso de uso e dos casos de uso anteriores passam juntos; `lint` e `build` sem erros.

## Dependências externas e decisões pendentes

- **UC03 — Publicar Serviço:** fornece o Serviço publicado e suas condições; **bloqueia** a SUB-01.
- **UC09 — Agendar Sessão Contratada:** implementa o lado da Agenda do contrato C01 (Reserva `Retida`, RN02, RN03); **bloqueia** as SUB-03 e SUB-04.
- **UC07 — Aceitar Proposta:** define o modelo de Contratação estendido na SUB-02.
- **D1:** origem do identificador do Cliente.
- **D-UC08-01:** Especialista suspenso: o Serviço de Reserva Direta pode ser contratado? T2.1 INV11 dizia que não; T3 não retomou. Nenhuma regra criada.
- **D-UC08-02:** Disponibilidade do especialista além de outras Reservas (lacuna `casos-de-uso.md` §8).
- **D-UC08-03:** O Cliente precisa confirmar o preço vigente antes de contratar? Não documentado; nenhuma etapa criada.
- **D-UC08-04:** Prazo numérico da retenção: definido por C4 (UC09).
- **D-UC08-05:** Contratação organizacional (Representante) por Reserva Direta não é documentada; fora do escopo.
- **D-UC08-08:** Origem do identificador do Cliente (D1).

## Condições de conclusão

O épico é concluído quando todas as Sub-Issues estiverem em `Done`, os critérios gerais estiverem verificados por testes e as decisões D-UC08-01, D-UC08-04, D-UC08-07 e D-UC08-08 estiverem registradas.
<!-- BODY:END -->
