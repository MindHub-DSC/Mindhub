# 01-04 — Sub-Issues completas

**Caso de uso:** UC07 — Aceitar Proposta
**Issue principal:** `[UC07] Aceitar Proposta`

Cada Sub-Issue abaixo está pronta para publicação. O texto entre os marcadores `START` e `END` é o corpo da issue. `{{EPIC}}` e `{{SUB-XX}}` são substituídos pelos números reais na criação. `{{UC05-SUB-XX}}` aponta para Sub-Issues do UC05 e é substituído da mesma forma, depois que o UC05 for publicado.

---

## SUB-01

**Título:** `[UC07-SUB-01] Implementar o aceite no Agregado Proposta`
**Labels:** `usecase:uc07`, `domain:negociacao`, `type:feature`, `layer:domain`, `priority:high`

<!-- SUB-01:START -->
> **Issue Principal:** Relacionada ao Épico {{EPIC}}

## Objetivo

Proteger o ciclo de vida da Proposta no momento do aceite: só a versão vigente de uma Proposta `Enviada` ou `Em revisão` pode ser aceita, e uma Proposta `Aceita` não volta a ser negociada.

## Descrição

Adicionar ao Agregado Proposta, criado no UC06, o comportamento `aceitar(versaoIndicada, agora)`. O agregado verifica, nesta ordem:

1. a situação permite aceite (`Enviada` ou `Em revisão`); `Recusada` e `Expirada` são recusadas; `Aceita` é recusada como "já aceita";
2. a versão indicada é a vigente; caso contrário, recusa informando a versão vigente;
3. a validade das Condições Comerciais da versão vigente não venceu em `agora` (D-UC07-04). Validade vencida é recusada como expirada, **sem** mudar a situação: a expiração por tempo não faz parte deste épico.

No sucesso, a Proposta passa a `Aceita`, guarda o número da versão aceita e o instante do aceite. O relógio é recebido como parâmetro, nunca lido dentro do domínio. Depois do aceite, a operação de nova versão do UC06 recusa a Proposta (POS-03).

## Origem

- Fluxo principal, passos 2 e 3; FE-01; FE-02; POS-01; POS-03
- RN05 — `trabalho3.md` §9; ciclo de vida da Proposta — `trabalho3.md` §11.1
- `trabalho5.md` §6.3

## Escopo

**Inclui:** comportamento `aceitar`, erros de domínio (`VersaoNaoVigente`, `PropostaNaoAceitavel`, `PropostaJaAceita`), testes de cada transição válida e inválida.

**Não inclui:** criar Proposta e versões (UC06); recusar proposta; expirar proposta por tempo; Representante (D-UC07-01).

## Critérios de aceite

- [ ] Proposta `Enviada` aceita a versão vigente e passa a `Aceita`, com versão aceita e instante registrados.
- [ ] Proposta `Em revisão` aceita a versão vigente e passa a `Aceita`.
- [ ] Versão diferente da vigente é recusada com `VersaoNaoVigente`, que informa a versão vigente; a situação não muda.
- [ ] Proposta `Recusada` ou `Expirada` é recusada com `PropostaNaoAceitavel`; a situação não muda.
- [ ] Proposta `Aceita` é recusada com `PropostaJaAceita`.
- [ ] Validade vencida em `agora` é recusada como expirada, conforme D-UC07-04, registrada nesta issue antes de `Ready`.
- [ ] Depois do aceite, criar nova versão é recusado (POS-03).
- [ ] O domínio não lê o relógio do sistema.

## Dependências

| Depende de | Tipo | Necessidade |
| --- | --- | --- |
| UC06 — Enviar Proposta | Externa (não planejada) | Agregado Proposta, versões e Condições Comerciais |
| D-UC07-03 | Decisão | Como a versão é identificada |
| D-UC07-04 | Decisão | Validade vencida no momento do aceite |

Esta issue fornece o comportamento consumido pela {{SUB-03}} e pela {{SUB-04}}.

## Responsável

@leohsm

## Estado inicial recomendado

`Backlog`

## Evidências esperadas

Pull Request com o comportamento de aceite e os testes de domínio; saída de `pnpm test` sem falhas.
<!-- SUB-01:END -->

---

## SUB-02

**Título:** `[UC07-SUB-02] Modelar Contratação Sob Proposta com snapshot imutável`
**Labels:** `usecase:uc07`, `domain:negociacao`, `type:feature`, `layer:domain`, `priority:high`

<!-- SUB-02:START -->
> **Issue Principal:** Relacionada ao Épico {{EPIC}}

## Objetivo

Preservar o acordo: a Contratação guarda uma cópia imutável das Condições Comerciais aceitas e identifica a versão da Proposta que lhe deu origem.

## Descrição

Criar a entidade `Contratacao` com identidade própria, origem `SOB_PROPOSTA`, referências à Proposta, à Solicitação, ao cliente e ao Perfil de Especialista, número da versão aceita, snapshot das Condições Comerciais e instante de formação. A fábrica `formarSobProposta(...)` recebe os valores já conferidos (número da versão e condições) e não a Proposta inteira, para que C3 não precise expor o agregado. O snapshot é uma cópia profunda e congelada; nenhuma operação altera as condições depois da formação (ADR-04).

A Contratação não recebe ciclo de vida neste épico (D-UC07-06). O `trabalho2.1.md` §13.4 propôs um ciclo (`Formada → Aguardando Pagamento → Ativa → Concluída`, ou `Cancelada`) como hipótese inicial, mas o `trabalho3.md` §11 não o manteve; ele deve ser revisto junto com UC10 e UC12. Os campos das Condições Comerciais são os definidos pelo UC06 (`trabalho3.md` §5.2); valores monetários usam o objeto de valor Dinheiro (valor e moeda).

## Origem

- Fluxo principal, passo 5; POS-02
- RN04, RN05 — `trabalho3.md` §9; INV-01 e INV-02 — `trabalho3.md` §10
- `trabalho4.md` §12.4 (ADR-04), §13.4.3

## Escopo

**Inclui:** entidade, fábrica, snapshot imutável, testes de domínio.

**Não inclui:** Contratação de Reserva Direta (UC08); situações da Contratação; persistência (SUB-03).

## Critérios de aceite

- [ ] Uma Contratação formada contém a versão aceita, o snapshot das condições e as referências de origem.
- [ ] Formar Contratação Sob Proposta sem versão aceita é recusado pelo domínio (INV-01).
- [ ] Alterar o objeto de condições usado na formação não altera a Contratação.
- [ ] Tentar alterar o snapshot depois da formação falha ou não tem efeito.
- [ ] Valor e moeda do preço acordado são preservados sem conversão nem arredondamento.

## Dependências

| Depende de | Tipo | Necessidade |
| --- | --- | --- |
| UC06 — Enviar Proposta | Externa (não planejada) | Estrutura da Versão da Proposta e das Condições Comerciais |

Esta issue fornece a entidade consumida pela {{SUB-03}} e pela {{SUB-04}}.

## Responsável

@leohsm

## Estado inicial recomendado

`Backlog`

## Evidências esperadas

Pull Request com a entidade e os testes de imutabilidade; saída de `pnpm test` sem falhas.
<!-- SUB-02:END -->

---

## SUB-03

**Título:** `[UC07-SUB-03] Registrar aceite e Contratação na mesma unidade de consistência`
**Labels:** `usecase:uc07`, `domain:negociacao`, `type:feature`, `layer:repository`, `priority:high`

<!-- SUB-03:START -->
> **Issue Principal:** Relacionada ao Épico {{EPIC}}

## Objetivo

Garantir que aceite e Contratação sejam gravados juntos e que uma Proposta forme no máximo uma Contratação, mesmo com aceites simultâneos ou com uma nova versão enviada durante o aceite.

## Descrição

Definir a porta de persistência do aceite. Proposta de assinatura: `registrarAceite(proposta, contratacao): Promise<'REGISTRADO' | 'VERSAO_ALTERADA' | 'JA_ACEITA'>` e `buscarContratacaoPorProposta(propostaId)`. Na mesma operação atômica, o adaptador:

1. confere que a versão vigente gravada ainda é a versão aceita e que a Proposta gravada ainda não está `Aceita`;
2. confere que não existe Contratação para a Proposta;
3. grava a Proposta `Aceita` e a Contratação.

Se qualquer conferência falhar, nada é gravado. No adaptador em memória, conferência e gravação acontecem sem `await` entre elas. A suíte de contrato da porta é escrita para ser reaproveitada pelo adaptador durável, que usará transação.

A operação de nova versão do UC06 precisa respeitar o mesmo controle (TC-C3-01). Se o UC06 for implementado depois, este requisito deve ser registrado na issue correspondente.

## Origem

- Fluxo principal, passo 5; FE-03
- CARD-01 Proposta — Contratação `1 : 0..1` — `trabalho3.md` §8
- TC-C3-01 — `trabalho4.md` §9.6

## Escopo

**Inclui:** porta, adaptador em memória, cópias defensivas, testes de contrato e de concorrência.

**Não inclui:** persistência durável; repositório de Propostas em si (UC06).

## Critérios de aceite

- [ ] Aceite válido grava Proposta `Aceita` e Contratação juntas; ambas podem ser lidas depois.
- [ ] Dois `registrarAceite` concorrentes para a mesma Proposta resultam em um `REGISTRADO` e um `JA_ACEITA`; existe uma única Contratação.
- [ ] Nova versão gravada entre a leitura e o registro resulta em `VERSAO_ALTERADA`; nada é gravado.
- [ ] Em qualquer resultado diferente de `REGISTRADO`, nem a Proposta nem a Contratação mudam.
- [ ] `buscarContratacaoPorProposta` devolve a Contratação formada ou ausência.
- [ ] Alterar os objetos originais depois do registro não altera o que foi gravado.

## Dependências

| Depende de | Tipo | Necessidade |
| --- | --- | --- |
| {{SUB-01}} | Implementação | Proposta com aceite |
| {{SUB-02}} | Implementação | Entidade Contratação |
| UC06 — Enviar Proposta | Externa (não planejada) | Repositório de Propostas e operação de nova versão |

Esta issue fornece a porta consumida pela {{SUB-04}}.

## Responsável

@leohsm

## Estado inicial recomendado

`Backlog`

## Evidências esperadas

Pull Request com porta, adaptador e testes de contrato e de concorrência; saída de `pnpm test` sem falhas.
<!-- SUB-03:END -->

---

## SUB-04

**Título:** `[UC07-SUB-04] Implementar serviço de aplicação Aceitar Proposta`
**Labels:** `usecase:uc07`, `domain:negociacao`, `type:feature`, `layer:application`, `priority:high`

<!-- SUB-04:START -->
> **Issue Principal:** Relacionada ao Épico {{EPIC}}

## Objetivo

Coordenar o caso de uso: confirmar que quem aceita é o cliente da Solicitação, aceitar a versão indicada, formar e registrar a Contratação e informar as partes.

## Descrição

Criar o serviço `AceitarProposta`, que recebe um Command com `clienteId`, `propostaId` e `versao`. Ordem:

1. carregar a Proposta (`PropostaNaoEncontrada`);
2. carregar a Solicitação respondida pela Proposta, para obter cliente e especialista (D-UC07-09: leitura por identificador acrescentada ao repositório de Solicitações do UC05);
3. verificar que o agente é o cliente da Solicitação (`AgenteNaoAutorizado`, D-UC07-07);
4. se a Proposta já estiver `Aceita`, recusar com `PropostaJaAceita`, informando a referência da Contratação existente (D-UC07-05);
5. aceitar no domínio com o relógio injetado;
6. formar a Contratação;
7. registrar pela porta da {{SUB-03}}; `VERSAO_ALTERADA` vira `VersaoNaoVigente`, `JA_ACEITA` vira `PropostaJaAceita`;
8. avisar cliente e especialista pela porta de aviso de C3. A falha do aviso não desfaz o aceite.

Criar também a Query `ConsultarPropostaVigente` (passo 1), que devolve situação, número e Condições Comerciais da versão vigente, apenas ao cliente da Solicitação. O serviço depende só de portas.

## Origem

- Fluxo principal, passos 1 a 6; PRE-01; FE-01; FE-02; FE-03
- `trabalho5.md` §2.2 (falha de notificação não invalida o resultado)
- `trabalho4.md` §13.4.3 (preservar o acordo)

## Escopo

**Inclui:** serviço, Command, Query, erros de aplicação, extensão da porta de aviso com o aviso de aceite, leitura da Solicitação por identificador, testes com dublês.

**Não inclui:** Representante (D-UC07-01); regra sobre especialista suspenso (D-UC07-02); agendamento (UC09).

## Critérios de aceite

- [ ] Cliente da Solicitação + versão vigente → Contratação registrada e aviso solicitado às duas partes.
- [ ] Proposta inexistente → `PropostaNaoEncontrada`; nada é gravado.
- [ ] Agente diferente do cliente → `AgenteNaoAutorizado`; nada é gravado.
- [ ] Versão não vigente → `VersaoNaoVigente` com a versão atual; nada é gravado.
- [ ] Proposta já aceita → `PropostaJaAceita` com a referência da Contratação existente; nenhuma Contratação nova.
- [ ] Falha do aviso → o aceite continua registrado e o resultado é sucesso.
- [ ] A Query devolve a versão vigente ao cliente e recusa outro agente.
- [ ] O serviço não importa classes do NestJS HTTP nem de outros contextos.

## Dependências

| Depende de | Tipo | Necessidade |
| --- | --- | --- |
| {{SUB-01}} | Implementação | Aceite no domínio |
| {{SUB-02}} | Implementação | Entidade Contratação |
| {{SUB-03}} | Contrato | Assinatura da porta de registro do aceite |
| {{UC05-SUB-02}} | Implementação | Solicitação e seu repositório |
| {{UC05-SUB-03}} | Contrato | Porta de aviso de C3 |

## Responsável

@leohsm

## Estado inicial recomendado

`Backlog`

## Evidências esperadas

Pull Request com o serviço, a Query e os testes de cada cenário; saída de `pnpm test` sem falhas.
<!-- SUB-04:END -->

---

## SUB-05

**Título:** `[UC07-SUB-05] Expor endpoints HTTP e verificar o aceite de ponta a ponta`
**Labels:** `usecase:uc07`, `domain:negociacao`, `type:feature`, `layer:api`, `layer:integration`, `priority:medium`

<!-- SUB-05:START -->
> **Issue Principal:** Relacionada ao Épico {{EPIC}}

## Objetivo

Disponibilizar a consulta e o aceite pela API e comprovar o fluxo completo com os módulos reais ligados, inclusive sob concorrência.

## Descrição

Criar `GET /propostas/{id}` (versão vigente) e `POST /propostas/{id}/aceite` com schema estrito (`clienteId`, `versao`). Ligar as portas aos adaptadores reais no módulo de C3. Traduzir resultados conforme a proposta abaixo (D-UC07-08), a confirmar nesta issue:

| Situação | Resposta |
| --- | --- |
| Consulta da versão vigente | 200, com `id`, `situacao`, `versaoVigente` e condições |
| Aceite registrado | 201, com `contratacaoId`, `propostaId`, `versaoAceita`, condições e `formadaEm` |
| Formato inválido ou campo não previsto | 400 |
| Proposta inexistente | 404 |
| Agente não é o cliente da Solicitação | 403 |
| Versão não vigente | 409, informando a versão vigente |
| Proposta recusada, expirada ou com validade vencida | 409 |
| Proposta já aceita | 409, com a referência da Contratação (D-UC07-05) |
| Falha técnica de armazenamento | 503 |

Na consulta, a origem de `clienteId` segue D1; até lá, é recebida como parâmetro de consulta.

## Origem

- Fluxo principal, passos 1, 2 e 6; FE-01; FE-02; FE-03
- `trabalho5.md` §16 (padrões HTTP do projeto, D1)

## Escopo

**Inclui:** controller, schemas, tradução de erros, ligação no módulo de C3, testes HTTP de ponta a ponta, teste de concorrência e regressão dos casos de uso anteriores.

**Não inclui:** autenticação; endpoints de envio e revisão de proposta (UC06).

## Critérios de aceite

- [ ] Solicitação criada por `POST /solicitacoes` e Proposta enviada pelo UC06 permitem consultar e aceitar a versão vigente com 201.
- [ ] Dois `POST /propostas/{id}/aceite` simultâneos resultam em um 201 e um 409; existe uma única Contratação.
- [ ] Cada linha da tabela de respostas está coberta por teste HTTP.
- [ ] A origem de `clienteId` segue a decisão D1, registrada nesta issue antes de `Ready`.
- [ ] Testes de UC01, UC02, UC05 e UC07 passam juntos; `pnpm lint` e `pnpm build` sem erros.

## Dependências

| Depende de | Tipo | Necessidade |
| --- | --- | --- |
| {{SUB-04}} | Contrato | Serviço, Query e seus erros |
| {{SUB-01}}, {{SUB-02}}, {{SUB-03}} | Integração | Implementações reais ligadas |
| {{UC05-SUB-05}} | Integração | `POST /solicitacoes` disponível para os testes de ponta a ponta |
| UC06 — Enviar Proposta | Externa (não planejada) | Criar propostas pela API |
| D1 | Decisão | Origem de `clienteId` |

## Responsável

@leohsm

## Estado inicial recomendado

`Backlog`

## Evidências esperadas

Pull Request com controller e testes HTTP; saídas de `pnpm test`, `pnpm lint` e `pnpm build`.
<!-- SUB-05:END -->

---

## SUB-06

**Título:** `[UC07-SUB-06] Documentar o UC07 e os endpoints`
**Labels:** `usecase:uc07`, `domain:negociacao`, `type:docs`, `priority:low`

<!-- SUB-06:START -->
> **Issue Principal:** Relacionada ao Épico {{EPIC}}

## Objetivo

Manter a documentação do backend coerente com o comportamento do UC07.

## Descrição

Atualizar o README do backend com objetivo, regras (RN04, RN05), exemplos de requisição e resposta, códigos HTTP e limitações: `clienteId` no corpo e na consulta (D1), Representante fora (D-UC07-01), especialista suspenso sem regra (D-UC07-02), Contratação sem ciclo de vida (D-UC07-06). Incluir exemplos em `requests.http`.

## Origem

- Rastreabilidade do caso de uso; `trabalho5.md` §24 (documentos mudam no mesmo PR)

## Escopo

**Inclui:** README, `requests.http`, limitações conhecidas.

**Não inclui:** documentação de outros casos de uso.

## Critérios de aceite

- [ ] O README descreve os dois endpoints, as respostas e as limitações.
- [ ] Os exemplos de `requests.http` executam localmente com o resultado descrito.
- [ ] As decisões D1, D-UC07-01, D-UC07-02 e D-UC07-06 aparecem como limitações conhecidas.

## Dependências

| Depende de | Tipo | Necessidade |
| --- | --- | --- |
| {{SUB-05}} | Contrato | Endpoints e respostas definidos |

## Responsável

@leohsm

## Estado inicial recomendado

`Backlog`

## Evidências esperadas

Pull Request com README e `requests.http` atualizados.
<!-- SUB-06:END -->
