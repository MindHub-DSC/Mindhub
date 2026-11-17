# 01-03 — Issue principal (Epic)

**Título:** `[UC14] Avaliar Sessão`  
**Labels:** `usecase:uc14`, `domain:agenda`, `type:epic`, `priority:medium`  
**Responsável:** @leohsm  
**Estado inicial no board:** `Backlog`

O corpo abaixo, entre os marcadores, é publicado no GitHub. Os marcadores `{{SUB-XX}}` são substituídos pelos números reais após a criação das issues.

<!-- BODY:START -->
## Objetivo

Permitir que o cliente de uma Sessão `Concluída` registre uma Avaliação, garantindo que apenas o cliente da Sessão avalie (RN09) e que exista no máximo uma Avaliação por cliente e Sessão (RN10), mesmo com avaliações simultâneas.

## Contexto e escopo

- **Contexto responsável:** C4 — registro elegível da avaliação [T4 §3.4, ADR-02].
- **Arquitetura:** a elegibilidade usa a Sessão do UC13; a unicidade é aplicada no repositório de forma atômica (TC-C4-02).
- **Dentro do escopo:** Avaliação, repositório com unicidade, serviço de aplicação, endpoint HTTP e documentação.
- **Fora do escopo:** resposta do especialista e reputação agregada (capacidades futuras sem regras), edição da Avaliação e prazo para avaliar (não documentados), contratação organizacional (quem avalia).

## Referências

- `docs/casos-de-uso.md` — especificação de UC14
- `docs/trabalhos/trabalho3.md` — §5, §6, §7, §8, §9, §10, §11
- `docs/trabalhos/trabalho4.md` — §3.4, §6.3, §8.1, §9 (TC-C4-01, TC-C4-02)
- `docs/trabalhos/trabalho5.md` — §3, §5, §8, §9
- `docs/planejamento/uc14/` — artefatos deste planejamento

## Requisitos contemplados

| ID | Requisito |
| --- | --- |
| RN09 | Só o cliente de uma Sessão concluída avalia. |
| RN10 | No máximo uma Avaliação por Sessão do cliente. |
| INV-01 | Sessão — Avaliação `1 : 0..1`; a Avaliação referencia Sessão concluída. |

**Fluxos:** passo 1 a 4 do fluxo principal; FE-01, FE-02, FE-03, FE-04.

## Sub-Issues planejadas

- [ ] {{SUB-01}} — [C4] Modelar a Avaliação
- [ ] {{SUB-02}} — [C4] Garantir a unicidade da Avaliação por Sessão no repositório
- [ ] {{SUB-03}} — [C4] Implementar o serviço de aplicação Avaliar Sessão
- [ ] {{SUB-04}} — [C4] Expor o endpoint de avaliação e verificar a concorrência
- [ ] {{SUB-05}} — [C4] Documentar o UC14 e o endpoint

## Critérios gerais de aceite

- [ ] O cliente de uma Sessão `Concluída` registra uma Avaliação e a recebe de volta.
- [ ] Sessão não `Concluída`, autor que não é o cliente da Sessão e Avaliação já existente são recusados sem registro.
- [ ] Duas avaliações simultâneas do mesmo cliente para a mesma Sessão: apenas uma é registrada.
- [ ] Testes do caso de uso e dos casos de uso anteriores passam juntos; `lint` e `build` sem erros.

## Dependências externas e decisões pendentes

- **UC13 — Realizar Sessão:** fornece a Sessão `Concluída`; **bloqueia** a SUB-03.
- **D-UC14-01:** o conteúdo da Avaliação não é definido; bloqueia a SUB-01.
- **D-UC14-01:** Conteúdo da Avaliação (nota, escala, comentário): não definido. Proposta: nota inteira de 1 a 5 e comentário opcional.
- **D-UC14-02:** Prazo para avaliar e possibilidade de editar: não documentados; a Avaliação não tem edição.
- **D-UC14-03:** Em contratação organizacional, quem é o cliente que avalia (contratante ou participantes)? RN09 fala em cliente.
- **D-UC14-04:** Resposta do especialista e reputação agregada: capacidades futuras sem regras; não planejadas.
- **D-UC14-06:** Origem do identificador do Cliente (D1).

## Condições de conclusão

O épico é concluído quando todas as Sub-Issues estiverem em `Done`, os critérios gerais estiverem verificados por testes (incluindo concorrência) e as decisões D-UC14-01, D-UC14-02 e D-UC14-03 estiverem registradas.
<!-- BODY:END -->
