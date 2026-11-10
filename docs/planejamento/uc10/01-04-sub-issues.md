# 01-04 — Sub-Issues completas

**Caso de uso:** UC10 — Pagar Reserva
**Issue principal:** `[UC10] Pagar Reserva`

Cada Sub-Issue abaixo está pronta para publicação. O texto entre os marcadores `START` e `END` é o corpo da issue. `{{EPIC}}` e `{{SUB-XX}}` são substituídos pelos números reais na criação. `{{UC07-SUB-XX}}` aponta para Sub-Issues do UC07 e é substituído da mesma forma, depois que o UC07 for publicado.

---

## SUB-01

**Título:** `[UC10-SUB-01] [C5] Modelar Pagamento e seu ciclo de vida com persistência em memória`
**Labels:** `usecase:uc10`, `domain:pagamentos`, `type:feature`, `layer:domain`, `layer:repository`, `priority:high`

<!-- SUB-01:START -->
> **Issue Principal:** Relacionada ao Épico {{EPIC}}

## Objetivo

Representar em C5 cada tentativa financeira como um Pagamento com identidade própria, valor esperado e ciclo de vida sem estados mutuamente exclusivos.

## Descrição

Criar o objeto de valor `Dinheiro` (valor inteiro em unidade monetária mínima e moeda; igualdade por valor e moeda) e o Agregado `Pagamento`, com identidade, referências à Contratação e à Reserva, valor esperado, situação e versão da transição (número crescente por Pagamento). O Pagamento nasce `Pendente`. A operação `registrarResultado(resultado, valorInformado, instante)` aplica:

| Situação atual | Resultado | Efeito |
| --- | --- | --- |
| `Pendente` | Aprovado / Recusado / Expirado | Transição; versão incrementada; fato a publicar |
| Igual ao resultado recebido | Mesmo resultado | `JA_REGISTRADO`; nada muda (RN06) |
| Final diferente | Resultado contraditório | `CONTRADITORIO`; estado preservado; inconsistência registrada |

`Estornado` existe no ciclo (`trabalho3.md` §11.3), mas nenhuma operação leva a ele neste épico. O valor informado pelo provedor é guardado junto do resultado, sem substituir o valor esperado.

Definir a porta `PagamentosRepositorio` com `adicionar`, `buscarPorId` e `registrarTransicao(pagamento, fato)`, que grava o Pagamento e o fato a publicar juntos (outbox em memória, D-UC10-04), além de `fatosPendentes()` e `marcarFatoEntregue(idFato)`. O adaptador em memória guarda cópias defensivas.

## Origem

- Fluxo principal, passos 2 e 5; FA-03 (nova tentativa = novo Pagamento)
- Ciclo de vida do Pagamento — `trabalho3.md` §11.3; invariante — `trabalho3.md` §10; Dinheiro — `trabalho3.md` §5.2
- RN06; `trabalho4.md` §3.5, §8.2.2 (versão da transição), §8.2.5 (resultados contraditórios)

## Escopo

**Inclui:** `Dinheiro`, Agregado `Pagamento`, porta, adaptador em memória com outbox, testes de domínio e de contrato.

**Não inclui:** estorno; expiração por tempo (D-UC10-05); persistência durável; entrega do fato (SUB-05).

## Critérios de aceite

- [ ] Pagamento nasce `Pendente`, com identidade, referências à Contratação e à Reserva, valor esperado e versão inicial.
- [ ] Cada resultado (`Aprovado`, `Recusado`, `Expirado`) leva `Pendente` ao estado correspondente e incrementa a versão.
- [ ] Repetir o mesmo resultado não muda o Pagamento e não gera novo fato.
- [ ] Resultado contraditório preserva o estado reconhecido e registra a inconsistência.
- [ ] `Dinheiro` recusa valor negativo, valor não inteiro e moeda vazia; dois valores iguais na mesma moeda são iguais.
- [ ] `registrarTransicao` grava Pagamento e fato juntos: nunca um sem o outro.
- [ ] Duas tentativas para a mesma Reserva são Pagamentos distintos.

## Dependências

| Depende de | Tipo | Necessidade |
| --- | --- | --- |
| — | — | Nenhuma dependência de entrada |

Esta issue fornece o modelo consumido por {{SUB-02}}, {{SUB-04}} e {{SUB-05}}.

## Responsável

@leohsm

## Estado inicial recomendado

`Backlog`

## Evidências esperadas

Pull Request com `Dinheiro`, `Pagamento`, porta, adaptador e testes; saída de `pnpm test` sem falhas.
<!-- SUB-01:END -->

---

## SUB-02

**Título:** `[UC10-SUB-02] [C5] Definir porta do Provedor de pagamento e adaptador simulado`
**Labels:** `usecase:uc10`, `domain:pagamentos`, `type:feature`, `layer:adapter`, `priority:high`

<!-- SUB-02:START -->
> **Issue Principal:** Relacionada ao Épico {{EPIC}}

## Objetivo

Isolar o Provedor de pagamento atrás de uma porta, para que seus estados e formatos não contaminem C5 nem os demais contextos.

## Descrição

Definir a porta `ProvedorDePagamento` com duas responsabilidades:

1. `solicitarCobranca(pagamentoId, valor)`: devolve `SOLICITADA` ou `RESULTADO_DESCONHECIDO`. Sem resposta dentro do tempo limite, o resultado é desconhecido, nunca recusa (FE-04). O `pagamentoId` é a chave de idempotência enviada ao provedor, para que repetir a solicitação não gere segunda cobrança.
2. `traduzirRetorno(payload)`: converte o retorno do provedor em um resultado da Mindhub (`pagamentoId`, `APROVADO`/`RECUSADO`/`EXPIRADO`, valor e moeda informados, instante) ou recusa um retorno inválido. Dados de cartão, credenciais e payload bruto não saem do adaptador (`trabalho4.md` §6.4).

Criar um adaptador simulado configurável (aprovar, recusar, expirar, não responder, repetir retorno, informar valor diferente). O provedor real e a autenticação do retorno dependem da decisão D-UC10-02.

## Origem

- Fluxo principal, passos 3 e 4; FE-04
- `trabalho4.md` §3.5 (adaptador traduz o provedor), §6.4, §8.2.1
- `trabalho5.md` §2.2, §4.2 (retorno do provedor é detalhe de infraestrutura)

## Escopo

**Inclui:** porta, tipos de resultado, adaptador simulado, testes de tradução e de tempo limite.

**Não inclui:** provedor real; consulta ativa de resultado (D-UC10-07); estorno.

## Critérios de aceite

- [ ] Cobrança aceita pelo simulador devolve `SOLICITADA`.
- [ ] Simulador sem resposta dentro do tempo limite devolve `RESULTADO_DESCONHECIDO`, e não erro de recusa.
- [ ] Solicitar duas vezes a cobrança do mesmo `pagamentoId` não cria segunda cobrança no simulador.
- [ ] Retornos de aprovação, recusa e expiração são traduzidos para os resultados da Mindhub.
- [ ] Retorno malformado ou de resultado desconhecido é recusado sem ser interpretado por aproximação.
- [ ] O resultado traduzido não contém payload bruto nem dados sensíveis.

## Dependências

| Depende de | Tipo | Necessidade |
| --- | --- | --- |
| {{SUB-01}} | Contrato | `Dinheiro` e tipos de resultado financeiro |
| D-UC10-02 | Decisão | Formato do retorno e autenticação (só para o provedor real) |

Esta issue fornece a porta consumida por {{SUB-04}} e {{SUB-05}}.

## Responsável

@leohsm

## Estado inicial recomendado

`Backlog`

## Evidências esperadas

Pull Request com porta, adaptador simulado e testes; saída de `pnpm test` sem falhas.
<!-- SUB-02:END -->

---

## SUB-03

**Título:** `[UC10-SUB-03] [C4] Expor visão da Reserva retida e registrar a correlação do Pagamento`
**Labels:** `usecase:uc10`, `domain:agenda`, `type:feature`, `layer:application`, `layer:repository`, `priority:high`

<!-- SUB-03:START -->
> **Issue Principal:** Relacionada ao Épico {{EPIC}}

## Objetivo

Permitir que C5 conheça a retenção (contratação, cliente, prazo e valor esperado) e que C4 registre qual Pagamento espera, antes de qualquer cobrança.

## Descrição

Definir em C4 uma interface pública por propósito, exportada por token de injeção:

- `consultarRetencao(reservaId)`: devolve referência da Contratação, cliente, situação (`RETIDA` ou outra), limite de validade e valor esperado; ou `NAO_ENCONTRADA`. O valor esperado é o recebido de C3 no contrato C01; C4 não recalcula preço.
- `registrarPagamentoEsperado(reservaId, pagamentoId)`: devolve `REGISTRADO`, `NAO_RETIDA`, `PRAZO_VENCIDO` ou `PAGAMENTO_PENDENTE_EXISTENTE`. A conferência e a gravação acontecem na mesma operação atômica. A correlação atual só pode ser substituída quando o Pagamento anterior já tiver resultado aplicado (D-UC10-03).

O prazo é conferido pelo relógio de C4 (D-UC10-06). A entidade Reserva e seu repositório continuam internos.

**Bloqueio:** o UC09 ainda não foi especificado nem planejado. Esta issue só pode ir para `Ready` depois que a Reserva retida, com prazo e valor esperado, existir.

## Origem

- PRE-01; fluxo principal, passo 2
- `trabalho4.md` §6.3 (R4: correlação antes da cobrança), §8.1.3, §8.1.4, §8.2.1
- `trabalho5.md` §7.2 (Reserva precisa conhecer o Pagamento esperado)

## Escopo

**Inclui:** interface e token; leitura da Reserva por identificador; campo de correlação na Reserva; operação atômica; testes unitários e de contrato.

**Não inclui:** reter horário (UC09); expirar retenção por tempo; aplicar o resultado financeiro (SUB-06).

## Critérios de aceite

- [ ] Reserva retida e no prazo é informada com contratação, cliente, prazo e valor esperado.
- [ ] Reserva inexistente é informada como `NAO_ENCONTRADA`; falha técnica não vira `NAO_ENCONTRADA`.
- [ ] Correlação em Reserva retida e no prazo resulta em `REGISTRADO`.
- [ ] Correlação em Reserva `Confirmada` ou `Liberada` resulta em `NAO_RETIDA`; com prazo vencido, `PRAZO_VENCIDO`.
- [ ] Duas correlações concorrentes para a mesma Reserva resultam em um `REGISTRADO` e um `PAGAMENTO_PENDENTE_EXISTENTE`.
- [ ] O módulo de C4 exporta o token da interface, e não a entidade nem o repositório.

## Dependências

| Depende de | Tipo | Necessidade |
| --- | --- | --- |
| UC09 | Externa (não planejada) | Agregado Reserva, prazo da retenção e valor esperado (C01) |
| D-UC10-03 | Decisão | Um Pagamento pendente por Reserva |

Esta issue fornece o contrato consumido por {{SUB-04}} e a correlação usada por {{SUB-06}}.

## Responsável

@leohsm

## Estado inicial recomendado

`Backlog`

## Evidências esperadas

Pull Request com a interface, a correlação e os testes, incluindo o de concorrência; saída de `pnpm test` sem falhas.
<!-- SUB-03:END -->

---

## SUB-04

**Título:** `[UC10-SUB-04] [C5] Implementar serviço Solicitar Pagamento`
**Labels:** `usecase:uc10`, `domain:pagamentos`, `type:feature`, `layer:application`, `priority:high`

<!-- SUB-04:START -->
> **Issue Principal:** Relacionada ao Épico {{EPIC}}

## Objetivo

Coordenar o início do pagamento: conferir a retenção, registrar o Pagamento `Pendente` com o valor esperado, registrar a correlação em C4 e solicitar a cobrança.

## Descrição

Criar o serviço `SolicitarPagamento`, que recebe um Command com `clienteId` e `reservaId`. Ordem (`trabalho4.md` §8.2.1):

1. consultar a retenção pela porta da {{SUB-03}} (`ReservaNaoEncontrada`);
2. verificar que o agente é o cliente da Reserva (`AgenteNaoAutorizado`);
3. verificar que a Reserva está retida e no prazo (`ReservaNaoRetida`, `PrazoDaRetencaoVencido`);
4. criar o Pagamento `Pendente` com o valor esperado informado por C4; o Cliente não informa valor;
5. registrar a correlação em C4; `PAGAMENTO_PENDENTE_EXISTENTE` vira `PagamentoPendenteExistente`, sem gravar o novo Pagamento;
6. gravar o Pagamento;
7. solicitar a cobrança pela porta da {{SUB-02}}. `RESULTADO_DESCONHECIDO` não é erro: o Pagamento continua `Pendente` e o resultado informa que a cobrança aguarda confirmação (FE-04).

Criar também a Query `ConsultarPagamento`, que devolve situação, valor e referência da Reserva apenas ao cliente. O serviço depende só de portas.

## Origem

- Fluxo principal, passos 1 a 3; PRE-01; FA-03; FE-04
- `trabalho4.md` §8.2.1, §12.3 (ADR-03)

## Escopo

**Inclui:** serviço, Command, Query, erros de aplicação, testes com dublês das portas.

**Não inclui:** receber o resultado do provedor (SUB-05); consulta ativa ao provedor (D-UC10-07).

## Critérios de aceite

- [ ] Cliente da Reserva retida e no prazo → Pagamento `Pendente` com o valor esperado, correlação registrada e cobrança solicitada.
- [ ] Reserva inexistente, de outro cliente, não retida ou com prazo vencido → erro correspondente; nenhum Pagamento é gravado e nenhuma cobrança é solicitada.
- [ ] Pagamento pendente existente → `PagamentoPendenteExistente`; nenhuma cobrança nova.
- [ ] Provedor sem resposta → Pagamento continua `Pendente`; nenhum resultado é presumido.
- [ ] Nova tentativa permitida pela correlação cria outro Pagamento, com identidade própria (FA-03).
- [ ] Falha técnica de C4 não vira erro de negócio.
- [ ] O serviço não importa classes de C4 nem do NestJS HTTP.

## Dependências

| Depende de | Tipo | Necessidade |
| --- | --- | --- |
| {{SUB-01}} | Implementação | Agregado Pagamento e repositório |
| {{SUB-02}} | Contrato | Porta do Provedor |
| {{SUB-03}} | Contrato | Visão da retenção e correlação |

## Responsável

@leohsm

## Estado inicial recomendado

`Backlog`

## Evidências esperadas

Pull Request com o serviço, a Query e os testes de cada cenário; saída de `pnpm test` sem falhas.
<!-- SUB-04:END -->

---

## SUB-05

**Título:** `[UC10-SUB-05] [C5] Processar o resultado do Provedor e publicar "Pagamento Decidido"`
**Labels:** `usecase:uc10`, `domain:pagamentos`, `type:feature`, `layer:application`, `priority:high`

<!-- SUB-05:START -->
> **Issue Principal:** Relacionada ao Épico {{EPIC}}

## Objetivo

Registrar em C5 o resultado financeiro informado pelo Provedor e publicar o fato "Pagamento Decidido" uma vez por transição, com entrega repetível.

## Descrição

Criar o serviço `RegistrarResultadoDoProvedor`, que recebe o resultado já traduzido pela {{SUB-02}}:

1. carregar o Pagamento (`PagamentoNaoEncontrado`, registrado para conferência);
2. aplicar o resultado no agregado; `JA_REGISTRADO` e `CONTRADITORIO` não geram fato;
3. em transição nova, montar o fato e gravar Pagamento e fato juntos (`registrarTransicao`).

Campos do fato (`trabalho4.md` §8.2.2): identificação do fato, versão do contrato, referência do Pagamento, versão da transição, referências da Contratação e da Reserva, resultado, valor e moeda, instante do resultado e correlação da jornada.

Criar o despachante interno (D-UC10-04): lê os fatos pendentes, entrega ao consumidor por uma porta `ConsumidorDePagamentoDecidido` e só marca o fato como entregue depois da confirmação do consumidor. Falha do consumidor mantém o fato pendente para nova tentativa. O estado financeiro em C5 não depende da resposta de C4.

## Origem

- Fluxo principal, passos 4 e 5; FA-01; FA-02; FE-01
- RN06; contrato C02 — `trabalho4.md` §8.2; TC-C5-01 — §9.8; §7 (entrega repetível)

## Escopo

**Inclui:** serviço, montagem do fato, despachante com repetição, porta do consumidor, testes com dublês.

**Não inclui:** aplicar o efeito na Reserva (SUB-06); outbox durável; limite de repetições e escalonamento (não definidos em C02 §8.2.5).

## Critérios de aceite

- [ ] Aprovação de Pagamento `Pendente` → `Aprovado` e um fato publicado com todos os campos de C02.
- [ ] Recusa e expiração → `Recusado`/`Expirado` e um fato publicado cada.
- [ ] A mesma aprovação recebida duas vezes produz um único fato.
- [ ] Resultado contraditório preserva o estado e não publica fato.
- [ ] Consumidor indisponível → fato continua pendente e é entregue na próxima tentativa, com a mesma identificação.
- [ ] Pagamento desconhecido não gera fato e fica registrado para conferência.
- [ ] C5 não chama nenhuma operação que altere a Reserva.

## Dependências

| Depende de | Tipo | Necessidade |
| --- | --- | --- |
| {{SUB-01}} | Implementação | Agregado, transições e outbox |
| {{SUB-02}} | Contrato | Resultado traduzido do Provedor |
| D-UC10-04 | Decisão | Entrega dentro do processo |

Esta issue fornece o contrato do fato consumido pela {{SUB-06}}.

## Responsável

@leohsm

## Estado inicial recomendado

`Backlog`

## Evidências esperadas

Pull Request com o serviço, o despachante e os testes; saída de `pnpm test` sem falhas.
<!-- SUB-05:END -->

---

## SUB-06

**Título:** `[UC10-SUB-06] [C4] Aplicar "Pagamento Decidido" na Reserva`
**Labels:** `usecase:uc10`, `domain:agenda`, `type:feature`, `layer:domain`, `layer:application`, `priority:high`

<!-- SUB-06:START -->
> **Issue Principal:** Relacionada ao Épico {{EPIC}}

## Objetivo

Aplicar em C4, uma única vez, o efeito legítimo de um resultado financeiro: confirmar a Reserva na aprovação e liberá-la na recusa ou expiração, sem confirmar nada fora de correlação, valor ou prazo.

## Descrição

Implementar o consumidor `ConsumidorDePagamentoDecidido` em C4. Em uma única operação atômica, que grava o efeito e a marcação do fato processado juntos:

| Condição | Efeito | Registro |
| --- | --- | --- |
| Transição já processada (mesmo Pagamento + versão + Reserva, qualquer identificação de fato) | Nenhum | Resultado original devolvido |
| Pagamento não é o correlacionado na Reserva, ou Contratação não confere | Nenhum | Fato de tentativa antiga ou sem correlação |
| Aprovado; Reserva `Retida`; no prazo; valor e moeda iguais ao esperado; sem sobreposição com Reserva confirmada | `Retida` → `Confirmada` | Transição e correlação |
| Aprovado; valor ou moeda divergente | Nenhum | Pendência de reconciliação (FE-03) |
| Aprovado; Reserva `Liberada` ou prazo vencido | Nenhum | Divergência para reconciliação (FE-02) |
| Recusado ou Expirado; Reserva `Retida` e correlacionada | `Retida` → `Liberada` (RN08, conforme D-UC10-01) | Liberação e motivo |

Depois de gravar, solicitar o aviso ao Cliente por uma porta de aviso de C4 (D-UC10-10), com falha tolerada. Nenhuma pendência é apagada por esgotamento de tentativas.

## Origem

- Fluxo principal, passos 6 e 7; FA-01; FA-02; FE-01; FE-02; FE-03
- RN02, RN03, RN07, RN08 — `trabalho3.md` §9; ciclo da Reserva — §11.2
- Contrato C02 — `trabalho4.md` §8.2.3 a §8.2.5, §8.2.7; TC-C5-01 e TC-C5-02 — §9.8

## Escopo

**Inclui:** transições da Reserva, registro de fatos processados, pendências de reconciliação, porta de aviso com adaptador em memória, testes de cada linha da tabela.

**Não inclui:** política de compensação ou estorno (D-UC10-08); expirar retenção por tempo; reagendamento.

## Critérios de aceite

- [ ] Aprovação válida confirma a Reserva retida.
- [ ] A mesma aprovação entregue antes e depois de um reinício simulado, inclusive com outro identificador de fato, confirma a Reserva uma única vez (TC-C5-01).
- [ ] Recusa ou expiração da tentativa correlacionada libera a Reserva.
- [ ] Recusa antiga não libera a retenção vinculada à tentativa atual.
- [ ] Moeda ou valor divergente gera pendência sem alterar a Reserva.
- [ ] Aprovação depois da liberação não confirma a Reserva e não cria sobreposição (RN03).
- [ ] Falha durante a gravação não deixa efeito sem marcação nem marcação sem efeito; o fato pode ser reprocessado.
- [ ] Falha do aviso não desfaz a confirmação ou a liberação.
- [ ] A regra adotada em D-UC10-01 está registrada nesta issue antes de `Ready`.

## Dependências

| Depende de | Tipo | Necessidade |
| --- | --- | --- |
| {{SUB-03}} | Implementação | Reserva com correlação do Pagamento |
| {{SUB-05}} | Contrato | Estrutura do fato e porta do consumidor |
| UC09 | Externa (não planejada) | Agregado Reserva e verificação de sobreposição |
| D-UC10-01 | Decisão | Recusa libera ou não a Reserva ainda no prazo |
| D-UC10-06 | Decisão | Relógio que define a validade |

## Responsável

@leohsm

## Estado inicial recomendado

`Backlog`

## Evidências esperadas

Pull Request com o consumidor, as transições e os testes de cada cenário de C02; saída de `pnpm test` sem falhas.
<!-- SUB-06:END -->

---

## SUB-07

**Título:** `[UC10-SUB-07] Expor endpoints HTTP e integrar C4 e C5 de ponta a ponta`
**Labels:** `usecase:uc10`, `domain:pagamentos`, `domain:agenda`, `type:feature`, `layer:api`, `layer:integration`, `priority:medium`

<!-- SUB-07:START -->
> **Issue Principal:** Relacionada ao Épico {{EPIC}}

## Objetivo

Disponibilizar o UC10 pela API e comprovar a jornada completa com C4 e C5 ligados, incluindo repetição, atraso e divergência.

## Descrição

Criar no módulo de C5:

- `POST /reservas/{id}/pagamentos` (corpo: `clienteId`);
- `POST /pagamentos/retorno-provedor` (retorno do provedor simulado; autenticado por segredo compartilhado em cabeçalho, conforme D-UC10-02);
- `GET /pagamentos/{id}` (situação do Pagamento; `clienteId` conforme D1).

Ligar C4 e C5 no `AppModule`: visão da retenção, correlação, provedor simulado, despachante e consumidor reais. Traduzir resultados conforme a proposta abaixo (D-UC10-09), a confirmar nesta issue:

| Situação | Resposta |
| --- | --- |
| Pagamento registrado e cobrança solicitada | 201, com `id`, `reservaId`, `situacao: PENDENTE`, `valor`, `moeda`, `cobranca: SOLICITADA` |
| Pagamento registrado e provedor sem resposta | 201, com `cobranca: RESULTADO_DESCONHECIDO` |
| Formato inválido ou campo não previsto | 400 |
| Reserva ou Pagamento inexistente | 404 |
| Agente não é o cliente | 403 |
| Reserva não retida, prazo vencido ou pagamento pendente existente | 409 |
| Retorno do provedor processado, repetido ou contraditório | 200 |
| Retorno sem autenticação válida | 401 |
| Falha técnica de C4 ou do armazenamento | 503 |

## Origem

- Fluxo principal, passos 1, 4 e 7; FE-01 a FE-04
- `trabalho5.md` §16 (padrões HTTP do projeto, D1); §4.2 (retorno do provedor)

## Escopo

**Inclui:** controllers, schemas, tradução de erros, ligação dos módulos, testes HTTP de ponta a ponta e regressão dos casos de uso anteriores.

**Não inclui:** provedor real; autenticação de usuário; endpoints de retenção (UC09).

## Critérios de aceite

- [ ] Jornada completa: Contratação aceita pelo UC07, Reserva retida pelo UC09, pagamento solicitado, aprovação recebida → Pagamento `Aprovado` e Reserva `Confirmada`.
- [ ] O mesmo retorno de aprovação enviado duas vezes resulta em 200 nas duas e em uma única confirmação.
- [ ] Recusa recebida → Pagamento `Recusado` e Reserva conforme D-UC10-01.
- [ ] Aprovação recebida depois da liberação → Pagamento `Aprovado`, Reserva não confirmada, pendência registrada.
- [ ] Retorno sem o segredo compartilhado → 401, nada é registrado.
- [ ] Cada linha da tabela de respostas está coberta por teste HTTP.
- [ ] Testes de todos os casos de uso implementados passam juntos; `pnpm lint` e `pnpm build` sem erros.

## Dependências

| Depende de | Tipo | Necessidade |
| --- | --- | --- |
| {{SUB-04}}, {{SUB-05}} | Contrato | Serviços, Query e erros de C5 |
| {{SUB-02}}, {{SUB-03}}, {{SUB-06}} | Integração | Provedor simulado, correlação e consumidor ligados |
| {{UC07-SUB-05}} | Integração | Contratação formada pela API |
| UC09 | Externa (não planejada) | Reter horário pela API |
| D1 | Decisão | Origem de `clienteId` |
| D-UC10-02 | Decisão | Autenticação do retorno do provedor |

## Responsável

@leohsm

## Estado inicial recomendado

`Backlog`

## Evidências esperadas

Pull Request com controllers, módulos e testes HTTP; saídas de `pnpm test`, `pnpm lint` e `pnpm build`.
<!-- SUB-07:END -->

---

## SUB-08

**Título:** `[UC10-SUB-08] Documentar o UC10 e os endpoints`
**Labels:** `usecase:uc10`, `domain:pagamentos`, `type:docs`, `priority:low`

<!-- SUB-08:START -->
> **Issue Principal:** Relacionada ao Épico {{EPIC}}

## Objetivo

Manter a documentação do backend coerente com o comportamento do UC10.

## Descrição

Atualizar o README do backend com objetivo, regras (RN06 a RN08), sequência da jornada de pagamento, exemplos de requisição e resposta, códigos HTTP e limitações: `clienteId` no corpo (D1), provedor simulado e segredo compartilhado (D-UC10-02), entrega em memória (D-UC10-04), resultado desconhecido sem recuperação ativa (D-UC10-07), divergências só registradas (D-UC10-08). Incluir em `requests.http` exemplos de solicitação, aprovação, recusa e retorno repetido.

## Origem

- Rastreabilidade do caso de uso; `trabalho5.md` §24 (documentos mudam no mesmo PR)

## Escopo

**Inclui:** README, `requests.http`, limitações conhecidas, variável de ambiente do segredo em `.env.example`.

**Não inclui:** documentação de outros casos de uso.

## Critérios de aceite

- [ ] O README descreve os três endpoints, a sequência assíncrona e as respostas.
- [ ] Os exemplos de `requests.http` executam localmente com o resultado descrito.
- [ ] As decisões D1, D-UC10-02, D-UC10-04, D-UC10-07 e D-UC10-08 aparecem como limitações conhecidas.

## Dependências

| Depende de | Tipo | Necessidade |
| --- | --- | --- |
| {{SUB-07}} | Contrato | Endpoints e respostas definidos |

## Responsável

@leohsm

## Estado inicial recomendado

`Backlog`

## Evidências esperadas

Pull Request com README, `requests.http` e `.env.example` atualizados.
<!-- SUB-08:END -->
