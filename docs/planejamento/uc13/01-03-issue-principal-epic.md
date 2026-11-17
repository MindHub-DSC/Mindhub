# 01-03 — Issue principal (Epic)

**Título:** `[UC13] Realizar Sessão`  
**Labels:** `usecase:uc13`, `domain:agenda`, `type:epic`, `priority:high`  
**Responsável:** @leohsm  
**Estado inicial no board:** `Backlog`

O corpo abaixo, entre os marcadores, é publicado no GitHub. Os marcadores `{{SUB-XX}}` são substituídos pelos números reais após a criação das issues.

<!-- BODY:START -->
## Objetivo

Permitir que o Especialista da Contratação inicie uma Sessão `Programada` obtendo o ambiente remoto e a conclua, deixando a Sessão `Concluída` e habilitando a avaliação (RN09). A falha da videoconferência não altera a situação da Sessão.

## Contexto e escopo

- **Contexto responsável:** C4 — Agenda e Atendimento; o Serviço de videoconferência é sistema externo isolado por porta [T5 §2.2].
- **Arquitetura:** a Sessão nasce da Reserva `Confirmada` (`trabalho3.md` §7); a interação com o sistema é parcial e a conclusão depende da decisão D-UC13-01.
- **Dentro do escopo:** Agregado Sessão com Participação, criação a partir da Reserva confirmada, porta e adaptador simulado de videoconferência, serviço de aplicação para iniciar e concluir, endpoints HTTP e documentação.
- **Fora do escopo:** no-show, atraso e sessão interrompida (não documentados), anotações, metas e entregas (fora do catálogo), cancelamento da Sessão (UC12), videoconferência real (adaptador simulado).

## Referências

- `docs/casos-de-uso.md` — especificação de UC13
- `docs/trabalhos/trabalho3.md` — §5, §6, §7, §8, §9, §10, §11
- `docs/trabalhos/trabalho4.md` — §3.4, §6.3, §8.1, §9 (TC-C4-01, TC-C4-02)
- `docs/trabalhos/trabalho5.md` — §3, §5, §8, §9
- `docs/planejamento/uc10/` — confirmação da Reserva
- `docs/planejamento/uc13/` — artefatos deste planejamento

## Requisitos contemplados

| ID | Requisito |
| --- | --- |
| RN09 | A avaliação só pode ser feita pelo cliente de Sessão concluída. |
| RN12 | Contratante e participantes podem ser pessoas diferentes. |
| INV-01 | Toda Sessão pertence a uma Contratação; Sessão — Participação `1 : 1..*`; Reserva — Sessão `1 : 0..1`. |

**Fluxos:** passo 1 a 4 do fluxo principal; FE-01, FE-02, FE-03, FE-04.

## Sub-Issues planejadas

- [ ] {{SUB-01}} — [C4] Modelar a Sessão, a Participação e o ciclo de vida
- [ ] {{SUB-02}} — [C4] Criar a Sessão `Programada` a partir da Reserva confirmada
- [ ] {{SUB-03}} — [C4] Definir a porta do Serviço de videoconferência e o adaptador simulado
- [ ] {{SUB-04}} — [C4] Implementar o serviço de aplicação Iniciar e Concluir Sessão
- [ ] {{SUB-05}} — [C4] Expor os endpoints de início e conclusão e verificar a jornada
- [ ] {{SUB-06}} — [C4] Documentar o UC13 e o endpoint

## Critérios gerais de aceite

- [ ] Toda Reserva `Confirmada` gera uma Sessão `Programada` com pelo menos uma Participação.
- [ ] O Especialista da Contratação inicia a Sessão `Programada`, recebe o ambiente remoto e a Sessão fica `Em andamento`.
- [ ] O Especialista conclui a Sessão `Em andamento`, que fica `Concluída`; a conclusão repetida não tem efeito adicional.
- [ ] Sessão não `Programada`, ator que não é o especialista e videoconferência indisponível são recusados sem alterar indevidamente a Sessão.
- [ ] Testes do caso de uso e dos casos de uso anteriores passam juntos; `lint` e `build` sem erros.

## Dependências externas e decisões pendentes

- **UC10 — Pagar Reserva:** produz a Reserva `Confirmada` e o fato que cria a Sessão; **bloqueia** a SUB-02.
- **D-UC13-01 (impeditiva):** como a conclusão é reconhecida; bloqueia a SUB-04.
- **D-UC13-02 (impeditiva):** quando a Sessão é criada; bloqueia a SUB-02.
- **UC14 e UC15:** consomem a Sessão `Concluída` e as Participações.
- **D-UC13-01:** Como a conclusão é reconhecida: declaração do Especialista ou fim da videoconferência [T5 §4.1]. Proposta: declaração do Especialista.
- **D-UC13-02:** Quando a Sessão é criada: [T3 §7] diz que a Reserva a programa. Proposta: na confirmação da Reserva (UC10).
- **D-UC13-03:** Ausência do cliente (no-show), atraso e sessão interrompida: não documentados; nenhuma regra criada.
- **D-UC13-04:** Anotações, metas e entregas [T1 §3]: fora do catálogo atual.
- **D-UC13-08:** Origem do identificador do Especialista (D1).

## Condições de conclusão

O épico é concluído quando todas as Sub-Issues estiverem em `Done`, os critérios gerais estiverem verificados por testes e as decisões D-UC13-01, D-UC13-02 e D-UC13-06 estiverem registradas.
<!-- BODY:END -->
