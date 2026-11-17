# 01-03 — Issue principal (Epic)

**Título:** `[UC09] Agendar Sessão Contratada`  
**Labels:** `usecase:uc09`, `domain:agenda`, `domain:negociacao`, `type:epic`, `priority:high`  
**Responsável:** @leohsm  
**Estado inicial no board:** `Backlog`

O corpo abaixo, entre os marcadores, é publicado no GitHub. Os marcadores `{{SUB-XX}}` são substituídos pelos números reais após a criação das issues.

<!-- BODY:START -->
## Objetivo

Permitir que o Cliente de uma Contratação formada escolha um intervalo e obtenha uma Reserva `Retida` com limite de validade, sem que dois pedidos incompatíveis para o mesmo especialista recebam retenção válida e sem que a repetição de um pedido crie outra Reserva. A retenção que vence é liberada por política de domínio. Este épico fornece a Reserva consumida pelo UC10.

## Contexto e escopo

- **Contexto responsável:** C4 — Agenda e Atendimento, chamado por C3 pelo contrato C01 [T4 §6.3, §8.1].
- **Arquitetura:** monólito modular; C3 só pede a retenção pela porta pública de C4; a verificação de disponibilidade e a gravação são atômicas (`trabalho4.md` §8.1.4); persistência em memória neste momento.
- **Dentro do escopo:** Agregado Reserva, repositório com disponibilidade atômica e idempotência, serviço público do contrato C01, serviço de C3 que o chama, liberação por expiração, endpoint HTTP e documentação.
- **Fora do escopo:** pagamento e confirmação da Reserva (UC10), reagendamento (UC11), cancelamento (UC12), definição de disponibilidade do especialista (lacuna), pacotes com várias sessões (D-UC09-01), contratação organizacional (RN11), persistência durável.

## Referências

- `docs/casos-de-uso.md` — especificação de UC09
- `docs/trabalhos/trabalho3.md` — §5, §6, §7, §8, §9, §10, §11
- `docs/trabalhos/trabalho4.md` — §3.4, §6.3, §8.1, §9 (TC-C4-01, TC-C4-02)
- `docs/trabalhos/trabalho5.md` — §3, §5, §8, §9
- `docs/planejamento/uc10/` — consumidor da Reserva
- `docs/planejamento/uc09/` — artefatos deste planejamento

## Requisitos contemplados

| ID | Requisito |
| --- | --- |
| RN02 | Confirmação só com intervalo disponível. |
| RN03 | Sem Reservas sobrepostas para o mesmo especialista. |
| RN08 | Expiração libera a retenção. |
| RN11 | Em contratação organizacional, o sistema verifica o vínculo. |
| INV-01 | O fim do intervalo é posterior ao início. |

**Fluxos:** passo 1 a 6 do fluxo principal; FA-01, FA-02, FE-01, FE-02, FE-03, FE-04, FE-05, FE-06, FE-07.

## Sub-Issues planejadas

- [ ] {{SUB-01}} — [C4] Modelar a Reserva, o Intervalo de Tempo e o ciclo da retenção
- [ ] {{SUB-02}} — [C4] Registrar a retenção de forma atômica e idempotente no repositório
- [ ] {{SUB-03}} — [C4] Implementar o contrato C01 (porta pública de retenção de horário)
- [ ] {{SUB-04}} — [C3] Implementar o serviço de C3 Agendar Sessão Contratada
- [ ] {{SUB-05}} — [C4] Liberar a retenção expirada por tempo
- [ ] {{SUB-06}} — [C3] Expor o endpoint de agendamento e verificar a concorrência de ponta a ponta
- [ ] {{SUB-07}} — [C4] Documentar o UC09 e o endpoint

## Critérios gerais de aceite

- [ ] O Cliente da Contratação escolhe um intervalo válido e recebe uma Reserva `Retida` com intervalo e limite de validade.
- [ ] Dois pedidos concorrentes para intervalos incompatíveis do mesmo especialista: só um recebe retenção válida (TC-C4-01).
- [ ] Repetir a mesma identificação com os mesmos dados devolve a mesma Reserva; com outro intervalo, recusa por conflito.
- [ ] Intervalo inválido, duração incompatível, horário ocupado e ator que não é o cliente são recusados sem registro.
- [ ] A retenção vencida é liberada uma só vez e o horário volta a ficar disponível.
- [ ] A Reserva carrega prazo, valor esperado e espaço para a correlação do Pagamento (consumido pelo UC10).
- [ ] Testes do caso de uso e dos casos de uso anteriores passam juntos; `lint` e `build` sem erros.

## Dependências externas e decisões pendentes

- **UC07 — Aceitar Proposta:** fornece a Contratação formada; **bloqueia** a SUB-04.
- **UC10 — Pagar Reserva:** já planejado (#25); depende desta Reserva (#28, #31, #32).
- **UC08:** consome o mesmo contrato C01 (porta `RetencaoDeHorario`, definida na SUB-03).
- **D-UC09-02:** a disponibilidade do especialista além de outras Reservas não está definida.
- **D-UC09-01:** Pacotes: quando a Contratação prevê várias sessões, uma Reserva por sessão ou várias de uma vez? Este planejamento trata uma Reserva por chamada.
- **D-UC09-02:** Disponibilidade do especialista: o que torna um horário disponível além de não colidir com outras Reservas (lacuna `casos-de-uso.md` §8)?
- **D-UC09-03:** Intervalo de preparação entre sessões: precisa de validação do domínio. Não implementado.
- **D-UC09-04:** Prazo numérico da retenção e prazo de histórico das operações. Proposta: valor configurável.
- **D-UC09-05:** Exclusividade das retenções (não só das confirmadas): hipótese de T4 §8.1.4 que complementa RN03.
- **D-UC09-09:** Origem do identificador do Cliente (D1).

## Condições de conclusão

O épico é concluído quando todas as Sub-Issues estiverem em `Done`, os critérios gerais estiverem verificados por testes (incluindo concorrência e repetição) e as decisões D-UC09-01, D-UC09-02, D-UC09-04 e D-UC09-07 estiverem registradas. O UC10 só pode iniciar as SUB-03, SUB-06 e SUB-07 depois das SUB-01 a SUB-03 e SUB-05.
<!-- BODY:END -->
