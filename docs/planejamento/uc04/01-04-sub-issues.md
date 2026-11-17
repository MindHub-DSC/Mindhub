# 01-04 — Sub-Issues completas

**Caso de uso:** UC04 — Buscar Especialistas e Serviços  
**Issue principal:** `[UC04] Buscar Especialistas e Serviços`

Cada Sub-Issue abaixo está pronta para publicação. O texto entre os marcadores `START` e `END` é o corpo da issue. `{{EPIC}}` e `{{SUB-XX}}` são substituídos pelos números reais na criação.

---

## SUB-01

**Título:** `[UC04-SUB-01] [C2] Definir o modelo de leitura público da oferta`  
**Labels:** `usecase:uc04`, `domain:oferta`, `type:feature`, `layer:domain`, `layer:application`, `priority:high`

<!-- SUB-01:START -->
> **Issue Principal:** Relacionada ao Épico {{EPIC}}

## Objetivo

Fixar a visão pública que a busca devolve, sem dados privados.

## Descrição

Criar o modelo de leitura `OfertaPublica` (especialista, especialidades, lista de Serviços com título e Modelo de Contratação) e a porta de consulta `ConsultaOferta` com critério opcional. Criar o adaptador em memória usado nos testes.

## Origem

Fluxo principal, passos 3 e 4; POS-01; `trabalho4.md` §6.1.

## Escopo

**Inclui:** Modelo de leitura, porta de consulta e adaptador em memória.

**Não inclui:** Regra de seleção (SUB-02); consulta ao banco (SUB-03).

## Critérios de aceite

- [ ] A visão pública contém especialista, especialidades, Serviços e Modelo de Contratação.
- [ ] A visão não contém nome, email nem outros dados do Usuário ou dados privados do perfil.
- [ ] A visão traz os identificadores necessários para seguir ao UC05 ou UC08.

## Dependências

| Depende de | Tipo | Necessidade |
| --- | --- | --- |
| D-UC04-05 | Decisão | Define os campos da visão pública. |

Esta issue fornece o que é consumido por {{SUB-02}}, {{SUB-03}}.

## Responsável

@leohsm

## Estado inicial recomendado

`Backlog`

## Evidências esperadas

Pull Request com a implementação e os testes da unidade; saída de `pnpm test`, `pnpm lint` e `pnpm build` sem falhas.
<!-- SUB-01:END -->

---

## SUB-02

**Título:** `[UC04-SUB-02] [C2] Implementar a seleção de especialistas habilitados e Serviços publicados`  
**Labels:** `usecase:uc04`, `domain:oferta`, `type:feature`, `layer:application`, `priority:high`

<!-- SUB-02:START -->
> **Issue Principal:** Relacionada ao Épico {{EPIC}}

## Objetivo

Aplicar o critério de busca e o filtro de elegibilidade sobre a oferta vigente.

## Descrição

Criar o serviço `BuscarOferta` que, com critério opcional, devolve apenas perfis `ATIVO` e Serviços publicados compatíveis, sem alterar estado. Lista vazia é resultado válido.

## Origem

Fluxo principal, passo 2; FA-01, FA-02; RN01 (proposta).

## Escopo

**Inclui:** Serviço de consulta, regra de seleção e testes com dublês.

**Não inclui:** Ordenação, ranking, recomendação; HTTP.

## Critérios de aceite

- [ ] Busca sem critério devolve a listagem simples da oferta vigente.
- [ ] Busca com critério devolve apenas especialistas e Serviços compatíveis, sem diferenciar maiúsculas e minúsculas.
- [ ] Perfis `SUSPENSO` não aparecem (D-UC04-01).
- [ ] Nenhum resultado devolve lista vazia, sem erro.
- [ ] A operação não altera nenhum registro.

## Dependências

| Depende de | Tipo | Necessidade |
| --- | --- | --- |
| {{SUB-01}} | Interna | Usa o modelo e a porta de consulta. |
| UC03 | Externa | Fornece os Serviços publicados. |
| D-UC04-01 | Decisão | Define o filtro de perfis suspensos. |
| D-UC04-02 | Decisão | Define os critérios existentes. |

Esta issue fornece o que é consumido por {{SUB-04}}.

## Responsável

@leohsm

## Estado inicial recomendado

`Backlog`

## Evidências esperadas

Pull Request com a implementação e os testes da unidade; saída de `pnpm test`, `pnpm lint` e `pnpm build` sem falhas.
<!-- SUB-02:END -->

---

## SUB-03

**Título:** `[UC04-SUB-03] [C2] Implementar a consulta da oferta no armazenamento`  
**Labels:** `usecase:uc04`, `domain:oferta`, `type:feature`, `layer:repository`, `priority:high`

<!-- SUB-03:START -->
> **Issue Principal:** Relacionada ao Épico {{EPIC}}

## Objetivo

Executar a consulta de leitura no PostgreSQL com a mesma interface da porta.

## Descrição

Criar o adaptador TypeORM de `ConsultaOferta` com junção de perfis, especialidades e Serviços, filtro por critério e por situação, e limite de resultados (D-UC04-03). Executar os mesmos testes de contrato do adaptador em memória.

## Origem

Passo 2; FA-01; POS-02.

## Escopo

**Inclui:** Consulta TypeORM, índices necessários (se houver) e testes de contrato contra o banco.

**Não inclui:** Mudanças de esquema além de índices; regras de negócio.

## Critérios de aceite

- [ ] Os testes de contrato da porta passam nos adaptadores em memória e TypeORM.
- [ ] A consulta não grava nem altera registros.
- [ ] O limite de resultados de D-UC04-03 é aplicado.
- [ ] Falha técnica de armazenamento é traduzida para erro de armazenamento indisponível.

## Dependências

| Depende de | Tipo | Necessidade |
| --- | --- | --- |
| {{SUB-01}} | Interna | Implementa a porta e o modelo de leitura. |
| UC03 | Externa | A tabela de Serviço precisa existir. |
| D-UC04-03 | Decisão | Define o limite. |

Esta issue fornece o que é consumido por {{SUB-04}}.

## Responsável

@leohsm

## Estado inicial recomendado

`Backlog`

## Evidências esperadas

Pull Request com a implementação e os testes da unidade; saída de `pnpm test`, `pnpm lint` e `pnpm build` sem falhas.
<!-- SUB-03:END -->

---

## SUB-04

**Título:** `[UC04-SUB-04] [C2] Expor o endpoint de busca e traduzir os erros`  
**Labels:** `usecase:uc04`, `domain:oferta`, `type:feature`, `layer:api`, `layer:integration`, `priority:high`

<!-- SUB-04:START -->
> **Issue Principal:** Relacionada ao Épico {{EPIC}}

## Objetivo

Disponibilizar a busca pela API HTTP com validação de fronteira.

## Descrição

Criar o DTO de consulta (`z.strictObject`), o controller `GET` da oferta e o teste HTTP de ponta a ponta: perfil criado no UC02, Serviço publicado no UC03 e busca com e sem critério. Conforme D-UC04-04, a busca não exige identificador de usuário.

## Origem

Fluxo principal, passo 1; FA-01, FA-02; FE-01.

## Escopo

**Inclui:** DTO, controller, ligação no `OfertaModule` e testes HTTP.

**Não inclui:** Autenticação; paginação além do limite de D-UC04-03.

## Critérios de aceite

- [ ] Requisição sem critério responde 200 com a listagem simples.
- [ ] Critério fora do formato responde 400 sem consultar o armazenamento (FE-01).
- [ ] Nenhum resultado responde 200 com lista vazia.
- [ ] O teste HTTP cobre a jornada UC02 → UC03 → UC04 com perfil ativo e suspenso.

## Dependências

| Depende de | Tipo | Necessidade |
| --- | --- | --- |
| {{SUB-02}} | Interna | Chama o serviço de busca. |
| {{SUB-03}} | Interna | Usa a consulta real no teste de ponta a ponta. |
| D-UC04-04 | Decisão | Define se há identificação do chamador. |

Esta issue fornece o que é consumido por {{SUB-05}}.

## Responsável

@leohsm

## Estado inicial recomendado

`Backlog`

## Evidências esperadas

Pull Request com a implementação e os testes da unidade; saída de `pnpm test`, `pnpm lint` e `pnpm build` sem falhas.
<!-- SUB-04:END -->

---

## SUB-05

**Título:** `[UC04-SUB-05] [C2] Documentar o UC04 e o endpoint`  
**Labels:** `usecase:uc04`, `domain:oferta`, `type:docs`, `priority:low`

<!-- SUB-05:START -->
> **Issue Principal:** Relacionada ao Épico {{EPIC}}

## Objetivo

Manter a documentação coerente com o comportamento entregue.

## Descrição

Atualizar o README e o `requests.http` com exemplos de busca e registrar as limitações: sem ordenação, ranking ou recomendação, sem paginação avançada e a decisão sobre perfis suspensos.

## Origem

Rastreabilidade do planejamento.

## Escopo

**Inclui:** README, `requests.http` e registro de limitações.

**Não inclui:** Alteração de código.

## Critérios de aceite

- [ ] Os exemplos do `requests.http` são executáveis e cobrem busca com e sem critério.
- [ ] As limitações e as decisões D-UC04-01 a D-UC04-05 estão registradas.
- [ ] O README aponta para este planejamento.

## Dependências

| Depende de | Tipo | Necessidade |
| --- | --- | --- |
| {{SUB-04}} | Interna | Documenta o comportamento final. |

## Responsável

@leohsm

## Estado inicial recomendado

`Backlog`

## Evidências esperadas

Pull Request com a implementação e os testes da unidade; saída de `pnpm test`, `pnpm lint` e `pnpm build` sem falhas.
<!-- SUB-05:END -->

---
