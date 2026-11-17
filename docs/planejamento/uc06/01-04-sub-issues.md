# 01-04 — Sub-Issues completas

**Caso de uso:** UC06 — Enviar Proposta  
**Issue principal:** `[UC06] Enviar Proposta`

Cada Sub-Issue abaixo está pronta para publicação. O texto entre os marcadores `START` e `END` é o corpo da issue. `{{EPIC}}` e `{{SUB-XX}}` são substituídos pelos números reais na criação.

---

## SUB-01

**Título:** `[UC06-SUB-01] [C3] Modelar as Condições Comerciais`  
**Labels:** `usecase:uc06`, `domain:negociacao`, `type:feature`, `layer:domain`, `priority:high`

<!-- SUB-01:START -->
> **Issue Principal:** Relacionada ao Épico {{EPIC}}

## Objetivo

Representar as condições de uma Proposta como objeto de valor imutável e validado.

## Descrição

Criar o objeto de valor `CondicoesComerciais` com preço e moeda (`Dinheiro`), quantidade prevista de sessões, duração, modalidade, validade, condições de pagamento e condições de cancelamento opcionais, e os erros de domínio por campo (D-UC06-02). A validade é conferida contra o instante informado, sem ler o relógio do sistema.

## Origem

Fluxo principal, passo 2; FE-06; `trabalho3.md` §5.2 (Condições Comerciais, Dinheiro).

## Escopo

**Inclui:** Objeto de valor, `Dinheiro` (se ainda não existir), erros de domínio e testes.

**Não inclui:** Persistência; Proposta e Versão (SUB-02).

## Critérios de aceite

- [ ] Condições completas criam o objeto de valor com todos os campos.
- [ ] Preço negativo ou não inteiro e moeda vazia são recusados.
- [ ] Quantidade de sessões e duração não positivas são recusadas.
- [ ] Validade anterior ou igual ao instante informado é recusada.
- [ ] Campo obrigatório ausente é recusado com erro que identifica o campo.
- [ ] O objeto é imutável e comparado por valor; modificar a fonte depois da criação não o altera.

## Dependências

| Depende de | Tipo | Necessidade |
| --- | --- | --- |
| D-UC06-02 | Decisão | Define os campos obrigatórios. |

Esta issue fornece o que é consumido por {{SUB-02}}.

## Responsável

@leohsm

## Estado inicial recomendado

`Backlog`

## Evidências esperadas

Pull Request com a implementação e os testes da unidade; saída de `pnpm test`, `pnpm lint` e `pnpm build` sem falhas.
<!-- SUB-01:END -->

---

## SUB-02

**Título:** `[UC06-SUB-02] [C3] Modelar a Proposta, suas Versões e o repositório em memória`  
**Labels:** `usecase:uc06`, `domain:negociacao`, `type:feature`, `layer:domain`, `layer:repository`, `priority:high`

<!-- SUB-02:START -->
> **Issue Principal:** Relacionada ao Épico {{EPIC}}

## Objetivo

Representar a Proposta com versões imutáveis, ciclo inicial e unicidade por Solicitação.

## Descrição

Criar o Agregado `Proposta` (identidade, Solicitação, situação `ENVIADA`/`EM_REVISAO`, lista de `VersaoProposta`) e as operações `enviar` e `registrarNovaVersao`, que recusam estados finais. Definir a porta `PropostasRepositorio` (`adicionar`, `buscarPorId`, `buscarPorSolicitacao`, `registrarNovaVersao` com versão vigente esperada) e o adaptador em memória com cópias defensivas e unicidade por Solicitação. O UC07 acrescentará `aceitar` ao mesmo Agregado.

## Origem

POS-01 a POS-04; FA-01; FE-02 a FE-05; RN05; `trabalho3.md` §6.2, §8, §11.1.

## Escopo

**Inclui:** Agregado, Versão, erros de domínio, porta, adaptador em memória e testes de domínio e de contrato.

**Não inclui:** Aceite, recusa e expiração; persistência durável.

## Critérios de aceite

- [ ] O primeiro envio cria Proposta `ENVIADA` com versão 1 vigente, ligada à Solicitação.
- [ ] Nova versão em Proposta `ENVIADA` ou `EM_REVISAO` deixa a Proposta `EM_REVISAO` com a nova versão vigente; as anteriores continuam recuperáveis e inalteradas.
- [ ] Nova versão em Proposta `ACEITA`, `RECUSADA` ou `EXPIRADA` é recusada.
- [ ] Cada versão é um retrato imutável; alterar o objeto de origem não altera a versão.
- [ ] Segunda Proposta para a mesma Solicitação é recusada, inclusive com duas gravações simultâneas.
- [ ] Duas novas versões simultâneas sobre a mesma versão vigente: só uma é registrada e a outra é recusada por conflito.
- [ ] O adaptador em memória devolve cópias defensivas e busca por identificador e por Solicitação.

## Dependências

| Depende de | Tipo | Necessidade |
| --- | --- | --- |
| {{SUB-01}} | Interna | Cada Versão carrega Condições Comerciais. |
| D-UC06-01 | Decisão | Define quem leva a Proposta a `Em revisão`. |
| D-UC06-03 | Decisão | Define a identificação da versão. |
| D-UC06-04 | Decisão | Define o estado inicial. |

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

**Título:** `[UC06-SUB-03] [C3] Expor a Solicitação recebida ao Especialista destinatário`  
**Labels:** `usecase:uc06`, `domain:negociacao`, `type:feature`, `layer:application`, `layer:repository`, `priority:high`

<!-- SUB-03:START -->
> **Issue Principal:** Relacionada ao Épico {{EPIC}}

## Objetivo

Permitir que o Especialista consulte a Solicitação que recebeu, sem revelá-la a terceiros.

## Descrição

Estender o repositório de Solicitações do UC05 com `buscarPorId` e criar o serviço de consulta `ConsultarSolicitacaoRecebida`, que verifica que o ator é o especialista destinatário e devolve Objetivo, Escopo, situação e cliente, sem alterar estado.

## Origem

Fluxo principal, passo 1; PRE-01; `trabalho5.md` §6.2.

## Escopo

**Inclui:** Extensão da porta de Solicitação, serviço de consulta e testes.

**Não inclui:** Endpoint HTTP (SUB-05); criação da Solicitação (UC05).

## Critérios de aceite

- [ ] O especialista destinatário consulta a Solicitação com Objetivo, Escopo, situação e cliente.
- [ ] Solicitação inexistente é recusada como não encontrada.
- [ ] Quem não é o destinatário é recusado sem revelar o conteúdo.
- [ ] A consulta não altera nenhum estado.

## Dependências

| Depende de | Tipo | Necessidade |
| --- | --- | --- |
| UC05 | Externa | Fornece a Solicitação e seu repositório. |

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

**Título:** `[UC06-SUB-04] [C3] Implementar os serviços de aplicação Enviar Proposta e Enviar Nova Versão`  
**Labels:** `usecase:uc06`, `domain:negociacao`, `type:feature`, `layer:application`, `priority:high`

<!-- SUB-04:START -->
> **Issue Principal:** Relacionada ao Épico {{EPIC}}

## Objetivo

Coordenar autoria, verificação da Solicitação, registro e aviso ao cliente.

## Descrição

Criar `EnviarProposta` e `EnviarNovaVersao`, dependentes só de portas: recusam Solicitação de outro especialista, Solicitação inexistente e Solicitação que já tem Proposta; recusam condições inválidas; registram e avisam o cliente pela porta do UC05, com falha tolerada. A nova versão exige que o ator seja o especialista da Proposta.

## Origem

Passos 3 a 5; PRE-01, PRE-01a; FA-01, FA-02; FE-01 a FE-04, FE-06.

## Escopo

**Inclui:** Dois serviços de aplicação, erros de aplicação e testes com dublês.

**Não inclui:** HTTP; aceite; entrega real do aviso.

## Critérios de aceite

- [ ] O especialista destinatário envia a Proposta e recebe a Proposta `ENVIADA` com versão 1.
- [ ] Solicitação de outro especialista é recusada sem registro (FE-01).
- [ ] Solicitação que já possui Proposta é recusada com orientação para enviar nova versão (FE-02).
- [ ] Condições inválidas são recusadas sem registro (FE-06).
- [ ] O cliente é avisado depois do registro; falha do aviso não desfaz nem invalida o registro (FA-02).
- [ ] Solicitação inexistente é recusada sem registro.
- [ ] Nova versão em Proposta `ENVIADA` ou `EM_REVISAO` registra a versão vigente e deixa a Proposta `EM_REVISAO` (FA-01).
- [ ] Nova versão em Proposta `ACEITA`, `RECUSADA` ou `EXPIRADA` é recusada (FE-03, FE-04).
- [ ] Nova versão enviada por quem não é o especialista da Proposta é recusada.

## Dependências

| Depende de | Tipo | Necessidade |
| --- | --- | --- |
| {{SUB-02}} | Interna | Usa o Agregado e a porta. |
| {{SUB-03}} | Interna | Lê a Solicitação do especialista. |
| UC05 | Externa | Reaproveita a porta de aviso (UC05-SUB-03). |

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

**Título:** `[UC06-SUB-05] [C3] Expor os endpoints de Proposta e verificar o envio de ponta a ponta`  
**Labels:** `usecase:uc06`, `domain:negociacao`, `type:feature`, `layer:api`, `layer:integration`, `priority:high`

<!-- SUB-05:START -->
> **Issue Principal:** Relacionada ao Épico {{EPIC}}

## Objetivo

Disponibilizar o envio, a nova versão e a consulta da Solicitação pela API e comprovar a jornada.

## Descrição

Criar DTOs com `z.strictObject`, controllers e tradução de erros conforme D-UC06-08: `GET /solicitacoes/{id}` (consulta do destinatário), `POST /solicitacoes/{id}/propostas` e `POST /propostas/{id}/versoes`. O identificador do ator é informado pelo cliente (D1). Incluir teste HTTP UC05 → UC06 e o teste de concorrência de duas novas versões.

## Origem

Passos 1, 2 e 5; FA-01; FE-01 a FE-06; D1.

## Escopo

**Inclui:** DTOs, controllers, filtro de erros, ligação no módulo de C3 e testes HTTP.

**Não inclui:** Consulta da Proposta pelo Cliente (UC07-SUB-05); autenticação.

## Critérios de aceite

- [ ] O envio responde 201 com a Proposta, a versão vigente e a situação.
- [ ] A nova versão responde 201 com a versão nova e a Proposta `EM_REVISAO`.
- [ ] Corpo fora do formato ou com campos não previstos responde 400 sem iniciar o caso de uso.
- [ ] Cada recusa (não destinatário, Proposta existente, estado final, condições inválidas) responde com código e mensagem distintos e estáveis.
- [ ] O teste HTTP percorre UC05 → envio da Proposta → nova versão.
- [ ] Duas novas versões HTTP simultâneas: uma responde 201 e a outra 409; com o UC07 disponível, nova versão e aceite simultâneos geram uma só Contratação.
- [ ] A consulta da Solicitação responde 200 ao destinatário, 404 se inexistente e 403 a outro especialista.

## Dependências

| Depende de | Tipo | Necessidade |
| --- | --- | --- |
| {{SUB-04}} | Interna | Chama os serviços de aplicação. |
| D-UC06-08 | Decisão | Rotas e códigos. |
| D-UC06-09 | Decisão | Origem do identificador do ator. |

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

**Título:** `[UC06-SUB-06] [C3] Documentar o UC06 e os endpoints`  
**Labels:** `usecase:uc06`, `domain:negociacao`, `type:docs`, `priority:low`

<!-- SUB-06:START -->
> **Issue Principal:** Relacionada ao Épico {{EPIC}}

## Objetivo

Manter a documentação coerente com o comportamento entregue.

## Descrição

Atualizar o README e o `requests.http` com o envio, a nova versão e a consulta, e registrar as limitações: sem recusa, expiração e pedido de revisão, sem `Em elaboração`, sem autenticação (D1) e as dúvidas D-UC06-05 e D-UC06-06.

## Origem

Rastreabilidade do planejamento.

## Escopo

**Inclui:** README, `requests.http` e registro de limitações.

**Não inclui:** Alteração de código.

## Critérios de aceite

- [ ] Os exemplos do `requests.http` são executáveis e cobrem sucesso e as recusas principais.
- [ ] As limitações e as decisões D-UC06-01 a D-UC06-09 estão registradas.
- [ ] O README aponta para este planejamento.

## Dependências

| Depende de | Tipo | Necessidade |
| --- | --- | --- |
| {{SUB-05}} | Interna | Documenta o contrato HTTP final. |

## Responsável

@leohsm

## Estado inicial recomendado

`Backlog`

## Evidências esperadas

Pull Request com a implementação e os testes da unidade; saída de `pnpm test`, `pnpm lint` e `pnpm build` sem falhas.
<!-- SUB-06:END -->

---
