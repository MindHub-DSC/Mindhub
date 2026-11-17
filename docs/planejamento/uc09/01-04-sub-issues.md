# 01-04 — Sub-Issues completas

**Caso de uso:** UC09 — Agendar Sessão Contratada  
**Issue principal:** `[UC09] Agendar Sessão Contratada`

Cada Sub-Issue abaixo está pronta para publicação. O texto entre os marcadores `START` e `END` é o corpo da issue. `{{EPIC}}` e `{{SUB-XX}}` são substituídos pelos números reais na criação.

---

## SUB-01

**Título:** `[UC09-SUB-01] [C4] Modelar a Reserva, o Intervalo de Tempo e o ciclo da retenção`  
**Labels:** `usecase:uc09`, `domain:agenda`, `domain:negociacao`, `type:feature`, `layer:domain`, `priority:high`

<!-- SUB-01:START -->
> **Issue Principal:** Relacionada ao Épico {{EPIC}}

## Objetivo

Representar a Reserva `Retida` com intervalo, prazo, valor esperado e a liberação por expiração.

## Descrição

Criar o objeto de valor `IntervaloDeTempo` (início incluído, fim excluído, fuso, D-UC09-06), o Agregado `Reserva` (identidade, Contratação, referência das condições aceitas, especialista, cliente, intervalo, duração contratada, valor esperado, identificação da operação, limite de validade, situação `RETIDA`/`LIBERADA`) e a operação `liberarPorExpiracao(agora)`. Reservar na Reserva o espaço para a correlação de um Pagamento pendente, que o UC10-SUB-03 preencherá. `CONFIRMADA` e `CANCELADA` são acrescentadas pelo UC10 e pelo UC12.

## Origem

POS-01, POS-02; passos 4 e 5; RN02, RN08; INV-01; `trabalho3.md` §5.1, §10, §11.2; `trabalho4.md` §8.1.2, §8.1.4.

## Escopo

**Inclui:** Objeto de valor, Agregado, erros de domínio e testes de domínio.

**Não inclui:** Persistência; disponibilidade entre Reservas (SUB-02); confirmação (UC10).

## Critérios de aceite

- [ ] A Reserva nasce `RETIDA` com identidade, Contratação, especialista, cliente, intervalo, duração contratada, valor esperado, identificação da operação e limite de validade.
- [ ] Intervalo com fim não posterior ao início é recusado.
- [ ] Intervalo incompatível com a duração contratada é recusado.
- [ ] Intervalos são comparados com início incluído e fim excluído; sessões adjacentes não se sobrepõem.
- [ ] Reserva `RETIDA` vencida passa a `LIBERADA` por expiração, uma só vez.
- [ ] A Reserva guarda o valor esperado recebido sem recalcular e reserva espaço para a correlação do Pagamento pendente (UC10-SUB-03).

## Dependências

| Depende de | Tipo | Necessidade |
| --- | --- | --- |
| D-UC09-04 | Decisão | Define o prazo da retenção. |
| D-UC09-06 | Decisão | Define a comparação dos intervalos. |

Esta issue fornece o que é consumido por {{SUB-02}}, {{SUB-03}}, {{SUB-05}}.

## Responsável

@leohsm

## Estado inicial recomendado

`Backlog`

## Evidências esperadas

Pull Request com a implementação e os testes da unidade; saída de `pnpm test`, `pnpm lint` e `pnpm build` sem falhas.
<!-- SUB-01:END -->

---

## SUB-02

**Título:** `[UC09-SUB-02] [C4] Registrar a retenção de forma atômica e idempotente no repositório`  
**Labels:** `usecase:uc09`, `domain:agenda`, `domain:negociacao`, `type:feature`, `layer:repository`, `priority:high`

<!-- SUB-02:START -->
> **Issue Principal:** Relacionada ao Épico {{EPIC}}

## Objetivo

Garantir que a verificação de disponibilidade e a gravação não possam ser separadas e que a repetição não crie outra Reserva.

## Descrição

Criar a porta `ReservasRepositorio` (`reter(reserva)`, `buscarPorId`, `buscarPorIdentificacaoDaOperacao`, `listarRetidasVencidas(agora)`) e o adaptador em memória com seção crítica por especialista: verifica a sobreposição com retenções válidas e Reservas confirmadas e grava na mesma operação, devolve a Reserva original em repetição com os mesmos dados e recusa conflito de identificação (D-UC09-05, D-UC09-08).

## Origem

POS-03; passo 5; FA-01; FE-03, FE-05; RN03; `trabalho4.md` §8.1.4, TC-C4-01.

## Escopo

**Inclui:** Porta, adaptador em memória, testes de contrato e teste de concorrência.

**Não inclui:** Banco de dados e restrição de exclusão; confirmação da Reserva.

## Critérios de aceite

- [ ] Duas retenções simultâneas para intervalos incompatíveis do mesmo especialista: apenas uma é registrada (TC-C4-01).
- [ ] Intervalo adjacente (início igual ao fim de outra) é aceito.
- [ ] Retenção vencida não bloqueia nova retenção do mesmo horário.
- [ ] Mesma identificação e mesmos dados devolve a mesma Reserva, sem registro adicional.
- [ ] Mesma identificação com outro intervalo é recusada por conflito; a intenção original não é substituída.
- [ ] Verificação e gravação são atômicas: nunca há gravação sem verificação.
- [ ] O adaptador devolve cópias defensivas e busca por identificador e por identificação da operação.

## Dependências

| Depende de | Tipo | Necessidade |
| --- | --- | --- |
| {{SUB-01}} | Interna | Usa a Reserva e o Intervalo. |
| D-UC09-02 | Decisão | Define o que torna um horário disponível. |
| D-UC09-05 | Decisão | Define se retenções válidas também bloqueiam. |
| D-UC09-08 | Decisão | Define a persistência. |

Esta issue fornece o que é consumido por {{SUB-03}}, {{SUB-05}}.

## Responsável

@leohsm

## Estado inicial recomendado

`Backlog`

## Evidências esperadas

Pull Request com a implementação e os testes da unidade; saída de `pnpm test`, `pnpm lint` e `pnpm build` sem falhas.
<!-- SUB-02:END -->

---

## SUB-03

**Título:** `[UC09-SUB-03] [C4] Implementar o contrato C01 (porta pública de retenção de horário)`  
**Labels:** `usecase:uc09`, `domain:agenda`, `domain:negociacao`, `type:feature`, `layer:application`, `priority:high`

<!-- SUB-03:START -->
> **Issue Principal:** Relacionada ao Épico {{EPIC}}

## Objetivo

Disponibilizar a C3 uma única operação pública que valida, retém e informa a Reserva, com as recusas documentadas.

## Descrição

Criar a interface pública `RetencaoDeHorario` e seu serviço em C4, com a resposta tipada: `RETIDA` com prazo, `RECUSADA` com motivo (intervalo inválido, duração incompatível, horário ocupado, conflito de identificação) e a situação atual em repetições, inclusive após a expiração, sem renovar. O prazo vem da configuração (D-UC09-04). A porta é a mesma consumida pelo UC08.

## Origem

Passos 3 a 5; FA-01, FA-02; FE-01 a FE-04; RN02, RN03; `trabalho4.md` §8.1.

## Escopo

**Inclui:** Interface pública, serviço de aplicação, tipos de resposta, configuração do prazo e testes com o repositório em memória.

**Não inclui:** Reconhecimento da Contratação e do ator (SUB-04); HTTP.

## Critérios de aceite

- [ ] Retenção válida devolve a Reserva `RETIDA`, o intervalo e o limite de validade.
- [ ] Intervalo inválido ou duração incompatível é recusado com motivo; nada é registrado.
- [ ] Horário ocupado é recusado com motivo; a operação vencedora é preservada.
- [ ] Repetição reconhecida devolve a mesma Reserva e sua situação atual.
- [ ] Repetição depois da expiração informa a situação atual e não renova a retenção.
- [ ] Mesma identificação com outro intervalo é recusada por conflito.
- [ ] O prazo da retenção é definido por C4 a partir da configuração e informado na resposta.

## Dependências

| Depende de | Tipo | Necessidade |
| --- | --- | --- |
| {{SUB-01}} | Interna | Usa o domínio da Reserva. |
| {{SUB-02}} | Interna | Usa o repositório atômico. |
| D-UC09-01 | Decisão | Define que a chamada reserva um intervalo. |
| D-UC09-04 | Decisão | Define o prazo. |

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

**Título:** `[UC09-SUB-04] [C3] Implementar o serviço de C3 Agendar Sessão Contratada`  
**Labels:** `usecase:uc09`, `domain:agenda`, `domain:negociacao`, `type:feature`, `layer:application`, `priority:high`

<!-- SUB-04:START -->
> **Issue Principal:** Relacionada ao Épico {{EPIC}}

## Objetivo

Reconhecer a Contratação e o ator em C3 e chamar o contrato C01 com os dados corretos.

## Descrição

Criar o serviço `AgendarSessaoContratada` em C3: obtém a Contratação, verifica que o ator é o cliente dela, monta a chamada a C01 com identificação da operação, referência da Contratação e das condições aceitas, especialista, cliente, intervalo, duração contratada e valor esperado, e traduz a resposta de C4. A repetição com a mesma identificação recupera a Reserva original.

## Origem

Passos 2, 3 e 6; PRE-01; FA-01; FE-04, FE-06; RN11 (cliente individual).

## Escopo

**Inclui:** Serviço de aplicação, erros de aplicação e testes com dublê da porta de C4.

**Não inclui:** Vínculo organizacional (UC16/UC17); HTTP.

## Critérios de aceite

- [ ] A chamada a C01 leva identificação da operação, Contratação, condições aceitas, especialista, cliente, intervalo, duração contratada e valor esperado.
- [ ] Contratação inexistente é recusada sem chamar a Agenda.
- [ ] Ator que não é o cliente da Contratação é recusado sem chamar a Agenda.
- [ ] Recusas da Agenda (horário ocupado, intervalo inválido, conflito) são traduzidas com o motivo.
- [ ] Resposta perdida: repetir com a mesma identificação recupera a Reserva original, sem outra Reserva.
- [ ] O Cliente recebe a Reserva, o intervalo e o limite de validade.

## Dependências

| Depende de | Tipo | Necessidade |
| --- | --- | --- |
| {{SUB-03}} | Interna | Chama o contrato C01. |
| UC07 | Externa | Fornece a Contratação formada e seu repositório. |

Esta issue fornece o que é consumido por {{SUB-06}}.

## Responsável

@leohsm

## Estado inicial recomendado

`Backlog`

## Evidências esperadas

Pull Request com a implementação e os testes da unidade; saída de `pnpm test`, `pnpm lint` e `pnpm build` sem falhas.
<!-- SUB-04:END -->

---

## SUB-05

**Título:** `[UC09-SUB-05] [C4] Liberar a retenção expirada por tempo`  
**Labels:** `usecase:uc09`, `domain:agenda`, `domain:negociacao`, `type:feature`, `layer:application`, `priority:high`

<!-- SUB-05:START -->
> **Issue Principal:** Relacionada ao Épico {{EPIC}}

## Objetivo

Aplicar RN08 por tempo: a retenção vencida libera o horário sem ação do usuário.

## Descrição

Criar o serviço `LiberarRetencoesExpiradas` com relógio injetável e o gatilho definido em D-UC09-07 (verificação no acesso e varredura periódica no processo). O serviço lista as Reservas `RETIDA` vencidas e aplica `liberarPorExpiracao`, uma só vez por Reserva.

## Origem

FE-07; RN08; `trabalho5.md` §4.2; `trabalho4.md` §8.1.4.

## Escopo

**Inclui:** Serviço, gatilho, relógio injetável e testes.

**Não inclui:** Aprovação tardia de Pagamento (UC10); cancelamento (UC12).

## Critérios de aceite

- [ ] Reserva `RETIDA` vencida é liberada pela política de domínio, sem ação do usuário.
- [ ] Reserva `RETIDA` ainda válida não é afetada.
- [ ] A liberação ocorre uma só vez por Reserva, mesmo com execuções repetidas.
- [ ] O horário liberado volta a aceitar retenção.
- [ ] Reserva `LIBERADA` não volta a `RETIDA` nem é renovada por repetição do pedido.
- [ ] O gatilho é testável com relógio injetável, sem esperar tempo real.

## Dependências

| Depende de | Tipo | Necessidade |
| --- | --- | --- |
| {{SUB-01}} | Interna | Usa `liberarPorExpiracao`. |
| {{SUB-02}} | Interna | Lista as retenções vencidas. |
| D-UC09-07 | Decisão | Define o gatilho. |

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

**Título:** `[UC09-SUB-06] [C3] Expor o endpoint de agendamento e verificar a concorrência de ponta a ponta`  
**Labels:** `usecase:uc09`, `domain:agenda`, `domain:negociacao`, `type:feature`, `layer:api`, `layer:integration`, `priority:high`

<!-- SUB-06:START -->
> **Issue Principal:** Relacionada ao Épico {{EPIC}}

## Objetivo

Disponibilizar o caso de uso pela API e comprovar o comportamento sob concorrência e repetição.

## Descrição

Criar o DTO com `z.strictObject` (intervalo e identificação da operação), o controller e a tradução de erros (D-UC09-10). Escrever o teste UC07 → UC09 com Contratação real, o teste de repetição e o teste de duas requisições simultâneas para intervalos incompatíveis.

## Origem

Passos 1 e 6; FE-02, FE-04 a FE-06; D1.

## Escopo

**Inclui:** DTO, controller, filtro de erros, ligação dos módulos e testes HTTP.

**Não inclui:** Pagamento; autenticação.

## Critérios de aceite

- [ ] A requisição válida responde 201 com a Reserva, o intervalo e o limite de validade.
- [ ] Corpo fora do formato ou com campos não previstos responde 400 sem iniciar o caso de uso.
- [ ] Horário ocupado responde 409 e intervalo inválido responde 422.
- [ ] A repetição com a mesma identificação responde com a mesma Reserva; com outro intervalo, 409.
- [ ] Ator que não é o cliente responde 403; Contratação inexistente responde 404.
- [ ] Duas requisições simultâneas para intervalos incompatíveis: uma responde 201 e a outra 409 (TC-C4-01).

## Dependências

| Depende de | Tipo | Necessidade |
| --- | --- | --- |
| {{SUB-04}} | Interna | Chama o serviço de C3. |
| {{SUB-05}} | Interna | Liberação por tempo disponível para os testes. |
| D-UC09-09 | Decisão | Origem do identificador do Cliente. |
| D-UC09-10 | Decisão | Rota e códigos. |

Esta issue fornece o que é consumido por {{SUB-07}}.

## Responsável

@leohsm

## Estado inicial recomendado

`Backlog`

## Evidências esperadas

Pull Request com a implementação e os testes da unidade; saída de `pnpm test`, `pnpm lint` e `pnpm build` sem falhas.
<!-- SUB-06:END -->

---

## SUB-07

**Título:** `[UC09-SUB-07] [C4] Documentar o UC09 e o endpoint`  
**Labels:** `usecase:uc09`, `domain:agenda`, `domain:negociacao`, `type:docs`, `priority:low`

<!-- SUB-07:START -->
> **Issue Principal:** Relacionada ao Épico {{EPIC}}

## Objetivo

Manter a documentação coerente com o comportamento entregue.

## Descrição

Atualizar o README e o `requests.http` com os exemplos do caso de uso e registrar as limitações: sem autenticação (D1), sem pacotes (D-UC09-01), sem disponibilidade definida pelo especialista (D-UC09-02), sem vínculo organizacional e persistência em memória (D-UC09-08).

## Origem

Rastreabilidade do planejamento.

## Escopo

**Inclui:** README, `requests.http` e registro de limitações.

**Não inclui:** Alteração de código.

## Critérios de aceite

- [ ] Os exemplos do `requests.http` são executáveis e cobrem sucesso e as recusas principais.
- [ ] As limitações e as decisões D-UC09-01 a D-UC09-10 estão registradas.
- [ ] O README aponta para este planejamento.

## Dependências

| Depende de | Tipo | Necessidade |
| --- | --- | --- |
| {{SUB-06}} | Interna | Documenta o contrato HTTP final. |

## Responsável

@leohsm

## Estado inicial recomendado

`Backlog`

## Evidências esperadas

Pull Request com a implementação e os testes da unidade; saída de `pnpm test`, `pnpm lint` e `pnpm build` sem falhas.
<!-- SUB-07:END -->

---
