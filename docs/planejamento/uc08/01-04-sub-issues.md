# 01-04 — Sub-Issues completas

**Caso de uso:** UC08 — Contratar Serviço de Reserva Direta  
**Issue principal:** `[UC08] Contratar Serviço de Reserva Direta`

Cada Sub-Issue abaixo está pronta para publicação. O texto entre os marcadores `START` e `END` é o corpo da issue. `{{EPIC}}` e `{{SUB-XX}}` são substituídos pelos números reais na criação.

---

## SUB-01

**Título:** `[UC08-SUB-01] [C2] Expor a visão pública do Serviço e suas condições vigentes`  
**Labels:** `usecase:uc08`, `domain:oferta`, `type:feature`, `layer:application`, `priority:high`

<!-- SUB-01:START -->
> **Issue Principal:** Relacionada ao Épico {{EPIC}}

## Objetivo

Permitir que C3 conheça o Serviço, o especialista, o Modelo de Contratação e as condições vigentes sem interpretar o Agregado de C2.

## Descrição

Criar a interface pública de C2 `VisaoDeServico` e o token de injeção, com a leitura do Serviço por identificador no repositório do UC03. A visão devolve identificador, especialista, situação do Serviço, Modelo de Contratação e condições vigentes (quando houver).

## Origem

Passo 2; PRE-01; `trabalho4.md` §6.1.

## Escopo

**Inclui:** Interface pública, implementação em C2 e testes.

**Não inclui:** Regra de contratação (SUB-03); edição de Serviço.

## Critérios de aceite

- [ ] Serviço publicado devolve a visão com especialista, Modelo de Contratação e condições vigentes.
- [ ] Serviço inexistente devolve não encontrado.
- [ ] Serviço Sob Proposta devolve a visão com o modelo e sem condições vigentes.
- [ ] A visão não expõe dados privados do especialista nem a estrutura interna do Agregado.

## Dependências

| Depende de | Tipo | Necessidade |
| --- | --- | --- |
| UC03 | Externa | Fornece o Serviço publicado e seu repositório. |

Esta issue fornece o que é consumido por {{SUB-03}}.

## Responsável

@leohsm

## Estado inicial recomendado

`Backlog`

## Evidências esperadas

Pull Request com a implementação e os testes da unidade; saída de `pnpm test`, `pnpm lint` e `pnpm build` sem falhas.
<!-- SUB-01:END -->

---

## SUB-02

**Título:** `[UC08-SUB-02] [C3] Estender a Contratação com origem Reserva Direta e snapshot das condições`  
**Labels:** `usecase:uc08`, `domain:negociacao`, `domain:agenda`, `type:feature`, `layer:domain`, `layer:repository`, `priority:high`

<!-- SUB-02:START -->
> **Issue Principal:** Relacionada ao Épico {{EPIC}}

## Objetivo

Formar a Contratação sem Proposta, preservando as condições vigentes no instante da contratação (RN04).

## Descrição

Estender a entidade `Contratacao` criada no UC07 com a origem Reserva Direta (sem referência a Proposta ou versão aceita), cliente, especialista, Serviço e snapshot imutável das condições. Estender o repositório em memória e os testes de contrato.

## Origem

Passo 4; POS-01, POS-02; FE-05; RN04, RN13; `trabalho3.md` §7; `trabalho4.md` TC-C2-02.

## Escopo

**Inclui:** Extensão do domínio, do repositório em memória e testes.

**Não inclui:** Retenção de horário; origem Sob Proposta (UC07).

## Critérios de aceite

- [ ] Contratação de origem Reserva Direta é criada sem referência a Proposta, com cliente, especialista e Serviço.
- [ ] A Contratação guarda o snapshot das condições vigentes do Serviço no momento da contratação.
- [ ] Alterar depois o Serviço ou suas condições não altera a Contratação (FE-05).
- [ ] Contratação sem condições ou com origem inconsistente (Reserva Direta com Proposta) é recusada pelo domínio.
- [ ] O repositório guarda e recupera a Contratação com cópia defensiva.

## Dependências

| Depende de | Tipo | Necessidade |
| --- | --- | --- |
| UC07 | Externa | Fornece o modelo de Contratação (UC07-SUB-02) e seu repositório. |

Esta issue fornece o que é consumido por {{SUB-03}}.

## Responsável

@leohsm

## Estado inicial recomendado

`Backlog`

## Evidências esperadas

Pull Request com a implementação e os testes da unidade; saída de `pnpm test`, `pnpm lint` e `pnpm build` sem falhas.
<!-- SUB-02:END -->

---

## SUB-03

**Título:** `[UC08-SUB-03] [C3] Implementar o serviço de aplicação Contratar Reserva Direta`  
**Labels:** `usecase:uc08`, `domain:negociacao`, `domain:agenda`, `type:feature`, `layer:application`, `priority:high`

<!-- SUB-03:START -->
> **Issue Principal:** Relacionada ao Épico {{EPIC}}

## Objetivo

Coordenar a visão do Serviço, a formação da Contratação e a retenção do horário pelo contrato C01.

## Descrição

Criar `ContratarReservaDireta`: obtém a visão (SUB-01), verifica RN13, forma a Contratação (SUB-02) e chama a porta de retenção (C01) com identificação da operação, Contratação, condições aceitas, especialista, cliente, intervalo, duração e valor esperado. Traduz as recusas da Agenda (horário ocupado, intervalo inválido), trata a resposta perdida pela repetição com a mesma identificação e mantém a Contratação quando a retenção é recusada (D-UC08-06).

## Origem

Passos 3 a 7; FE-01 a FE-04, FE-06; RN02, RN03, RN13; contrato C01.

## Escopo

**Inclui:** Serviço de aplicação, uso da porta pública `RetencaoDeHorario` definida no UC09 (SUB-03), erros de aplicação e testes com dublês.

**Não inclui:** Implementação da Agenda (UC09); pagamento; HTTP.

## Critérios de aceite

- [ ] O Cliente contrata um Serviço de Reserva Direta com horário válido e recebe a Contratação e a Reserva `Retida` com prazo.
- [ ] Serviço Sob Proposta é recusado com orientação para o UC05; nada é registrado (FE-01).
- [ ] A solicitação de retenção leva identificação da operação, Contratação, condições aceitas, especialista, cliente, intervalo, duração e valor esperado.
- [ ] O resultado da retenção é conferido (Reserva `Retida` e prazo) e devolvido ao Cliente.
- [ ] Horário ocupado é traduzido como recusa com motivo; o Cliente pode escolher outro horário (FE-02).
- [ ] Intervalo inválido ou duração incompatível é traduzido como recusa com motivo (FE-03).
- [ ] Repetir com a mesma identificação recupera a Reserva original, sem outra Reserva nem Contratação duplicada (FE-04).
- [ ] Retenção recusada depois de formada a Contratação mantém a Contratação; nova tentativa reaproveita a mesma Contratação (FE-06, proposta).
- [ ] Serviço inexistente é recusado sem registro.

## Dependências

| Depende de | Tipo | Necessidade |
| --- | --- | --- |
| {{SUB-01}} | Interna | Usa a visão do Serviço. |
| {{SUB-02}} | Interna | Forma a Contratação. |
| UC09 | Externa | Implementa o lado da Agenda do contrato C01. |
| D-UC08-06 | Decisão | Define a política de FE-06. |
| D-UC08-07 | Decisão | Define a identificação da operação. |

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

**Título:** `[UC08-SUB-04] [C3] Expor o endpoint de contratação e verificar a jornada de ponta a ponta`  
**Labels:** `usecase:uc08`, `domain:negociacao`, `domain:agenda`, `type:feature`, `layer:api`, `layer:integration`, `priority:high`

<!-- SUB-04:START -->
> **Issue Principal:** Relacionada ao Épico {{EPIC}}

## Objetivo

Disponibilizar o caso de uso pela API e comprovar a jornada com Serviço e Agenda reais.

## Descrição

Criar o DTO com `z.strictObject` (Serviço, início, fim, fuso, identificação da operação), o controller `POST` e a tradução de erros (D-UC08-09). Incluir o teste UC02 → UC03 → UC08 com a Agenda do UC09 e o teste de repetição com a mesma identificação.

## Origem

Passos 1 e 7; FE-01 a FE-04; D1.

## Escopo

**Inclui:** DTO, controller, filtro de erros, ligação dos módulos e testes HTTP.

**Não inclui:** Pagamento; autenticação.

## Critérios de aceite

- [ ] A requisição válida responde 201 com a Contratação, a Reserva `Retida` e o prazo.
- [ ] Corpo fora do formato ou com campos não previstos responde 400 sem iniciar o caso de uso.
- [ ] Serviço Sob Proposta responde com código dedicado que orienta o UC05.
- [ ] Horário ocupado e intervalo inválido respondem com códigos distintos e estáveis.
- [ ] A repetição com a mesma identificação responde com a mesma Reserva.
- [ ] O teste de ponta a ponta UC02 → UC03 → UC08 passa com a Agenda real do UC09.

## Dependências

| Depende de | Tipo | Necessidade |
| --- | --- | --- |
| {{SUB-03}} | Interna | Chama o serviço de aplicação. |
| UC09 | Externa | Reserva real nos testes de ponta a ponta. |
| D-UC08-08 | Decisão | Origem do identificador do Cliente. |
| D-UC08-09 | Decisão | Rota e códigos. |

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

**Título:** `[UC08-SUB-05] [C3] Documentar o UC08 e o endpoint`  
**Labels:** `usecase:uc08`, `domain:negociacao`, `domain:agenda`, `type:docs`, `priority:low`

<!-- SUB-05:START -->
> **Issue Principal:** Relacionada ao Épico {{EPIC}}

## Objetivo

Manter a documentação coerente com o comportamento entregue.

## Descrição

Atualizar o README e o `requests.http` com a contratação e a repetição segura e registrar as limitações: sem autenticação (D1), sem contratação organizacional (D-UC08-05), disponibilidade e especialista suspenso indefinidos.

## Origem

Rastreabilidade do planejamento.

## Escopo

**Inclui:** README, `requests.http` e registro de limitações.

**Não inclui:** Alteração de código.

## Critérios de aceite

- [ ] Os exemplos do `requests.http` são executáveis e cobrem sucesso e as recusas principais.
- [ ] As limitações e as decisões D-UC08-01 a D-UC08-09 estão registradas.
- [ ] O README aponta para este planejamento.

## Dependências

| Depende de | Tipo | Necessidade |
| --- | --- | --- |
| {{SUB-04}} | Interna | Documenta o contrato HTTP final. |

## Responsável

@leohsm

## Estado inicial recomendado

`Backlog`

## Evidências esperadas

Pull Request com a implementação e os testes da unidade; saída de `pnpm test`, `pnpm lint` e `pnpm build` sem falhas.
<!-- SUB-05:END -->

---
