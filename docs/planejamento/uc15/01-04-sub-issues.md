# 01-04 — Sub-Issues completas

**Caso de uso:** UC15 — Indicar Participantes da Sessão  
**Issue principal:** `[UC15] Indicar Participantes da Sessão`

Cada Sub-Issue abaixo está pronta para publicação. O texto entre os marcadores `START` e `END` é o corpo da issue. `{{EPIC}}` e `{{SUB-XX}}` são substituídos pelos números reais na criação.

---

## SUB-01

**Título:** `[UC15-SUB-01] [C1] Expor a visão pública de vínculos organizacionais em C1`  
**Labels:** `usecase:uc15`, `domain:identidade`, `type:feature`, `layer:application`, `priority:high`

<!-- SUB-01:START -->
> **Issue Principal:** Relacionada ao Épico {{EPIC}}

## Objetivo

Permitir que C4 verifique representante e membros sem interpretar o Agregado de Organização.

## Descrição

Criar a interface pública de C1 `VisaoDeVinculos` com `representanteTemVinculoCompativel(usuario, organizacao)` e `membroEstaVinculado(usuario, organizacao)`, avaliados no instante da chamada (TC-C1-01).

## Origem

Passos 2 e 3; PRE-02; FE-01, FE-02; RN11; `trabalho4.md` TC-C1-01, TC-C1-02.

## Escopo

**Inclui:** Interface pública, implementação em C1 e testes.

**Não inclui:** Cadastro e revogação de vínculos (UC16, UC17).

## Critérios de aceite

- [ ] Membro vinculado à Organização é reconhecido como vinculado.
- [ ] Representante com vínculo compatível é reconhecido; Usuário sem vínculo, não.
- [ ] A verificação reflete o estado no instante da chamada, inclusive vínculo revogado depois.
- [ ] C4 não conhece a estrutura interna do Vínculo.

## Dependências

| Depende de | Tipo | Necessidade |
| --- | --- | --- |
| UC17 | Externa | Fornece os Vínculos Organizacionais. |

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

**Título:** `[UC15-SUB-02] [C4] Modelar a indicação de Participações na Sessão`  
**Labels:** `usecase:uc15`, `domain:agenda`, `domain:identidade`, `type:feature`, `layer:domain`, `layer:repository`, `priority:high`

<!-- SUB-02:START -->
> **Issue Principal:** Relacionada ao Épico {{EPIC}}

## Objetivo

Permitir registrar Participações de membros diferentes do contratante, em Sessão em aberto.

## Descrição

Estender a `Sessao` e a `Participacao` (UC13) com a operação `indicarParticipantes(membros, papel)` que recusa Sessão `CONCLUIDA` ou `CANCELADA`, não duplica o mesmo membro e mantém Sessão — Participação `1 : 1..*` conforme D-UC15-01 a D-UC15-03.

## Origem

POS-01, POS-02; FE-04; RN12; `trabalho3.md` §6.3, §8.

## Escopo

**Inclui:** Operação de domínio, persistência em memória e testes.

**Não inclui:** Verificação de vínculos (SUB-01).

## Critérios de aceite

- [ ] A indicação registra as Participações dos membros com seu papel.
- [ ] Participante diferente do contratante é aceito (RN12).
- [ ] Sessão `CONCLUIDA` ou `CANCELADA` recusa a indicação.
- [ ] O mesmo membro não é registrado duas vezes na mesma Sessão.

## Dependências

| Depende de | Tipo | Necessidade |
| --- | --- | --- |
| UC13 | Externa | Fornece a Sessão e a Participação. |
| D-UC15-01 | Decisão | Limite de participantes. |
| D-UC15-02 | Decisão | Papéis. |
| D-UC15-03 | Decisão | Escopo da indicação. |

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

**Título:** `[UC15-SUB-03] [C4] Implementar o serviço de aplicação Indicar Participantes`  
**Labels:** `usecase:uc15`, `domain:agenda`, `domain:identidade`, `type:feature`, `layer:application`, `priority:high`

<!-- SUB-03:START -->
> **Issue Principal:** Relacionada ao Épico {{EPIC}}

## Objetivo

Coordenar a verificação de vínculos em C1, o registro e o aviso.

## Descrição

Criar `IndicarParticipantes`: verifica o vínculo do Representante e de cada membro em C1 (SUB-01), recusa a indicação inteira se algum membro não for vinculado (D-UC15-04), registra as Participações e avisa os participantes (D-UC15-05).

## Origem

Passos 2 a 5; FE-01 a FE-04; RN11, RN12.

## Escopo

**Inclui:** Serviço de aplicação, erros de aplicação e testes com dublês.

**Não inclui:** HTTP; limite de participantes.

## Critérios de aceite

- [ ] O Representante com vínculo compatível indica membros vinculados e a Sessão passa a ter as Participações.
- [ ] Representante sem vínculo compatível é recusado sem registro.
- [ ] Membro sem vínculo recusa a indicação, sem registro parcial.
- [ ] A revogação posterior do vínculo de um membro não altera a Participação já registrada.
- [ ] Sessão `CONCLUIDA` ou `CANCELADA` é recusada.
- [ ] Os participantes são avisados depois do registro; falha do aviso não o desfaz.

## Dependências

| Depende de | Tipo | Necessidade |
| --- | --- | --- |
| {{SUB-01}} | Interna | Usa a visão de vínculos. |
| {{SUB-02}} | Interna | Usa a operação de domínio. |
| D-UC15-04 | Decisão | Política da lista. |
| D-UC15-05 | Decisão | Aviso. |

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

**Título:** `[UC15-SUB-04] [C4] Expor o endpoint de indicação e verificar a jornada`  
**Labels:** `usecase:uc15`, `domain:agenda`, `domain:identidade`, `type:feature`, `layer:api`, `layer:integration`, `priority:high`

<!-- SUB-04:START -->
> **Issue Principal:** Relacionada ao Épico {{EPIC}}

## Objetivo

Disponibilizar a indicação pela API e comprovar a jornada organizacional.

## Descrição

Criar DTO com `z.strictObject`, controller e tradução de erros (D-UC15-06). Escrever o teste de ponta a ponta: Organização e vínculos (UC16 e UC17), Sessão criada (UC13) e indicação válida e inválida.

## Origem

Passo 1; FE-01 a FE-04.

## Escopo

**Inclui:** DTO, controller, filtro de erros e testes HTTP.

**Não inclui:** Autenticação.

## Critérios de aceite

- [ ] A indicação válida responde 200 com as Participações registradas.
- [ ] Corpo fora do formato ou com campos não previstos responde 400 sem iniciar o caso de uso.
- [ ] Representante sem vínculo e membro sem vínculo respondem 403 e 422, respectivamente.
- [ ] Sessão inexistente responde 404; Sessão encerrada, 409.
- [ ] O teste cobre a jornada UC16 → UC17 → UC13 → UC15.

## Dependências

| Depende de | Tipo | Necessidade |
| --- | --- | --- |
| {{SUB-03}} | Interna | Chama o serviço. |
| D-UC15-06 | Decisão | Rota e códigos. |

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

**Título:** `[UC15-SUB-05] [C4] Documentar o UC15 e o endpoint`  
**Labels:** `usecase:uc15`, `domain:agenda`, `domain:identidade`, `type:docs`, `priority:low`

<!-- SUB-05:START -->
> **Issue Principal:** Relacionada ao Épico {{EPIC}}

## Objetivo

Manter a documentação coerente com o comportamento entregue.

## Descrição

Atualizar o README e o `requests.http` com os exemplos do caso de uso e registrar as limitações: sem autenticação, sem limite de participantes, papéis e escopo (Sessão ou Contratação) provisórios.

## Origem

Rastreabilidade do planejamento.

## Escopo

**Inclui:** README, `requests.http` e registro de limitações.

**Não inclui:** Alteração de código.

## Critérios de aceite

- [ ] Os exemplos do `requests.http` são executáveis e cobrem sucesso e as recusas principais.
- [ ] As limitações e as decisões D-UC15-01 a D-UC15-06 estão registradas.
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
