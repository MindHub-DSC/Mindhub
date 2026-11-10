# 01-04 — Sub-Issues completas

**Caso de uso:** UC05 — Enviar Solicitação de Atendimento
**Issue principal:** `[UC05] Enviar Solicitação de Atendimento`

Cada Sub-Issue abaixo está pronta para publicação. O texto entre os marcadores `START` e `END` é o corpo da issue. `{{EPIC}}` e `{{SUB-XX}}` são substituídos pelos números reais na criação.

---

## SUB-01

**Título:** `[UC05-SUB-01] Expor visão pública de habilitação do especialista (C2)`
**Labels:** `usecase:uc05`, `domain:oferta`, `type:feature`, `layer:application`, `priority:high`

<!-- SUB-01:START -->
> **Issue Principal:** Relacionada ao Épico {{EPIC}}

## Objetivo

Permitir que C3 saiba se um Perfil de Especialista existe e pode receber novas solicitações, sem acessar o modelo do perfil e sem reinterpretar a situação `ATIVO`.

## Descrição

Definir em C2 uma interface pública por propósito. Proposta de assinatura: `consultar(perfilId: string): Promise<'HABILITADO' | 'NAO_HABILITADO' | 'NAO_ENCONTRADO'>`. A decisão "perfil `ATIVO` → habilitado" fica dentro de C2 (RN01). Para implementá-la, o repositório de perfis ganha uma leitura por identificador, operação que o UC02 adiou para quando UC03/UC05 precisassem dela. A interface é exportada por um token de injeção; `PerfilEspecialista` e o repositório continuam internos.

## Origem

- Fluxo principal, passo 3; exceções FE-01 e FE-02 (especialista)
- RN01 — `trabalho3.md` §9
- `trabalho4.md` §6.1 (R2), §7 (comunicação síncrona), §12.4 (ADR-04), §13.4.1
- `trabalho5.md` §15.1 (leitura adiada para UC03/UC05)

## Escopo

**Inclui:** interface e token; leitura por identificador no contrato do repositório de perfis e no adaptador em memória; implementação da consulta; testes unitários e de contrato.

**Não inclui:** suspender ou reativar perfil (UC18/UC19); listagem de perfis; visão do Serviço (SUB-06).

## Critérios de aceite

- [ ] Perfil `ATIVO` é informado como `HABILITADO`.
- [ ] Perfil `SUSPENSO` é informado como `NAO_HABILITADO`.
- [ ] Identificador sem perfil é informado como `NAO_ENCONTRADO`.
- [ ] A resposta não expõe descrição, especialidades nem a referência do usuário.
- [ ] O módulo de C2 exporta o token da interface, e não o repositório nem a entidade.
- [ ] Falha técnica do armazenamento não é traduzida como `NAO_ENCONTRADO`.
- [ ] Os testes do UC02 continuam passando.

## Dependências

| Depende de | Tipo | Necessidade |
| --- | --- | --- |
| #3 (UC02) | Implementação | Perfil de Especialista e repositório de perfis existentes |

Esta issue fornece o contrato consumido pela {{SUB-04}}.

## Responsável

@leohsm

## Estado inicial recomendado

`Backlog`

## Evidências esperadas

Pull Request com a interface, a leitura por identificador e os testes; saída de `pnpm test` sem falhas.
<!-- SUB-01:END -->

---

## SUB-02

**Título:** `[UC05-SUB-02] Modelar Solicitação e implementar persistência em memória`
**Labels:** `usecase:uc05`, `domain:negociacao`, `type:feature`, `layer:domain`, `layer:repository`, `priority:high`

<!-- SUB-02:START -->
> **Issue Principal:** Relacionada ao Épico {{EPIC}}

## Objetivo

Representar no domínio de C3 a necessidade enviada pelo cliente e guardá-la atrás de uma porta de persistência.

## Descrição

Criar a entidade `Solicitacao` com identidade própria, referência ao cliente, referência ao Perfil de Especialista destinatário, `Objetivo` e `Escopo` como objetos de valor, situação `ENVIADA` e data de envio. A criação aplica as invariantes de Objetivo e Escopo (não vazios após `trim`). Definir a porta `SolicitacoesRepositorio` com `adicionar(solicitacao): Promise<void>` e um adaptador em memória que guarda cópias defensivas. Não há regra de unicidade: um cliente pode ter várias solicitações (`1 : 0..*`).

## Origem

- Fluxo principal, passos 2 e 5; POS-01
- `trabalho3.md` §5.1 (Solicitação), §5.2 (Objetivo, Escopo), §8 (Usuário — Solicitação `1 : 0..*`; Perfil — Solicitação `1 : 0..*`)
- `trabalho4.md` §3.3 (C3)

## Escopo

**Inclui:** entidade, objetos de valor, situação `ENVIADA`, porta e adaptador em memória, testes de domínio e de contrato do repositório.

**Não inclui:** outras situações da Solicitação; referência ao Serviço (SUB-06); consulta ou listagem; persistência durável.

## Critérios de aceite

- [ ] Uma Solicitação válida nasce `ENVIADA`, com identidade, data de envio e um único especialista destinatário.
- [ ] Objetivo vazio ou só com espaços é recusado pelo domínio.
- [ ] Escopo vazio ou só com espaços é recusado pelo domínio.
- [ ] O limite máximo de Objetivo e Escopo segue a decisão D-UC05-03, registrada nesta issue antes de `Ready`.
- [ ] O adaptador em memória guarda cópias: alterar o objeto original depois de `adicionar` não altera o registro.
- [ ] Duas solicitações do mesmo cliente para o mesmo especialista são aceitas pelo repositório.

## Dependências

| Depende de | Tipo | Necessidade |
| --- | --- | --- |
| D-UC05-03 | Decisão | Limite máximo de Objetivo e Escopo |

Esta issue fornece a entidade e a porta consumidas pela {{SUB-04}}.

## Responsável

@leohsm

## Estado inicial recomendado

`Backlog`

## Evidências esperadas

Pull Request com entidade, objetos de valor, porta, adaptador e testes; saída de `pnpm test` sem falhas.
<!-- SUB-02:END -->

---

## SUB-03

**Título:** `[UC05-SUB-03] Definir porta de aviso ao especialista com falha tolerada`
**Labels:** `usecase:uc05`, `domain:negociacao`, `type:feature`, `layer:adapter`, `priority:medium`

<!-- SUB-03:START -->
> **Issue Principal:** Relacionada ao Épico {{EPIC}}

## Objetivo

Avisar o especialista de que recebeu uma solicitação, sem que uma falha de entrega invalide a Solicitação já registrada.

## Descrição

Definir a porta `AvisoDeSolicitacao` com uma operação que recebe apenas o necessário para o aviso (identificador da Solicitação e do Perfil destinatário). Criar um adaptador em memória que registra os avisos entregues e permite simular falha. Quando a entrega falhar, a falha é registrada como pendência e não é propagada como erro do caso de uso. A reentrega automática não faz parte desta issue (D-UC05-02).

## Origem

- Fluxo principal, passo 6; FA-02; POS-02
- `trabalho5.md` §2.2 (Serviço de notificações: falha não invalida o resultado principal)
- `trabalho4.md` §7 (falha de notificação; registro do fato a entregar)

## Escopo

**Inclui:** porta, adaptador em memória com simulação de falha, registro de pendência, testes.

**Não inclui:** integração com serviço real de notificações; reentrega; preferências de canal.

## Critérios de aceite

- [ ] Um aviso entregue fica registrado no adaptador com a referência da Solicitação.
- [ ] Uma falha simulada não lança erro para quem chamou e fica registrada como pendente.
- [ ] O aviso não carrega Objetivo, Escopo nem dados cadastrais do cliente.
- [ ] A porta pode ser reutilizada para outros avisos de C3 (UC07) sem mudar sua assinatura atual.

## Dependências

| Depende de | Tipo | Necessidade |
| --- | --- | --- |
| — | — | Nenhuma dependência de entrada |

Esta issue fornece a porta consumida pela {{SUB-04}}.

## Responsável

@leohsm

## Estado inicial recomendado

`Backlog`

## Evidências esperadas

Pull Request com porta, adaptador e testes de entrega e de falha; saída de `pnpm test` sem falhas.
<!-- SUB-03:END -->

---

## SUB-04

**Título:** `[UC05-SUB-04] Implementar serviço de aplicação Enviar Solicitação`
**Labels:** `usecase:uc05`, `domain:negociacao`, `type:feature`, `layer:application`, `priority:high`

<!-- SUB-04:START -->
> **Issue Principal:** Relacionada ao Épico {{EPIC}}

## Objetivo

Coordenar o caso de uso: reconhecer o cliente, verificar a habilitação do especialista, registrar a Solicitação e avisar o especialista.

## Descrição

Criar o serviço de aplicação `EnviarSolicitacao`, que recebe um Command com `clienteId`, `perfilEspecialistaId`, `objetivo` e `escopo`. Ordem: (1) reconhecer o cliente pela porta de C1 do UC02; (2) consultar a habilitação pela porta da {{SUB-01}}; (3) criar a Solicitação no domínio; (4) adicioná-la ao repositório; (5) avisar o especialista. O aviso só ocorre depois do registro. O serviço depende apenas de portas.

Erros de aplicação: `ClienteNaoReconhecido`, `EspecialistaNaoEncontrado`, `EspecialistaNaoHabilitado`. Falhas técnicas das portas de C1 e C2 são propagadas como indisponibilidade, nunca como "não encontrado".

## Origem

- Fluxo principal, passos 1 a 6; PRE-01; FE-01; FE-02; FA-02
- RN01 — `trabalho3.md` §9
- `trabalho4.md` §13.4.1 (registrar solicitação)

## Escopo

**Inclui:** serviço, Command, erros de aplicação, testes com dublês das portas.

**Não inclui:** Serviço indicado (SUB-06); Representante (D-UC05-01); regra sobre autossolicitação (D-UC05-04).

## Critérios de aceite

- [ ] Cliente reconhecido + especialista habilitado → Solicitação `ENVIADA` registrada e aviso solicitado.
- [ ] Cliente não reconhecido → `ClienteNaoReconhecido`; nada é registrado nem avisado.
- [ ] Especialista inexistente → `EspecialistaNaoEncontrado`; nada é registrado.
- [ ] Especialista não habilitado → `EspecialistaNaoHabilitado`; nada é registrado.
- [ ] Falha do aviso → a Solicitação continua registrada e o resultado é sucesso.
- [ ] Falha técnica de C1 ou C2 não vira erro de negócio.
- [ ] O serviço não importa classes de C1, de C2 nem do NestJS HTTP.

## Dependências

| Depende de | Tipo | Necessidade |
| --- | --- | --- |
| {{SUB-01}} | Contrato | Assinatura da visão de habilitação |
| {{SUB-02}} | Implementação | Entidade e porta de persistência |
| {{SUB-03}} | Contrato | Assinatura da porta de aviso |
| #2 (UC02) | Contrato | Porta `ReconhecimentoDeUsuario` de C1 |

## Responsável

@leohsm

## Estado inicial recomendado

`Backlog`

## Evidências esperadas

Pull Request com o serviço e os testes de cada cenário; saída de `pnpm test` sem falhas.
<!-- SUB-04:END -->

---

## SUB-05

**Título:** `[UC05-SUB-05] Expor endpoint HTTP e integrar C1, C2 e C3 com testes de ponta a ponta`
**Labels:** `usecase:uc05`, `domain:negociacao`, `type:feature`, `layer:api`, `layer:integration`, `priority:medium`

<!-- SUB-05:START -->
> **Issue Principal:** Relacionada ao Épico {{EPIC}}

## Objetivo

Disponibilizar o UC05 pela API e comprovar o fluxo completo com os módulos reais ligados.

## Descrição

Criar `POST /solicitacoes` com schema estrito (`clienteId`, `perfilEspecialistaId`, `objetivo`, `escopo`). Registrar o módulo de C3 no `AppModule` e ligar as portas aos adaptadores reais (C1 do UC02, C2 da {{SUB-01}}, repositório e aviso em memória). Traduzir resultados para HTTP conforme a proposta abaixo (D-UC05-05), a confirmar nesta issue:

| Situação | Resposta |
| --- | --- |
| Solicitação registrada | 201, com `id`, `perfilEspecialistaId`, `objetivo`, `escopo`, `situacao: ENVIADA`, `enviadaEm` |
| Formato inválido ou campo não previsto | 400 |
| Objetivo ou Escopo inválido no domínio | 400 |
| Cliente ou especialista não reconhecido | 422 (padrão D5 do UC02) |
| Especialista não habilitado | 409, mensagem genérica (D-UC05-07) |
| Falha técnica de C1, C2 ou armazenamento | 503 |

## Origem

- Fluxo principal, passos 1, 2 e 6; FE-01; FE-02; entrada inválida
- `trabalho5.md` §16 (padrões HTTP do projeto, D1 e D5)

## Escopo

**Inclui:** controller, schema, tradução de erros, módulo de C3, testes HTTP de ponta a ponta, regressão de UC01 e UC02.

**Não inclui:** campo de Serviço (SUB-06); autenticação.

## Critérios de aceite

- [ ] Usuário criado em `POST /usuarios`, com perfil criado em `POST /especialistas` por outro usuário, permite enviar solicitação e recebe 201.
- [ ] Cada linha da tabela de respostas está coberta por teste HTTP.
- [ ] A origem de `clienteId` segue a decisão D1, registrada nesta issue antes de `Ready`.
- [ ] Testes de UC01, UC02 e UC05 passam juntos; `pnpm lint` e `pnpm build` sem erros.

## Dependências

| Depende de | Tipo | Necessidade |
| --- | --- | --- |
| {{SUB-04}} | Contrato | Assinatura do serviço e seus erros |
| {{SUB-01}}, {{SUB-02}}, {{SUB-03}} | Integração | Implementações reais ligadas |
| #6 (UC02) | Integração | `POST /especialistas` disponível para os testes de ponta a ponta |
| D1 | Decisão | Origem de `clienteId` |

## Responsável

@leohsm

## Estado inicial recomendado

`Backlog`

## Evidências esperadas

Pull Request com controller, módulo e testes HTTP; saídas de `pnpm test`, `pnpm lint` e `pnpm build`.
<!-- SUB-05:END -->

---

## SUB-06

**Título:** `[UC05-SUB-06] Estender o envio para Serviço indicado (RN13)`
**Labels:** `usecase:uc05`, `domain:oferta`, `domain:negociacao`, `type:feature`, `layer:application`, `layer:api`, `priority:low`

<!-- SUB-06:START -->
> **Issue Principal:** Relacionada ao Épico {{EPIC}}

## Objetivo

Aplicar o passo 4 do fluxo: quando o cliente indicar um Serviço, aceitar a solicitação somente se o Serviço for do especialista escolhido e for Sob Proposta.

## Descrição

Definir em C2 uma visão pública do Serviço que informe se ele existe, a qual perfil pertence e seu Modelo de Contratação, sem expor o catálogo completo. A interpretação de "permite o caminho Sob Proposta" é de C3 (`trabalho4.md` §13.4.1). Adicionar `servicoId` opcional ao schema, à Solicitação e ao serviço de aplicação. Recusar Serviço de Reserva Direta com orientação para o UC08.

**Bloqueio:** o UC03 (Publicar Serviço) ainda não foi especificado nem planejado. Esta issue só pode ir para `Ready` depois que o Serviço e seu Modelo de Contratação existirem.

## Origem

- Fluxo principal, passos 1 e 4; FE-02 (Serviço); FE-03
- RN13 — `trabalho3.md` §9; `trabalho4.md` §6.1 (R2)

## Escopo

**Inclui:** visão pública do Serviço em C2; campo opcional; regra de C3; tradução HTTP; testes de domínio, aplicação e HTTP.

**Não inclui:** publicar Serviço (UC03); contratar Reserva Direta (UC08).

## Critérios de aceite

- [ ] Serviço Sob Proposta do especialista escolhido → solicitação registrada com a referência do Serviço.
- [ ] Serviço de Reserva Direta → recusa com orientação para contratar diretamente; nada é registrado.
- [ ] Serviço inexistente ou de outro especialista → recusa; nada é registrado.
- [ ] Sem `servicoId`, o comportamento da {{SUB-05}} não muda.
- [ ] C3 não importa a entidade Serviço de C2.

## Dependências

| Depende de | Tipo | Necessidade |
| --- | --- | --- |
| UC03 — Publicar Serviço | Externa (não planejada) | Serviço com Modelo de Contratação |
| {{SUB-05}} | Implementação | Fluxo base integrado |

## Responsável

@leohsm

## Estado inicial recomendado

`Backlog`

## Evidências esperadas

Pull Request com a visão de C2, a extensão de C3 e os testes; saída de `pnpm test` sem falhas.
<!-- SUB-06:END -->

---

## SUB-07

**Título:** `[UC05-SUB-07] Documentar o UC05 e o endpoint`
**Labels:** `usecase:uc05`, `domain:negociacao`, `type:docs`, `priority:low`

<!-- SUB-07:START -->
> **Issue Principal:** Relacionada ao Épico {{EPIC}}

## Objetivo

Manter a documentação do backend coerente com o comportamento do UC05.

## Descrição

Atualizar o README do backend com objetivo, regras (RN01, RN13), exemplos de requisição e resposta, códigos HTTP e limitações: `clienteId` no corpo (D1), Representante fora (D-UC05-01), aviso sem reentrega (D-UC05-02). Incluir exemplos em `requests.http`.

## Origem

- Rastreabilidade do caso de uso; `trabalho5.md` §24 (documentos mudam no mesmo PR)

## Escopo

**Inclui:** README, `requests.http`, limitações conhecidas.

**Não inclui:** documentação de outros casos de uso.

## Critérios de aceite

- [ ] O README descreve o endpoint, as respostas e as limitações.
- [ ] Os exemplos de `requests.http` executam localmente com o resultado descrito.
- [ ] As decisões D1, D-UC05-01 e D-UC05-02 aparecem como limitações conhecidas.

## Dependências

| Depende de | Tipo | Necessidade |
| --- | --- | --- |
| {{SUB-05}} | Contrato | Endpoint e respostas definidos |

## Responsável

@leohsm

## Estado inicial recomendado

`Backlog`

## Evidências esperadas

Pull Request com README e `requests.http` atualizados.
<!-- SUB-07:END -->
