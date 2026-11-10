# 01-03 — Issue principal (Epic)

**Título:** `[UC02] Cadastrar Perfil de Especialista`
**Labels:** `usecase:uc02`, `domain:oferta`, `type:epic`, `priority:high`
**Responsável:** @leohsm
**Estado inicial no board:** `Backlog`

O corpo abaixo, entre os marcadores, é publicado no GitHub. As referências `SUB-XX` são substituídas pelos números reais após a criação das Sub-Issues.

<!-- BODY:START -->
## Objetivo

Permitir que um Usuário já cadastrado registre seu **Perfil de Especialista** e passe a exercer o papel de especialista sem criar uma nova identidade.

## Contexto e escopo

- **Contexto responsável:** C2 — Oferta Profissional, consumindo C1 — Identidade e Organizações por uma interface pública restrita.
- **Arquitetura:** monólito modular (ADR-01), verificação síncrona e local (ADR-03), interfaces por propósito (ADR-04).
- **Dentro do escopo:** reconhecimento do usuário, unicidade do perfil por usuário, criação com situação inicial, registro e resposta HTTP.
- **Fora do escopo:** suspender ou reativar perfil, publicar serviços, receber solicitações, consultar ou editar perfis, autenticação e banco de dados.

## Referências

- `trabalho3.md` — §1.2 (papéis), §5.1 (Perfil de Especialista), §8 (cardinalidade `1 : 0..1`), §9 (RN01)
- `trabalho4.md` — §3.1 e §3.2 (C1 e C2), §12 (ADR-01, ADR-03, ADR-04), §13.1, §13.4.2
- `docs/etapa-01/01-01-analise-tecnica.md` — especificação deste caso de uso

## Requisitos contemplados

| ID | Requisito |
| --- | --- |
| RN-UC02-01 | Um Usuário possui no máximo um Perfil de Especialista |
| RN-UC02-02 | Cliente e Especialista são papéis do mesmo Usuário |
| RN-UC02-03 | O perfil registra uma situação que permite aplicar RN01 |
| RN-UC02-04 | C2 reconhece o usuário por interface pública restrita de C1 |
| RN-UC02-05 | A unicidade do perfil é protegida na persistência |
| FE-01..03 | Dados inválidos (400), usuário não reconhecido (404), perfil existente (409) |

## Sub-Issues planejadas

- [ ] SUB-01 — Expor interface pública de reconhecimento de usuário (C1)
- [ ] SUB-02 — Modelar Perfil de Especialista e suas invariantes
- [ ] SUB-03 — Definir contrato de persistência de perfis e adaptador em memória com unicidade
- [ ] SUB-04 — Implementar serviço de aplicação Cadastrar Perfil de Especialista
- [ ] SUB-05 — Expor endpoint HTTP de cadastro de perfil
- [ ] SUB-06 — Integrar C1 e C2 e verificar o fluxo completo por testes HTTP
- [ ] SUB-07 — Documentar o UC02 e o endpoint

## Critérios gerais de aceite

- [ ] Um usuário cadastrado consegue registrar um perfil, que retorna com situação `ATIVO`.
- [ ] Um segundo perfil para o mesmo usuário é recusado (409) sem alterar o primeiro.
- [ ] Uma referência de usuário inexistente é recusada (404) sem registrar nada.
- [ ] Dados inválidos ou campos não previstos são recusados (400).
- [ ] C2 não importa classes concretas nem o modelo completo de Usuário de C1.
- [ ] Testes do UC01 e do UC02 passam juntos; lint e build sem erros.

## Dependências externas e decisões pendentes

- **D1 — Origem da identidade do agente:** não há autenticação implementada. É preciso decidir se `usuarioId` vem do corpo da requisição (limitação temporária) ou de uma identidade autenticada. Afeta SUB-05 e SUB-06.
- **D2 — Situação inicial do perfil:** decidida em 10/11/2026 — o perfil nasce `ATIVO`.
- **D3 — Especialidades repetidas:** decidida em 10/11/2026 — repetições são recusadas (400), sem diferenciar maiúsculas e minúsculas.
- **D4 — Persistência durável:** fora do escopo; o contrato de persistência isola o adaptador em memória.

## Condições de conclusão

O épico é concluído quando todas as Sub-Issues estiverem em `Done`, os critérios gerais acima estiverem verificados por testes e a decisão D1 estiver registrada na SUB-05.
<!-- BODY:END -->
