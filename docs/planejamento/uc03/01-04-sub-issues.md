# 01-04 — Sub-Issues completas

**Caso de uso:** UC03 — Publicar Serviço  
**Issue principal:** `[UC03] Publicar Serviço`

Cada Sub-Issue abaixo está pronta para publicação. O texto entre os marcadores `START` e `END` é o corpo da issue. `{{EPIC}}` e `{{SUB-XX}}` são substituídos pelos números reais na criação.

---

## SUB-01

**Título:** `[UC03-SUB-01] [C2] Modelar o Serviço e suas condições vigentes`  
**Labels:** `usecase:uc03`, `domain:oferta`, `type:feature`, `layer:domain`, `layer:repository`, `priority:high`

<!-- SUB-01:START -->
> **Issue Principal:** Relacionada ao Épico {{EPIC}}

## Objetivo

Representar o Serviço como Agregado de C2, com Modelo de Contratação e, quando Reserva Direta, condições vigentes válidas.

## Descrição

Criar o Agregado `Servico` (identidade, identificador do perfil, descrição, Modelo de Contratação, situação publicada), o objeto de valor `CondicoesVigentes` (preço, moeda, duração, modalidade — conforme D-UC03-02) e a porta `ServicosRepositorio` com `adicionar`, `buscarPorId` e `listarPorPerfil`. Criar o adaptador em memória, com cópias defensivas, usado nos testes de domínio e de contrato.

## Origem

Fluxo principal, passos 1, 2 e 4; POS-01 a POS-04; FE-04, FE-05; RN13; `trabalho3.md` §5.1 a §5.3 e §8.

## Escopo

**Inclui:** Agregado, objeto de valor, erros de domínio, porta, adaptador em memória e testes de domínio e de contrato.

**Não inclui:** Persistência durável (SUB-02); verificação de RN01 (SUB-03); editar ou despublicar.

## Critérios de aceite

- [ ] O Serviço nasce publicado, com identidade própria, referência ao perfil e Modelo de Contratação declarado.
- [ ] Modelo de Contratação ausente ou fora de Reserva Direta/Sob Proposta é recusado pelo domínio.
- [ ] Reserva Direta só é criada com condições vigentes completas, conforme D-UC03-02.
- [ ] Sob Proposta é criada sem condições vigentes obrigatórias (D-UC03-03).
- [ ] Preço negativo ou não inteiro, moeda vazia e duração não positiva são recusados.
- [ ] A porta permite adicionar, buscar por identificador e listar por perfil; o adaptador em memória devolve cópias defensivas.

## Dependências

| Depende de | Tipo | Necessidade |
| --- | --- | --- |
| D-UC03-01 | Decisão | Define os atributos do Agregado. |
| D-UC03-02 | Decisão | Define os campos obrigatórios das condições vigentes. |

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

**Título:** `[UC03-SUB-02] [C2] Persistir o Serviço com TypeORM e migration`  
**Labels:** `usecase:uc03`, `domain:oferta`, `type:feature`, `layer:repository`, `priority:high`

<!-- SUB-02:START -->
> **Issue Principal:** Relacionada ao Épico {{EPIC}}

## Objetivo

Gravar e recuperar Serviços no PostgreSQL com a mesma interface da porta de domínio.

## Descrição

Criar a entidade ORM, o mapper e o repositório TypeORM de `Servico`, além da migration que cria a tabela com chave estrangeira para o perfil e sem restrição de unicidade por perfil. Reutilizar a tradução de erros de banco de `compartilhado/infra`.

## Origem

FA-01 (1 : 0..*); POS-01; `trabalho3.md` §8; padrão do UC02 [CÓD].

## Escopo

**Inclui:** Entidade ORM, mapper, repositório TypeORM, migration reversível e testes de contrato contra o banco.

**Não inclui:** Regras de negócio no repositório; consulta de busca (UC04).

## Critérios de aceite

- [ ] A migration cria a tabela de Serviço com referência ao perfil e é reversível.
- [ ] Adicionar e buscar por identificador preservam todos os campos, inclusive as condições vigentes.
- [ ] Um perfil pode ter vários Serviços persistidos (1 : 0..*).
- [ ] Falha técnica de armazenamento é traduzida para erro de armazenamento indisponível, sem registro parcial.
- [ ] Os testes de contrato do repositório passam nos adaptadores em memória e TypeORM.

## Dependências

| Depende de | Tipo | Necessidade |
| --- | --- | --- |
| {{SUB-01}} | Interna | Implementa a porta e o modelo definidos na SUB-01. |

Esta issue fornece o que é consumido por {{SUB-04}}.

## Responsável

@leohsm

## Estado inicial recomendado

`Backlog`

## Evidências esperadas

Pull Request com migration, repositório e testes executados contra PostgreSQL, como na PR #34; saída de `pnpm test`, `pnpm lint` e `pnpm build`.
<!-- SUB-02:END -->

---

## SUB-03

**Título:** `[UC03-SUB-03] [C2] Implementar o serviço de aplicação Publicar Serviço`  
**Labels:** `usecase:uc03`, `domain:oferta`, `type:feature`, `layer:application`, `priority:high`

<!-- SUB-03:START -->
> **Issue Principal:** Relacionada ao Épico {{EPIC}}

## Objetivo

Coordenar o fluxo principal: reconhecer o perfil do ator, aplicar RN01 e registrar o Serviço publicado.

## Descrição

Criar o serviço `PublicarServico` que recebe o identificador do ator e os dados do Serviço, obtém o Perfil de Especialista do ator (UC02), verifica a situação `ATIVO` (RN01), cria o Serviço e o registra pela porta. Distinguir os erros: perfil inexistente, perfil suspenso, dados de domínio inválidos.

## Origem

Fluxo principal, passos 3 e 4; FA-01; FE-02, FE-03; RN01.

## Escopo

**Inclui:** Serviço de aplicação, erros de aplicação e testes com dublês das portas.

**Não inclui:** Transporte HTTP; proteção contra concorrência (SUB-04).

## Critérios de aceite

- [ ] Ator com perfil `ATIVO` publica o Serviço e recebe identificador, modelo e situação publicada.
- [ ] Ator sem Perfil de Especialista é recusado; nada é registrado.
- [ ] Perfil `SUSPENSO` é recusado por RN01; nada é registrado.
- [ ] O mesmo perfil publica um segundo Serviço sem conflito (FA-01).
- [ ] Recusa de domínio (modelo ausente, Reserva Direta sem condições) é distinguível da recusa de elegibilidade.
- [ ] Toda recusa deixa o repositório sem registro novo.

## Dependências

| Depende de | Tipo | Necessidade |
| --- | --- | --- |
| {{SUB-01}} | Interna | Usa o Agregado e a porta. |
| UC02 | Externa | Fornece o Perfil de Especialista e sua situação (já implementado). |

Esta issue fornece o que é consumido por {{SUB-04}}, {{SUB-05}}.

## Responsável

@leohsm

## Estado inicial recomendado

`Backlog`

## Evidências esperadas

Pull Request com a implementação e os testes da unidade; saída de `pnpm test`, `pnpm lint` e `pnpm build` sem falhas.
<!-- SUB-03:END -->

---

## SUB-04

**Título:** `[UC03-SUB-04] [C2] Proteger a publicação contra suspensão concorrente`  
**Labels:** `usecase:uc03`, `domain:oferta`, `type:feature`, `layer:application`, `layer:repository`, `priority:high`

<!-- SUB-04:START -->
> **Issue Principal:** Relacionada ao Épico {{EPIC}}

## Objetivo

Garantir que a publicação posterior à suspensão do perfil seja recusada e a anterior seja preservada (TC-C2-01).

## Descrição

Aplicar a estratégia de D-UC03-06 (verificação do perfil e gravação do Serviço na mesma transação, com bloqueio ou versão do perfil) no repositório TypeORM e no serviço. Escrever o teste de concorrência contra o banco, simulando a suspensão pela alteração da situação do perfil enquanto o UC18 não existir.

## Origem

FE-06; RN01; `trabalho4.md` TC-C2-01.

## Escopo

**Inclui:** Estratégia de consistência, ajuste do repositório e do serviço e teste de concorrência.

**Não inclui:** A operação de suspensão em si (UC18).

## Critérios de aceite

- [ ] Com publicação e suspensão simultâneas, a publicação posterior à suspensão é recusada.
- [ ] A publicação anterior à suspensão é preservada com a mesma identidade.
- [ ] O teste de concorrência repetido várias vezes contra o banco produz sempre um resultado coerente com a ordem.
- [ ] A estratégia escolhida e seus limites ficam documentados no código e na SUB-06.

## Dependências

| Depende de | Tipo | Necessidade |
| --- | --- | --- |
| {{SUB-02}} | Interna | Exige o repositório durável para controlar a concorrência. |
| {{SUB-03}} | Interna | Aplica a regra RN01 já implementada. |
| D-UC03-06 | Decisão | Define a técnica de consistência. |

Esta issue fornece o que é consumido por {{SUB-05}}.

## Responsável

@leohsm

## Estado inicial recomendado

`Backlog`

## Evidências esperadas

Pull Request com o teste de concorrência e a descrição da estratégia; saída de `pnpm test` sem falhas.
<!-- SUB-04:END -->

---

## SUB-05

**Título:** `[UC03-SUB-05] [C2] Expor o endpoint de publicação de Serviço e traduzir os erros`  
**Labels:** `usecase:uc03`, `domain:oferta`, `type:feature`, `layer:api`, `layer:integration`, `priority:high`

<!-- SUB-05:START -->
> **Issue Principal:** Relacionada ao Épico {{EPIC}}

## Objetivo

Disponibilizar o caso de uso pela API HTTP com validação de fronteira e respostas estáveis.

## Descrição

Criar o DTO com `z.strictObject` (padrão de `criar-usuario.dto.ts`), o controller e o filtro de erros da publicação, conforme D-UC03-07. O identificador do ator é informado pelo cliente (D1). Incluir teste HTTP de ponta a ponta com um perfil criado pelo UC02.

## Origem

Fluxo principal, passos 1 e 5; FE-01 a FE-05; D1.

## Escopo

**Inclui:** DTO, controller, filtro, ligação no `OfertaModule` e testes HTTP.

**Não inclui:** Autenticação; listagem e busca.

## Critérios de aceite

- [ ] Requisição válida responde 201 com identificador, Modelo de Contratação, condições (quando houver) e situação.
- [ ] Corpo fora do formato ou com campos não previstos responde 400 sem iniciar o caso de uso (FE-01).
- [ ] Perfil suspenso, ator sem perfil e Reserva Direta sem condições respondem com códigos e mensagens distintos e estáveis.
- [ ] Falha de armazenamento responde 503 sem registro.
- [ ] O teste HTTP cobre a jornada UC02 → UC03 com perfil `ATIVO`.

## Dependências

| Depende de | Tipo | Necessidade |
| --- | --- | --- |
| {{SUB-03}} | Interna | Chama o serviço de aplicação. |
| {{SUB-04}} | Interna | Expõe o comportamento já protegido contra concorrência. |
| D-UC03-05 | Decisão | Origem do identificador do ator. |
| D-UC03-07 | Decisão | Rota e códigos de erro. |

Esta issue fornece o que é consumido por {{SUB-06}}.

## Responsável

@leohsm

## Estado inicial recomendado

`Backlog`

## Evidências esperadas

Pull Request com a implementação e os testes da unidade; saída de `pnpm test`, `pnpm lint` e `pnpm build` sem falhas.
<!-- SUB-05:END -->

---

## SUB-06

**Título:** `[UC03-SUB-06] [C2] Documentar o UC03 e o endpoint`  
**Labels:** `usecase:uc03`, `domain:oferta`, `type:docs`, `priority:low`

<!-- SUB-06:START -->
> **Issue Principal:** Relacionada ao Épico {{EPIC}}

## Objetivo

Manter a documentação coerente com o comportamento entregue.

## Descrição

Atualizar o README do backend e o `requests.http` com exemplos de publicação (Reserva Direta e Sob Proposta), registrar as limitações (sem autenticação, sem editar/despublicar, visibilidade de perfil suspenso indefinida) e os resultados das decisões D-UC03-01 a D-UC03-07.

## Origem

Rastreabilidade do planejamento; `casos-de-uso.md` UC03.

## Escopo

**Inclui:** README, `requests.http` e registro de limitações e decisões.

**Não inclui:** Alteração de código.

## Critérios de aceite

- [ ] Os exemplos do `requests.http` são executáveis e cobrem sucesso e as recusas principais.
- [ ] As limitações conhecidas estão listadas com a decisão correspondente.
- [ ] O README aponta para este planejamento.

## Dependências

| Depende de | Tipo | Necessidade |
| --- | --- | --- |
| {{SUB-05}} | Interna | Documenta o comportamento final. |

## Responsável

@leohsm

## Estado inicial recomendado

`Backlog`

## Evidências esperadas

Pull Request com a documentação revisada.
<!-- SUB-06:END -->

---
