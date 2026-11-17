# 01-03 — Issue principal (Epic)

**Título:** `[UC03] Publicar Serviço`  
**Labels:** `usecase:uc03`, `domain:oferta`, `type:epic`, `priority:high`  
**Responsável:** @leohsm  
**Estado inicial no board:** `Backlog`

O corpo abaixo, entre os marcadores, é publicado no GitHub. Os marcadores `{{SUB-XX}}` são substituídos pelos números reais após a criação das issues.

<!-- BODY:START -->
## Objetivo

Permitir que o Especialista com perfil `ATIVO` publique um Serviço identificado, vinculado ao seu perfil e com Modelo de Contratação declarado. Serviços de Reserva Direta carregam as condições vigentes da oferta padronizada; perfil suspenso não publica.

## Contexto e escopo

- **Contexto responsável:** C2 — Oferta Profissional.
- **Arquitetura:** módulo `oferta` do monólito modular (ADR-01), nas camadas `dominio`, `aplicacao`, `infra` e `http`, como no UC02 [CÓD].
- **Dentro do escopo:** Agregado Serviço, condições vigentes de Reserva Direta, persistência, serviço de aplicação com RN01, proteção contra suspensão concorrente, endpoint HTTP e documentação.
- **Fora do escopo:** editar ou despublicar Serviço (fora do catálogo, `casos-de-uso.md` §8), busca e visibilidade (UC04), contratação (UC05/UC08), autenticação e verificação de que o ator é o dono do perfil além do identificador informado (D1).

## Referências

- `docs/casos-de-uso.md` — especificação de UC03
- `docs/trabalhos/trabalho3.md` — §5, §8, §9, §10, §11
- `docs/trabalhos/trabalho4.md` — §3.2, §6.1, §9
- `docs/trabalhos/trabalho5.md` — §3, §5, §8, §9
- `docs/planejamento/uc03/` — artefatos deste planejamento

## Requisitos contemplados

| ID | Requisito |
| --- | --- |
| RN01 | Só Perfil de Especialista `ATIVO` publica Serviços e recebe Solicitações. |
| RN13 | O Modelo de Contratação declarado define o caminho comercial (Reserva Direta sem proposta; Sob Proposta com negociação). |

**Fluxos:** passo 1 a 5 do fluxo principal; FA-01, FE-01, FE-02, FE-03, FE-04, FE-05, FE-06.

## Sub-Issues planejadas

- [ ] {{SUB-01}} — [C2] Modelar o Serviço e suas condições vigentes
- [ ] {{SUB-02}} — [C2] Persistir o Serviço com TypeORM e migration
- [ ] {{SUB-03}} — [C2] Implementar o serviço de aplicação Publicar Serviço
- [ ] {{SUB-04}} — [C2] Proteger a publicação contra suspensão concorrente
- [ ] {{SUB-05}} — [C2] Expor o endpoint de publicação de Serviço e traduzir os erros
- [ ] {{SUB-06}} — [C2] Documentar o UC03 e o endpoint

## Critérios gerais de aceite

- [ ] Especialista com perfil `ATIVO` publica Serviço de Reserva Direta (com condições) ou Sob Proposta e recebe o Serviço publicado.
- [ ] Perfil `SUSPENSO`, ator sem perfil, modelo ausente e Reserva Direta sem condições são recusados sem registrar nada.
- [ ] Um perfil pode publicar vários Serviços.
- [ ] Publicação concorrente com suspensão: a posterior à suspensão é recusada e a anterior é preservada (TC-C2-01).
- [ ] Testes do caso de uso e dos casos de uso anteriores passam juntos; `lint` e `build` sem erros.

## Dependências externas e decisões pendentes

- **UC02 — Perfil de Especialista:** já implementado (PR #34); fornece o perfil e sua situação.
- **UC18 — Suspender Perfil:** não bloqueia; o teste de concorrência simula a suspensão pelo repositório enquanto o UC18 não existir.
- **Consumidores:** UC04 (busca), UC08 (contratação direta) e a Sub-Issue SUB-06 do UC05 (#16) dependem do Serviço publicado.
- **D1 — Origem da identidade do ator:** pendente (mesma decisão do UC02).
- **D-UC03-01:** Atributos que descrevem um Serviço (título, descrição, modalidade, área). Proposta: título e descrição.
- **D-UC03-02:** Quais campos das condições vigentes são obrigatórios em Reserva Direta (preço, moeda, duração, modalidade são apenas exemplos em T3 §5.2).
- **D-UC03-03:** Serviço Sob Proposta possui preço de referência? Este planejamento assume que não.
- **D-UC03-04:** Serviços de perfil suspenso deixam de ser visíveis? Fora do UC03; decidido no UC04/UC18.
- **D-UC03-05:** Origem da identidade do ator (D1): identificador informado pelo cliente HTTP até existir autenticação.

## Condições de conclusão

O épico é concluído quando todas as Sub-Issues estiverem em `Done`, os critérios gerais estiverem verificados por testes e as decisões D-UC03-01, D-UC03-02 e D-UC03-05 estiverem registradas.
<!-- BODY:END -->
