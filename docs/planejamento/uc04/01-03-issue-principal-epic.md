# 01-03 — Issue principal (Epic)

**Título:** `[UC04] Buscar Especialistas e Serviços`  
**Labels:** `usecase:uc04`, `domain:oferta`, `type:epic`, `priority:medium`  
**Responsável:** @leohsm  
**Estado inicial no board:** `Backlog`

O corpo abaixo, entre os marcadores, é publicado no GitHub. Os marcadores `{{SUB-XX}}` são substituídos pelos números reais após a criação das issues.

<!-- BODY:START -->
## Objetivo

Permitir que o Cliente consulte a oferta vigente, por critério ou sem critério, e receba uma visão pública de especialistas habilitados e seus Serviços publicados, sem alterar nenhum estado do sistema.

## Contexto e escopo

- **Contexto responsável:** C2 — Oferta Profissional (leitura da oferta vigente, [T5 §5.3]).
- **Arquitetura:** consulta no módulo `oferta`, sem alterar Agregados; a visão pública é um modelo de leitura que não expõe dados privados (`trabalho4.md` §6.1).
- **Dentro do escopo:** modelo de leitura, consulta por critério e sem critério, filtro de elegibilidade (RN01, [PROP]), endpoint HTTP e documentação.
- **Fora do escopo:** ordenação, ranking por reputação e recomendação inteligente (sem regras confirmadas, [T5 §4.2]); contratação (UC05/UC08); autenticação.

## Referências

- `docs/casos-de-uso.md` — especificação de UC04
- `docs/trabalhos/trabalho3.md` — §5, §8, §9, §10, §11
- `docs/trabalhos/trabalho4.md` — §3.2, §6.1, §9
- `docs/trabalhos/trabalho5.md` — §3, §5, §8, §9
- `docs/planejamento/uc04/` — artefatos deste planejamento

## Requisitos contemplados

| ID | Requisito |
| --- | --- |
| RN01 | Como filtro de elegibilidade [PROP]: só perfis `ATIVO`. |
| RN13 | O Modelo de Contratação orienta o próximo caso de uso. |

**Fluxos:** passo 1 a 4 do fluxo principal; FA-01, FA-02, FE-01.

## Sub-Issues planejadas

- [ ] {{SUB-01}} — [C2] Definir o modelo de leitura público da oferta
- [ ] {{SUB-02}} — [C2] Implementar a seleção de especialistas habilitados e Serviços publicados
- [ ] {{SUB-03}} — [C2] Implementar a consulta da oferta no armazenamento
- [ ] {{SUB-04}} — [C2] Expor o endpoint de busca e traduzir os erros
- [ ] {{SUB-05}} — [C2] Documentar o UC04 e o endpoint

## Critérios gerais de aceite

- [ ] A busca sem critério devolve a listagem simples da oferta vigente.
- [ ] A busca com critério devolve apenas especialistas e Serviços compatíveis.
- [ ] Nenhum resultado é uma lista vazia, não um erro.
- [ ] Especialistas `SUSPENSO` não aparecem (proposta D-UC04-01).
- [ ] A resposta não expõe dados privados e a operação não altera estado.
- [ ] Testes do caso de uso e dos casos de uso anteriores passam juntos; `lint` e `build` sem erros.

## Dependências externas e decisões pendentes

- **UC03 — Publicar Serviço:** fornece os Serviços publicados e seu Modelo de Contratação; **bloqueia** a consulta de Serviços.
- **UC02:** fornece perfis e especialidades (já implementado).
- **Consumidores:** UC05 e UC08 partem do resultado da busca.
- **D-UC04-01:** Perfis `SUSPENSO` aparecem na busca? Proposta: não, pois não recebem novas Solicitações (RN01).
- **D-UC04-02:** Quais critérios existem (área de atuação, especialidade, Modelo de Contratação)? [T1 §3] cita área e especialidade.
- **D-UC04-04:** A busca exige Usuário cadastrado? Não documentado. Proposta: não exige.

## Condições de conclusão

O épico é concluído quando todas as Sub-Issues estiverem em `Done`, os critérios gerais estiverem verificados por testes e as decisões D-UC04-01 a D-UC04-03 estiverem registradas.
<!-- BODY:END -->
