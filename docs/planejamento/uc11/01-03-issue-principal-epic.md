# 01-03 — Issue principal (Epic)

**Título:** `[UC11] Reagendar Sessão`  
**Labels:** `usecase:uc11`, `domain:agenda`, `type:epic`, `priority:medium`  
**Responsável:** @leohsm  
**Estado inicial no board:** `Backlog`

O corpo abaixo, entre os marcadores, é publicado no GitHub. Os marcadores `{{SUB-XX}}` são substituídos pelos números reais após a criação das issues.

<!-- BODY:START -->
## Objetivo

Permitir que uma das partes da Contratação mude o intervalo de uma Reserva `Confirmada` para outro intervalo disponível, mantendo a Reserva e sua identidade; um novo intervalo ocupado ou inválido deixa a Reserva intacta e dois reagendamentos concorrentes nunca resultam em sobreposição.

## Contexto e escopo

- **Contexto responsável:** C4 — Agenda e Atendimento.
- **Arquitetura:** estende o Agregado Reserva e o repositório atômico do UC09; a autorização é pela relação do ator com a Contratação [PROP, T1 §2].
- **Dentro do escopo:** operação de reagendamento, troca atômica no repositório, serviço de aplicação, aviso às partes, endpoint HTTP e documentação.
- **Fora do escopo:** concordância da outra parte, antecedência mínima e limite de reagendamentos (não documentados), efeito sobre a Sessão `Programada` (D-UC11-03), cancelamento (UC12), persistência durável.

## Referências

- `docs/casos-de-uso.md` — especificação de UC11
- `docs/trabalhos/trabalho3.md` — §5, §6, §7, §8, §9, §10, §11
- `docs/trabalhos/trabalho4.md` — §3.4, §6.3, §8.1, §9 (TC-C4-01, TC-C4-02)
- `docs/trabalhos/trabalho5.md` — §3, §5, §8, §9
- `docs/planejamento/uc09/` e `docs/planejamento/uc10/` — Reserva e confirmação
- `docs/planejamento/uc11/` — artefatos deste planejamento

## Requisitos contemplados

| ID | Requisito |
| --- | --- |
| RN02 | Confirmação só com intervalo disponível. |
| RN03 | Sem Reservas confirmadas sobrepostas. |
| RN14 | Reagendamento só com disponibilidade. |

**Fluxos:** passo 1 a 5 do fluxo principal; FE-01, FE-02, FE-03, FE-04, FE-05.

## Sub-Issues planejadas

- [ ] {{SUB-01}} — [C4] Implementar a operação de reagendamento na Reserva
- [ ] {{SUB-02}} — [C4] Trocar o intervalo de forma atômica no repositório
- [ ] {{SUB-03}} — [C4] Implementar o serviço de aplicação Reagendar Sessão
- [ ] {{SUB-04}} — [C4] Expor o endpoint de reagendamento e verificar a concorrência
- [ ] {{SUB-05}} — [C4] Documentar o UC11 e o endpoint

## Critérios gerais de aceite

- [ ] O cliente ou o especialista da Contratação reagenda uma Reserva `Confirmada` para um intervalo livre; a Reserva continua `Confirmada` e mantém a identidade.
- [ ] Novo intervalo ocupado, inválido ou incompatível com a duração contratada é recusado e a Reserva mantém o horário anterior.
- [ ] Dois reagendamentos concorrentes para o mesmo intervalo: só um é aplicado.
- [ ] Reserva não `Confirmada` e ator que não é parte da Contratação são recusados.
- [ ] Testes do caso de uso e dos casos de uso anteriores passam juntos; `lint` e `build` sem erros.

## Dependências externas e decisões pendentes

- **UC10 — Pagar Reserva:** produz a Reserva `Confirmada` (pré-condição); **bloqueia** este caso de uso.
- **UC09:** fornece o Agregado Reserva e o repositório atômico.
- **UC13:** o efeito do reagendamento sobre a Sessão `Programada` ainda não está decidido (D-UC11-03).
- **D-UC11-01:** A outra parte precisa concordar com o novo horário? Não documentado; nenhuma etapa de concordância foi criada.
- **D-UC11-02:** Antecedência mínima e limite de reagendamentos: não documentados.
- **D-UC11-03:** Efeito sobre a Sessão `Programada` ligada à Reserva (Reserva — Sessão `1 : 0..1`): não documentado.
- **D-UC11-07:** Origem do identificador do ator (D1).

## Condições de conclusão

O épico é concluído quando todas as Sub-Issues estiverem em `Done`, os critérios gerais estiverem verificados por testes (incluindo concorrência) e as decisões D-UC11-01 a D-UC11-04 estiverem registradas.
<!-- BODY:END -->
