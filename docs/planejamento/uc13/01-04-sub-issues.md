# 01-04 — Sub-Issues completas

**Caso de uso:** UC13 — Realizar Sessão  
**Issue principal:** `[UC13] Realizar Sessão`

Cada Sub-Issue abaixo está pronta para publicação. O texto entre os marcadores `START` e `END` é o corpo da issue. `{{EPIC}}` e `{{SUB-XX}}` são substituídos pelos números reais na criação.

---

## SUB-01

**Título:** `[UC13-SUB-01] [C4] Modelar a Sessão, a Participação e o ciclo de vida`  
**Labels:** `usecase:uc13`, `domain:agenda`, `type:feature`, `layer:domain`, `layer:repository`, `priority:high`

<!-- SUB-01:START -->
> **Issue Principal:** Relacionada ao Épico {{EPIC}}

## Objetivo

Representar a Sessão e seu ciclo, com Participação mínima e uma Sessão por Reserva.

## Descrição

Criar o Agregado `Sessao` (identidade, Contratação, Reserva, situação `PROGRAMADA`/`EM_ANDAMENTO`/`CONCLUIDA`/`CANCELADA`), a entidade `Participacao` (usuário, papel — D-UC13-06) e as operações `iniciar` e `concluir`. Definir a porta `SessoesRepositorio` (`adicionar`, `buscarPorId`, `buscarPorReserva`) e o adaptador em memória com unicidade por Reserva.

## Origem

POS-01, POS-02; passos 2 e 3; FE-01, FE-04; invariantes de T3 §10 e §8.

## Escopo

**Inclui:** Agregado, entidade, erros de domínio, porta, adaptador em memória e testes.

**Não inclui:** Cancelar a Sessão (UC12); indicar participantes (UC15); videoconferência.

## Critérios de aceite

- [ ] A Sessão nasce `PROGRAMADA`, pertence a uma Contratação e deriva de uma Reserva.
- [ ] Toda Sessão tem pelo menos uma Participação; Sessão sem Participação é recusada.
- [ ] `iniciar` leva `PROGRAMADA` a `EM_ANDAMENTO` e `concluir` leva `EM_ANDAMENTO` a `CONCLUIDA`.
- [ ] Iniciar Sessão que não está `PROGRAMADA` e concluir Sessão que não está `EM_ANDAMENTO` são recusados.
- [ ] Concluir uma Sessão já `CONCLUIDA` não tem efeito adicional.
- [ ] Uma segunda Sessão para a mesma Reserva é recusada (Reserva — Sessão `1 : 0..1`).
- [ ] O adaptador em memória devolve cópias defensivas.

## Dependências

| Depende de | Tipo | Necessidade |
| --- | --- | --- |
| D-UC13-06 | Decisão | Define as Participações iniciais. |

Esta issue fornece o que é consumido por {{SUB-02}}, {{SUB-04}}.

## Responsável

@leohsm

## Estado inicial recomendado

`Backlog`

## Evidências esperadas

Pull Request com a implementação e os testes da unidade; saída de `pnpm test`, `pnpm lint` e `pnpm build` sem falhas.
<!-- SUB-01:END -->

---

## SUB-02

**Título:** `[UC13-SUB-02] [C4] Criar a Sessão `Programada` a partir da Reserva confirmada`  
**Labels:** `usecase:uc13`, `domain:agenda`, `type:feature`, `layer:application`, `priority:high`

<!-- SUB-02:START -->
> **Issue Principal:** Relacionada ao Épico {{EPIC}}

## Objetivo

Garantir que cada Reserva confirmada gere exatamente uma Sessão com suas Participações.

## Descrição

Criar o consumidor em C4 do resultado do UC10 (Reserva `CONFIRMADA`) que cria a Sessão `PROGRAMADA` com as Participações do cliente e do especialista (D-UC13-06), de forma idempotente. A criação e a marcação do fato como tratado ocorrem juntas.

## Origem

PRE-01; passo 1 (origem da Sessão); `trabalho3.md` §7; D-UC13-02.

## Escopo

**Inclui:** Consumidor, idempotência, testes com dublês e integração com a confirmação do UC10.

**Não inclui:** Reagendamento (UC11); cancelamento (UC12).

## Critérios de aceite

- [ ] Reserva `CONFIRMADA` gera uma Sessão `PROGRAMADA` com as Participações do cliente e do especialista.
- [ ] O mesmo fato repetido não cria uma segunda Sessão.
- [ ] Reserva que não está `CONFIRMADA` não gera Sessão.
- [ ] A criação da Sessão e a marcação do fato como tratado ocorrem juntas; falha entre as duas não deixa Sessão duplicada.

## Dependências

| Depende de | Tipo | Necessidade |
| --- | --- | --- |
| {{SUB-01}} | Interna | Usa o Agregado e o repositório. |
| UC10 | Externa | Fornece a Reserva `CONFIRMADA` (UC10-SUB-06). |
| D-UC13-02 | Decisão | Define quando a Sessão é criada. |

Esta issue fornece o que é consumido por {{SUB-05}}.

## Responsável

@leohsm

## Estado inicial recomendado

`Backlog`

## Evidências esperadas

Pull Request com a implementação e os testes da unidade; saída de `pnpm test`, `pnpm lint` e `pnpm build` sem falhas.
<!-- SUB-02:END -->

---

## SUB-03

**Título:** `[UC13-SUB-03] [C4] Definir a porta do Serviço de videoconferência e o adaptador simulado`  
**Labels:** `usecase:uc13`, `domain:agenda`, `type:feature`, `layer:adapter`, `priority:high`

<!-- SUB-03:START -->
> **Issue Principal:** Relacionada ao Épico {{EPIC}}

## Objetivo

Isolar o Serviço de videoconferência e tolerar sua indisponibilidade.

## Descrição

Criar a porta `ServicoDeVideoconferencia` (`obterAmbiente(sessaoId)`), o adaptador simulado que devolve um identificador de ambiente e permite simular a indisponibilidade, e a tradução da falha para um erro de aplicação distinto.

## Origem

Passo 1; FE-03; `trabalho5.md` §2.2, §4.2.

## Escopo

**Inclui:** Porta, adaptador simulado, erro de aplicação e testes.

**Não inclui:** Provedor real (D-UC13-05); gravação e anotações.

## Critérios de aceite

- [ ] A porta obtém o ambiente remoto de uma Sessão e o devolve ao chamador.
- [ ] O adaptador simulado devolve um ambiente para cada Sessão e permite simular a indisponibilidade.
- [ ] A indisponibilidade é traduzida para um erro de aplicação distinto, sem exceção bruta.
- [ ] O adaptador não conhece as regras do ciclo da Sessão.

## Dependências

| Depende de | Tipo | Necessidade |
| --- | --- | --- |
| D-UC13-05 | Decisão | Define o provedor. |

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

**Título:** `[UC13-SUB-04] [C4] Implementar o serviço de aplicação Iniciar e Concluir Sessão`  
**Labels:** `usecase:uc13`, `domain:agenda`, `type:feature`, `layer:application`, `priority:high`

<!-- SUB-04:START -->
> **Issue Principal:** Relacionada ao Épico {{EPIC}}

## Objetivo

Coordenar autoria, ambiente remoto, transições e aviso ao cliente.

## Descrição

Criar `IniciarSessao` e `ConcluirSessao`: verificam que o ator é o especialista da Contratação, obtêm o ambiente remoto ao iniciar e deixam a Sessão `EM_ANDAMENTO`; ao concluir, reconhecem a conclusão conforme D-UC13-01 e deixam a Sessão `CONCLUIDA`; informam o cliente, cuja falha de aviso não desfaz a conclusão.

## Origem

Passos 1 a 4; FE-01 a FE-04; RN09.

## Escopo

**Inclui:** Dois serviços de aplicação, erros de aplicação e testes com dublês.

**Não inclui:** HTTP; no-show e atraso.

## Critérios de aceite

- [ ] O especialista da Contratação inicia a Sessão `PROGRAMADA` e recebe a Sessão `EM_ANDAMENTO` com o ambiente remoto.
- [ ] Ator que não é o especialista da Contratação é recusado sem alterar a Sessão.
- [ ] Sessão que não está `PROGRAMADA` é recusada ao iniciar.
- [ ] Videoconferência indisponível: a Sessão continua `PROGRAMADA` e o especialista pode tentar de novo.
- [ ] O especialista conclui a Sessão `EM_ANDAMENTO`, que fica `CONCLUIDA`, conforme D-UC13-01.
- [ ] A conclusão repetida não tem efeito adicional e o cliente não é avisado duas vezes.
- [ ] Depois da conclusão, a Sessão satisfaz o critério de elegibilidade de avaliação (RN09).

## Dependências

| Depende de | Tipo | Necessidade |
| --- | --- | --- |
| {{SUB-01}} | Interna | Usa o Agregado. |
| {{SUB-03}} | Interna | Obtém o ambiente remoto. |
| D-UC13-01 | Decisão | Define como a conclusão é reconhecida. |

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

**Título:** `[UC13-SUB-05] [C4] Expor os endpoints de início e conclusão e verificar a jornada`  
**Labels:** `usecase:uc13`, `domain:agenda`, `type:feature`, `layer:api`, `layer:integration`, `priority:high`

<!-- SUB-05:START -->
> **Issue Principal:** Relacionada ao Épico {{EPIC}}

## Objetivo

Disponibilizar o caso de uso pela API e comprovar a jornada da Reserva confirmada à Sessão concluída.

## Descrição

Criar os DTOs, os controllers de início e conclusão e a tradução de erros (D-UC13-07). Escrever o teste de ponta a ponta com a Reserva confirmada pelo UC10: Sessão criada, iniciada e concluída, incluindo indisponibilidade da videoconferência.

## Origem

Passos 1 a 4; FE-01 a FE-04; D1.

## Escopo

**Inclui:** DTOs, controllers, filtro de erros, ligação dos módulos e testes HTTP.

**Não inclui:** Autenticação.

## Critérios de aceite

- [ ] O início responde 200 com a Sessão `EM_ANDAMENTO` e o ambiente remoto; a conclusão responde 200 com a Sessão `CONCLUIDA`.
- [ ] Identificadores ou corpo fora do formato respondem 400 sem iniciar o caso de uso.
- [ ] Ator que não é o especialista responde 403; Sessão inexistente, 404; Sessão em estado inválido, 409.
- [ ] Videoconferência indisponível responde 503 e a Sessão continua `PROGRAMADA`.
- [ ] O teste cobre a jornada UC10 → Sessão criada → início → conclusão.

## Dependências

| Depende de | Tipo | Necessidade |
| --- | --- | --- |
| {{SUB-02}} | Interna | A Sessão precisa existir. |
| {{SUB-04}} | Interna | Chama os serviços. |
| D-UC13-07 | Decisão | Rotas e códigos. |
| D-UC13-08 | Decisão | Origem do identificador do ator. |

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

**Título:** `[UC13-SUB-06] [C4] Documentar o UC13 e o endpoint`  
**Labels:** `usecase:uc13`, `domain:agenda`, `type:docs`, `priority:low`

<!-- SUB-06:START -->
> **Issue Principal:** Relacionada ao Épico {{EPIC}}

## Objetivo

Manter a documentação coerente com o comportamento entregue.

## Descrição

Atualizar o README e o `requests.http` com os exemplos do caso de uso e registrar as limitações: sem autenticação (D1), conclusão declarada pelo especialista (D-UC13-01), videoconferência simulada, no-show e atraso indefinidos.

## Origem

Rastreabilidade do planejamento.

## Escopo

**Inclui:** README, `requests.http` e registro de limitações.

**Não inclui:** Alteração de código.

## Critérios de aceite

- [ ] Os exemplos do `requests.http` são executáveis e cobrem sucesso e as recusas principais.
- [ ] As limitações e as decisões D-UC13-01 a D-UC13-08 estão registradas.
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
