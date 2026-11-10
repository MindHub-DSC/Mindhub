# 01-04 — Sub-Issues completas

**Caso de uso:** UC11 — Reagendar Sessão  
**Issue principal:** `[UC11] Reagendar Sessão`

Cada Sub-Issue abaixo está pronta para publicação. O texto entre os marcadores `START` e `END` é o corpo da issue. `{{EPIC}}` e `{{SUB-XX}}` são substituídos pelos números reais na criação.

---

## SUB-01

**Título:** `[UC11-SUB-01] [C4] Implementar a operação de reagendamento na Reserva`  
**Labels:** `usecase:uc11`, `domain:agenda`, `type:feature`, `layer:domain`, `priority:high`

<!-- SUB-01:START -->
> **Issue Principal:** Relacionada ao Épico {{EPIC}}

## Objetivo

Permitir trocar o intervalo de uma Reserva `CONFIRMADA` preservando sua identidade.

## Descrição

Adicionar à `Reserva` a operação `reagendar(novoIntervalo)`, que só aceita Reserva `CONFIRMADA`, valida o intervalo (fim posterior ao início e duração compatível com a contratada) e mantém Contratação, valor esperado e Pagamento correlacionado.

## Origem

Passos 3 e 4; POS-01, POS-02; FE-02, FE-03; INV (intervalo); `trabalho3.md` §10, §11.2.

## Escopo

**Inclui:** Operação de domínio, erros de domínio e testes.

**Não inclui:** Disponibilidade entre Reservas (SUB-02); autorização (SUB-03).

## Critérios de aceite

- [ ] Reserva `CONFIRMADA` aceita o novo intervalo e continua `CONFIRMADA` com a mesma identidade.
- [ ] Reserva que não está `CONFIRMADA` recusa o reagendamento.
- [ ] Intervalo com fim não posterior ao início é recusado.
- [ ] Intervalo incompatível com a duração contratada é recusado.
- [ ] Contratação, valor esperado e Pagamento correlacionado permanecem inalterados.

## Dependências

| Depende de | Tipo | Necessidade |
| --- | --- | --- |
| UC09 | Externa | Fornece o Agregado Reserva. |
| UC10 | Externa | Fornece a situação `CONFIRMADA`. |

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

**Título:** `[UC11-SUB-02] [C4] Trocar o intervalo de forma atômica no repositório`  
**Labels:** `usecase:uc11`, `domain:agenda`, `type:feature`, `layer:repository`, `priority:high`

<!-- SUB-02:START -->
> **Issue Principal:** Relacionada ao Épico {{EPIC}}

## Objetivo

Garantir que verificação e troca do intervalo não possam ser separadas.

## Descrição

Estender `ReservasRepositorio` com `reagendar(reservaId, novoIntervalo)`, que verifica a sobreposição com as demais Reservas do especialista (desconsiderando a própria) e troca o intervalo na mesma seção crítica do UC09.

## Origem

Passo 3 e 4; FE-01, FE-05; RN02, RN03, RN14; `trabalho4.md` TC-C4-01.

## Escopo

**Inclui:** Extensão da porta, adaptador em memória, testes de contrato e teste de concorrência.

**Não inclui:** Banco de dados.

## Critérios de aceite

- [ ] O novo intervalo é aceito só se não se sobrepõe a outra Reserva do especialista, desconsiderado o intervalo atual da própria Reserva.
- [ ] Novo intervalo ocupado: a Reserva mantém o horário anterior e a identidade.
- [ ] Verificação e troca são atômicas: a Reserva nunca ocupa dois intervalos nem nenhum.
- [ ] Dois reagendamentos concorrentes para o mesmo intervalo: apenas um é aplicado.
- [ ] Novo intervalo adjacente a outra Reserva (fim igual ao início) é aceito.
- [ ] Os testes de contrato da porta passam para as operações de retenção e de reagendamento.

## Dependências

| Depende de | Tipo | Necessidade |
| --- | --- | --- |
| {{SUB-01}} | Interna | Usa a operação de domínio. |
| UC09 | Externa | Estende o repositório atômico. |

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

**Título:** `[UC11-SUB-03] [C4] Implementar o serviço de aplicação Reagendar Sessão`  
**Labels:** `usecase:uc11`, `domain:agenda`, `type:feature`, `layer:application`, `priority:high`

<!-- SUB-03:START -->
> **Issue Principal:** Relacionada ao Épico {{EPIC}}

## Objetivo

Coordenar autorização, reagendamento e aviso às duas partes.

## Descrição

Criar o serviço `ReagendarSessao`: obtém a Reserva e a Contratação, verifica que o ator é o cliente ou o especialista (D-UC11-04), chama o repositório e avisa as duas partes pela porta de notificações (D-UC11-05), cuja falha não desfaz o reagendamento. Não altera a Sessão (D-UC11-03).

## Origem

Passos 2, 3 e 5; FE-01 a FE-04; RN14.

## Escopo

**Inclui:** Serviço de aplicação, erros de aplicação e testes com dublês.

**Não inclui:** Efeito sobre a Sessão; concordância da outra parte; HTTP.

## Critérios de aceite

- [ ] O cliente ou o especialista da Contratação reagenda a Reserva `CONFIRMADA` para um intervalo livre e recebe a Reserva com o novo intervalo.
- [ ] Ator que não é parte da Contratação é recusado sem alterar a Reserva.
- [ ] Reserva inexistente é recusada.
- [ ] Recusas de domínio e de disponibilidade são traduzidas com motivo; nada muda.
- [ ] As duas partes são avisadas depois do reagendamento; falha do aviso não o desfaz.
- [ ] O novo intervalo é verificado com as mesmas regras de uma nova reserva (RN02, RN03).

## Dependências

| Depende de | Tipo | Necessidade |
| --- | --- | --- |
| {{SUB-02}} | Interna | Usa a troca atômica. |
| D-UC11-03 | Decisão | Define o efeito sobre a Sessão. |
| D-UC11-04 | Decisão | Define a autorização. |
| D-UC11-05 | Decisão | Define o aviso. |

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

**Título:** `[UC11-SUB-04] [C4] Expor o endpoint de reagendamento e verificar a concorrência`  
**Labels:** `usecase:uc11`, `domain:agenda`, `type:feature`, `layer:api`, `layer:integration`, `priority:high`

<!-- SUB-04:START -->
> **Issue Principal:** Relacionada ao Épico {{EPIC}}

## Objetivo

Disponibilizar o reagendamento pela API e comprovar o comportamento sob concorrência.

## Descrição

Criar DTO, controller e tradução de erros (D-UC11-06). Escrever os testes de ponta a ponta: Reserva confirmada pelo UC10, reagendamento válido, intervalo ocupado e dois reagendamentos simultâneos.

## Origem

Passo 1; FE-01 a FE-05; D1.

## Escopo

**Inclui:** DTO, controller, filtro de erros e testes HTTP.

**Não inclui:** Autenticação.

## Critérios de aceite

- [ ] O reagendamento válido responde 200 com o novo intervalo e a Reserva `CONFIRMADA`.
- [ ] Corpo fora do formato ou com campos não previstos responde 400 sem iniciar o caso de uso.
- [ ] Intervalo ocupado e Reserva não confirmada respondem 409; intervalo inválido, 422; ator que não é parte, 403; Reserva inexistente, 404.
- [ ] Dois reagendamentos simultâneos para o mesmo intervalo: um responde 200 e o outro 409.
- [ ] O teste cobre a jornada UC10 → UC11 com Reserva real.

## Dependências

| Depende de | Tipo | Necessidade |
| --- | --- | --- |
| {{SUB-03}} | Interna | Chama o serviço de aplicação. |
| D-UC11-06 | Decisão | Rota e códigos. |
| D-UC11-07 | Decisão | Origem do identificador do ator. |

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

**Título:** `[UC11-SUB-05] [C4] Documentar o UC11 e o endpoint`  
**Labels:** `usecase:uc11`, `domain:agenda`, `type:docs`, `priority:low`

<!-- SUB-05:START -->
> **Issue Principal:** Relacionada ao Épico {{EPIC}}

## Objetivo

Manter a documentação coerente com o comportamento entregue.

## Descrição

Atualizar o README e o `requests.http` com os exemplos do caso de uso e registrar as limitações: sem autenticação (D1), sem concordância da outra parte, sem antecedência mínima nem limite de reagendamentos e efeito sobre a Sessão indefinido.

## Origem

Rastreabilidade do planejamento.

## Escopo

**Inclui:** README, `requests.http` e registro de limitações.

**Não inclui:** Alteração de código.

## Critérios de aceite

- [ ] Os exemplos do `requests.http` são executáveis e cobrem sucesso e as recusas principais.
- [ ] As limitações e as decisões D-UC11-01 a D-UC11-07 estão registradas.
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
