# 01-03 — Issue principal (Epic)

**Título:** `[UC15] Indicar Participantes da Sessão`  
**Labels:** `usecase:uc15`, `domain:agenda`, `domain:identidade`, `type:epic`, `priority:medium`  
**Responsável:** @leohsm  
**Estado inicial no board:** `Backlog`

O corpo abaixo, entre os marcadores, é publicado no GitHub. Os marcadores `{{SUB-XX}}` são substituídos pelos números reais após a criação das issues.

<!-- BODY:START -->
## Objetivo

Permitir que o Representante, com vínculo compatível, indique membros vinculados à Organização como participantes de uma Sessão ainda não concluída nem cancelada, de modo que contratante e participantes possam ser pessoas diferentes (RN12).

## Contexto e escopo

- **Contexto responsável:** C4 — Agenda e Atendimento, consultando C1 [T5 §5.3].
- **Arquitetura:** C4 consulta a visão pública de vínculos de C1; as Participações pertencem à Sessão (T3 §6.3).
- **Dentro do escopo:** visão de vínculos em C1, indicação de Participações na Sessão, serviço de aplicação, endpoint HTTP e documentação.
- **Fora do escopo:** limite de participantes, papéis fixos e indicação por Contratação (não documentados), atualização automática diante de vínculos revogados, avisos reais aos participantes.

## Referências

- `docs/casos-de-uso.md` — especificação de UC15
- `docs/trabalhos/trabalho3.md` — §5, §6, §7, §8, §9, §10, §11
- `docs/trabalhos/trabalho4.md` — §3.4, §6.3, §8.1, §9 (TC-C4-01, TC-C4-02)
- `docs/trabalhos/trabalho5.md` — §3, §5, §8, §9
- `docs/planejamento/uc17/` — vínculos organizacionais
- `docs/planejamento/uc15/` — artefatos deste planejamento

## Requisitos contemplados

| ID | Requisito |
| --- | --- |
| RN11 | Agir em nome de organização exige vínculo compatível. |
| RN12 | Contratante e participantes podem diferir. |
| INV-01 | Sessão — Participação `1 : 1..*`; Participação é entidade associativa. |

**Fluxos:** passo 1 a 5 do fluxo principal; FE-01, FE-02, FE-03, FE-04.

## Sub-Issues planejadas

- [ ] {{SUB-01}} — [C1] Expor a visão pública de vínculos organizacionais em C1
- [ ] {{SUB-02}} — [C4] Modelar a indicação de Participações na Sessão
- [ ] {{SUB-03}} — [C4] Implementar o serviço de aplicação Indicar Participantes
- [ ] {{SUB-04}} — [C4] Expor o endpoint de indicação e verificar a jornada
- [ ] {{SUB-05}} — [C4] Documentar o UC15 e o endpoint

## Critérios gerais de aceite

- [ ] O Representante com vínculo compatível indica membros vinculados e a Sessão passa a ter as Participações correspondentes.
- [ ] Representante sem vínculo, membro sem vínculo e Sessão `Concluída` ou `Cancelada` são recusados.
- [ ] A revogação posterior do vínculo de um membro não altera a Participação já registrada.
- [ ] Testes do caso de uso e dos casos de uso anteriores passam juntos; `lint` e `build` sem erros.

## Dependências externas e decisões pendentes

- **UC17 — Vincular Membro:** fornece os vínculos; **bloqueia** a SUB-01.
- **UC13:** fornece a Sessão e a Participação; **bloqueia** a SUB-02.
- **UC16:** fornece a Organização e o Representante.
- **Classificação Futuro:** só depois das dúvidas D-UC15-01 a D-UC15-03.
- **D-UC15-01:** Limite de participantes por Sessão: não documentado; nenhuma regra criada.
- **D-UC15-02:** Os papéis da Participação (especialista, cliente, convidado) são fixos? Não documentado.
- **D-UC15-03:** A indicação é por Sessão ou para toda a Contratação? Este planejamento trata por Sessão.

## Condições de conclusão

O épico é concluído quando todas as Sub-Issues estiverem em `Done`, os critérios gerais estiverem verificados por testes e as decisões D-UC15-01 a D-UC15-03 estiverem registradas.
<!-- BODY:END -->
