# 01-04 — Sub-Issues completas

**Caso de uso:** UC21 — Decidir Disputa  
**Issue principal:** `[UC21] Decidir Disputa`

Cada Sub-Issue abaixo está pronta para publicação. O texto entre os marcadores `START` e `END` é o corpo da issue. `{{EPIC}}` e `{{SUB-XX}}` são substituídos pelos números reais na criação.

---

## SUB-01

**Título:** `[UC21-SUB-01] [C6] Estender a Disputa com o ciclo de decisão`  
**Labels:** `usecase:uc21`, `domain:governanca`, `type:feature`, `layer:domain`, `priority:high`

<!-- SUB-01:START -->
> **Issue Principal:** Relacionada ao Épico {{EPIC}}

## Objetivo

Registrar a decisão de forma imutável e conduzir a Disputa por seus estados provisórios.

## Descrição

Estender o Agregado `Disputa` (UC20) com a entidade `Decisao` (autor, fundamento, referência, instante) e as operações `colocarEmAnalise`, `aguardarInformacoes`, `retomarAnalise`, `resolver(decisao)` e `cancelar`, conforme D-UC21-01. A decisão não pode ser alterada depois de registrada.

## Origem

Passo 2; POS-01, POS-03; FA-01, FA-02; RN15; `trabalho3.md` §11.5.

## Escopo

**Inclui:** Extensão do Agregado, entidade Decisão, erros de domínio e testes.

**Não inclui:** Ações decorrentes (SUB-02); recurso; estado `Encerrada`.

## Critérios de aceite

- [ ] A decisão é registrada com autor, fundamento, referência à Disputa e instante, e não pode ser alterada.
- [ ] `resolver` leva a Disputa `EM_ANALISE` a `RESOLVIDA`.
- [ ] A Disputa sem informações vai para `AGUARDANDO_INFORMACOES` e volta a `EM_ANALISE` quando recebidas.
- [ ] A Disputa retirada ou inválida vai para `CANCELADA`.
- [ ] Decisão sem fundamento é recusada (RN15).
- [ ] Transições fora do ciclo provisório são recusadas.

## Dependências

| Depende de | Tipo | Necessidade |
| --- | --- | --- |
| UC20 | Externa | Fornece o Agregado Disputa. |
| D-UC21-01 | Decisão | Define os estados provisórios. |

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

**Título:** `[UC21-SUB-02] [C6] Registrar as ações decorrentes separadamente da decisão`  
**Labels:** `usecase:uc21`, `domain:governanca`, `type:feature`, `layer:domain`, `layer:repository`, `priority:high`

<!-- SUB-02:START -->
> **Issue Principal:** Relacionada ao Épico {{EPIC}}

## Objetivo

Guardar a solicitação e o resultado de cada ação, com idempotência por decisão.

## Descrição

Criar a entidade `AcaoDecorrente` (decisão, tipo, situação `SOLICITADA`/`EXECUTADA`/`RECUSADA`, motivo, instante) e a porta `AcoesRepositorio` com `registrarSolicitacao`, que recusa a repetição do mesmo comando (decisão e tipo), e `registrarResultado`. O adaptador em memória devolve cópias defensivas.

## Origem

Passo 4; POS-02; FE-01, FE-02; `trabalho4.md` TC-C6-01.

## Escopo

**Inclui:** Entidade, porta, adaptador em memória e testes de contrato.

**Não inclui:** Execução dos comandos (SUB-03).

## Critérios de aceite

- [ ] A solicitação de cada ação é registrada com decisão, tipo e instante.
- [ ] O resultado (executada ou recusada, com motivo) é registrado separadamente da decisão.
- [ ] O comando repetido para a mesma decisão e o mesmo tipo é recusado sem nova solicitação.
- [ ] A recusa da ação não altera a decisão registrada.
- [ ] O adaptador devolve cópias defensivas.

## Dependências

| Depende de | Tipo | Necessidade |
| --- | --- | --- |
| {{SUB-01}} | Interna | Referencia a Decisão. |

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

**Título:** `[UC21-SUB-03] [C6] Definir as portas de comandos dos contextos e o adaptador da suspensão`  
**Labels:** `usecase:uc21`, `domain:governanca`, `type:feature`, `layer:adapter`, `priority:high`

<!-- SUB-03:START -->
> **Issue Principal:** Relacionada ao Épico {{EPIC}}

## Objetivo

Solicitar ações aos contextos proprietários por comandos públicos, sem alterá-los diretamente.

## Descrição

Criar a porta `ComandosDeContexto` com o comando `suspenderPerfil` (UC18-SUB-03), o adaptador que o executa pelo serviço público de C2 e a tradução da recusa por estado mudado. Ações financeiras não são criadas (D-UC21-02).

## Origem

Passo 3; FE-01, FE-02; INV-01; `trabalho4.md` §3.6, TC-C6-01.

## Escopo

**Inclui:** Porta, adaptador do UC18, tradução de respostas e testes.

**Não inclui:** Estorno e compensação; alteração direta de Reserva, Pagamento ou condições.

## Critérios de aceite

- [ ] O comando de suspensão é solicitado pelo serviço público de C2 e nunca por acesso direto ao perfil.
- [ ] A recusa do contexto por mudança de estado é traduzida para um resultado de ação recusada, sem exceção bruta.
- [ ] O comando repetido para a mesma decisão não é reaplicado.
- [ ] Nenhuma porta oferece operação que altere diretamente Reservas, Pagamentos ou condições contratadas.
- [ ] Os adaptadores simulados respeitam o contrato da porta.

## Dependências

| Depende de | Tipo | Necessidade |
| --- | --- | --- |
| UC18 | Externa | Fornece o comando de suspensão. |
| D-UC21-02 | Decisão | Define as ações possíveis. |

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

**Título:** `[UC21-SUB-04] [C6] Implementar o serviço de aplicação Decidir Disputa`  
**Labels:** `usecase:uc21`, `domain:governanca`, `type:feature`, `layer:application`, `priority:high`

<!-- SUB-04:START -->
> **Issue Principal:** Relacionada ao Épico {{EPIC}}

## Objetivo

Coordenar a verificação do Administrador, a decisão, as ações e o aviso às partes.

## Descrição

Criar `DecidirDisputa`, `PedirInformacoes` e `CancelarDisputa`: verificam que o ator é Administrador (D-UC21-04), analisam as evidências por visões (D-UC21-05), registram a decisão, solicitam as ações pelas portas (SUB-03), registram a resposta de cada uma (SUB-02) e informam as partes. A recusa de uma ação não desfaz a decisão.

## Origem

Passos 1 a 5; FA-01, FA-02; FE-01 a FE-03; RN15.

## Escopo

**Inclui:** Três serviços de aplicação, erros de aplicação e testes com dublês.

**Não inclui:** HTTP; recurso.

## Critérios de aceite

- [ ] O Administrador decide a Disputa aberta e a decisão fica registrada com autor e fundamento; a Disputa fica `RESOLVIDA`.
- [ ] Cada ação decorrente é solicitada ao contexto proprietário e a solicitação e o resultado ficam registrados separadamente.
- [ ] A ação recusada por mudança de estado fica registrada como recusada e a decisão permanece.
- [ ] O comando repetido para a mesma decisão não é reaplicado.
- [ ] O pedido de informações deixa a Disputa `AGUARDANDO_INFORMACOES`.
- [ ] O cancelamento deixa a Disputa `CANCELADA`.
- [ ] Disputa que não está aberta ou em análise é recusada.
- [ ] As partes são informadas depois do registro; falha do aviso não desfaz a decisão.
- [ ] Ator que não é Administrador é recusado sem registro.

## Dependências

| Depende de | Tipo | Necessidade |
| --- | --- | --- |
| {{SUB-01}} | Interna | Usa a decisão e o ciclo. |
| {{SUB-02}} | Interna | Registra as ações. |
| {{SUB-03}} | Interna | Solicita as ações. |
| D-UC21-04 | Decisão | Define o reconhecimento do Administrador. |
| D-UC21-05 | Decisão | Define as evidências. |

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

**Título:** `[UC21-SUB-05] [C6] Expor os endpoints de decisão e verificar a jornada`  
**Labels:** `usecase:uc21`, `domain:governanca`, `type:feature`, `layer:api`, `layer:integration`, `priority:high`

<!-- SUB-05:START -->
> **Issue Principal:** Relacionada ao Épico {{EPIC}}

## Objetivo

Disponibilizar decidir, pedir informações e cancelar pela API e comprovar a jornada UC20 → UC21 → UC18.

## Descrição

Criar DTOs com `z.strictObject`, controllers e tradução de erros (D-UC21-06). Escrever o teste de ponta a ponta: Disputa aberta (UC20), decisão que solicita a suspensão do perfil (UC18), perfil `SUSPENSO`, ação registrada e repetição sem reaplicação.

## Origem

Passos 1 a 5; FA-01, FA-02; FE-01 a FE-03.

## Escopo

**Inclui:** DTOs, controllers, filtro de erros, ligação dos módulos e testes HTTP.

**Não inclui:** Autenticação.

## Critérios de aceite

- [ ] A decisão responde 200 com a Disputa `RESOLVIDA` e as ações registradas.
- [ ] Corpo fora do formato ou com campos não previstos responde 400 sem iniciar o caso de uso.
- [ ] Ator que não é Administrador responde 403; Disputa inexistente, 404; Disputa em estado inválido, 409.
- [ ] A repetição da decisão não reaplica a suspensão do perfil.
- [ ] O teste cobre a jornada UC20 → UC21 → UC18.

## Dependências

| Depende de | Tipo | Necessidade |
| --- | --- | --- |
| {{SUB-04}} | Interna | Chama os serviços. |
| D-UC21-06 | Decisão | Rotas e códigos. |

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

**Título:** `[UC21-SUB-06] [C6] Documentar o UC21 e o endpoint`  
**Labels:** `usecase:uc21`, `domain:governanca`, `type:docs`, `priority:low`

<!-- SUB-06:START -->
> **Issue Principal:** Relacionada ao Épico {{EPIC}}

## Objetivo

Manter a documentação coerente com o comportamento entregue.

## Descrição

Atualizar o README e o `requests.http` com os exemplos do caso de uso e registrar as limitações: sem autenticação, ciclo provisório, apenas a suspensão de perfil como ação e sem recurso.

## Origem

Rastreabilidade do planejamento.

## Escopo

**Inclui:** README, `requests.http` e registro de limitações.

**Não inclui:** Alteração de código.

## Critérios de aceite

- [ ] Os exemplos do `requests.http` são executáveis e cobrem sucesso e as recusas principais.
- [ ] As limitações e as decisões D-UC21-01 a D-UC21-06 estão registradas.
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
