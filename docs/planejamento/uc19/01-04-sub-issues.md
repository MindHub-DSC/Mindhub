# 01-04 — Sub-Issues completas

**Caso de uso:** UC19 — Reativar Perfil de Especialista  
**Issue principal:** `[UC19] Reativar Perfil de Especialista`

Cada Sub-Issue abaixo está pronta para publicação. O texto entre os marcadores `START` e `END` é o corpo da issue. `{{EPIC}}` e `{{SUB-XX}}` são substituídos pelos números reais na criação.

---

## SUB-01

**Título:** `[UC19-SUB-01] [C2] Implementar a transição de reativação no Perfil de Especialista`  
**Labels:** `usecase:uc19`, `domain:oferta`, `domain:governanca`, `type:feature`, `layer:domain`, `layer:repository`, `priority:high`

<!-- SUB-01:START -->
> **Issue Principal:** Relacionada ao Épico {{EPIC}}

## Objetivo

Permitir que C2 devolva o perfil de `SUSPENSO` a `ATIVO` sem alterar identidade nem histórico.

## Descrição

Adicionar ao `PerfilEspecialista` a operação `reativar`, recusando perfil já `ATIVO`, e persistir a situação com controle de versão, reaproveitando o mecanismo do UC18.

## Origem

Passo 3; POS-01, POS-03; FE-02; RN01; `trabalho3.md` §9, §11.

## Escopo

**Inclui:** Operação de domínio, erro de domínio, persistência e testes.

**Não inclui:** Registro administrativo (SUB-02); suspensão (UC18).

## Critérios de aceite

- [ ] Perfil `SUSPENSO` passa a `ATIVO`, mantendo identidade, Usuário e data de criação.
- [ ] Perfil já `ATIVO` é recusado sem alterar o estado (FE-02).
- [ ] Depois da reativação, o perfil é aceito pela regra RN01 (verificação em teste de domínio).
- [ ] Duas reativações simultâneas resultam em um único efeito.

## Dependências

| Depende de | Tipo | Necessidade |
| --- | --- | --- |
| UC18 | Externa | Fornece a situação `SUSPENSO` e o mecanismo de versão da situação. |
| D-UC19-02 | Decisão | Confirma a exigência de justificativa. |

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

**Título:** `[UC19-SUB-02] [C2] Implementar o serviço de aplicação Reativar Perfil e o registro da ação`  
**Labels:** `usecase:uc19`, `domain:oferta`, `domain:governanca`, `type:feature`, `layer:application`, `priority:high`

<!-- SUB-02:START -->
> **Issue Principal:** Relacionada ao Épico {{EPIC}}

## Objetivo

Coordenar verificação do ator, reativação, registro e aviso.

## Descrição

Criar o serviço `ReativarPerfil` que verifica o Administrador, chama `reativar`, registra a ação de tipo `REATIVACAO` no registro de C6 (criado no UC18) e pede o aviso ao especialista, cuja falha não desfaz a reativação.

## Origem

Fluxo principal, passos 2 a 5; FE-01 a FE-03; RN15.

## Escopo

**Inclui:** Serviço de aplicação, novo tipo de ação administrativa, erros e testes com dublês.

**Não inclui:** HTTP; entrega real de notificações.

## Critérios de aceite

- [ ] Administrador reativa perfil `SUSPENSO` com justificativa e recebe o perfil `ATIVO`.
- [ ] A reativação e o registro acontecem juntos: nunca um sem o outro.
- [ ] Ator que não é Administrador é recusado sem alterar nada.
- [ ] Justificativa ausente é recusada; nada é registrado.
- [ ] Perfil já `ATIVO` é recusado sem novo registro.
- [ ] Falha do aviso ao especialista não desfaz a reativação.
- [ ] Perfil inexistente é recusado sem registro.

## Dependências

| Depende de | Tipo | Necessidade |
| --- | --- | --- |
| {{SUB-01}} | Interna | Usa a operação de reativação. |
| UC18 | Externa | Fornece o registro administrativo e a verificação do Administrador. |
| D-UC19-03 | Decisão | Define o aviso. |

Esta issue fornece o que é consumido por {{SUB-03}}, {{SUB-04}}.

## Responsável

@leohsm

## Estado inicial recomendado

`Backlog`

## Evidências esperadas

Pull Request com a implementação e os testes da unidade; saída de `pnpm test`, `pnpm lint` e `pnpm build` sem falhas.
<!-- SUB-02:END -->

---

## SUB-03

**Título:** `[UC19-SUB-03] [C2] Expor o endpoint de reativação e provar o efeito de RN01`  
**Labels:** `usecase:uc19`, `domain:oferta`, `domain:governanca`, `type:feature`, `layer:api`, `layer:integration`, `priority:high`

<!-- SUB-03:START -->
> **Issue Principal:** Relacionada ao Épico {{EPIC}}

## Objetivo

Disponibilizar a reativação pela API e verificar que o perfil volta a operar.

## Descrição

Criar DTO, controller e tradução de erros. Escrever o teste de integração: suspender (UC18), confirmar a recusa de publicar Serviço (UC03), reativar e confirmar a publicação.

## Origem

Passo 1; FE-01, FE-03; RN01.

## Escopo

**Inclui:** DTO, controller, filtro de erros e testes HTTP e de integração.

**Não inclui:** Autenticação real.

## Critérios de aceite

- [ ] Requisição válida responde 200 com o perfil `ATIVO`.
- [ ] Justificativa ausente responde 400/422; ator não Administrador responde 403.
- [ ] Depois da reativação, publicar Serviço volta a ser aceito.
- [ ] Corpo fora do formato responde 400 sem iniciar o caso de uso.

## Dependências

| Depende de | Tipo | Necessidade |
| --- | --- | --- |
| {{SUB-02}} | Interna | Chama o serviço de aplicação. |
| UC03 | Externa | Operação cuja aceitação é verificada. |

Esta issue fornece o que é consumido por {{SUB-05}}.

## Responsável

@leohsm

## Estado inicial recomendado

`Backlog`

## Evidências esperadas

Pull Request com a implementação e os testes da unidade; saída de `pnpm test`, `pnpm lint` e `pnpm build` sem falhas.
<!-- SUB-03:END -->

---

## SUB-04

**Título:** `[UC19-SUB-04] [C6] Garantir a rastreabilidade do ciclo suspensão-reativação`  
**Labels:** `usecase:uc19`, `domain:oferta`, `domain:governanca`, `type:feature`, `layer:domain`, `layer:application`, `priority:high`

<!-- SUB-04:START -->
> **Issue Principal:** Relacionada ao Épico {{EPIC}}

## Objetivo

Comprovar que cada ciclo de suspensão e reativação fica registrado em ordem, sem lacunas.

## Descrição

Criar a consulta de leitura mínima das ações administrativas de um perfil, em ordem cronológica, e o teste que encadeia suspensão, reativação e nova suspensão. Não cria regra de limite (D-UC19-01).

## Origem

POS-02; RN15; `trabalho3.md` §9.

## Escopo

**Inclui:** Consulta de leitura das ações de um perfil e teste de encadeamento.

**Não inclui:** Relatórios, filtros avançados e limite de suspensões.

## Critérios de aceite

- [ ] As ações de um perfil são devolvidas em ordem cronológica com tipo, autor, justificativa e instante.
- [ ] Suspender, reativar e suspender de novo gera três registros distintos.
- [ ] Uma recusa não gera registro.

## Dependências

| Depende de | Tipo | Necessidade |
| --- | --- | --- |
| UC18 | Externa | Fornece o registro administrativo. |
| {{SUB-02}} | Interna | Fornece o segundo tipo de ação. |

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

**Título:** `[UC19-SUB-05] [C2] Documentar o UC19 e o endpoint`  
**Labels:** `usecase:uc19`, `domain:oferta`, `domain:governanca`, `type:docs`, `priority:low`

<!-- SUB-05:START -->
> **Issue Principal:** Relacionada ao Épico {{EPIC}}

## Objetivo

Manter a documentação coerente com o comportamento entregue.

## Descrição

Atualizar o README e o `requests.http` com a reativação e registrar as limitações: sem autenticação real, sem limite de suspensões e reativações (D-UC19-01).

## Origem

Rastreabilidade do planejamento.

## Escopo

**Inclui:** README, `requests.http` e registro de limitações.

**Não inclui:** Alteração de código.

## Critérios de aceite

- [ ] Os exemplos do `requests.http` são executáveis e cobrem sucesso e recusas principais.
- [ ] As limitações e decisões D-UC19-01 a D-UC19-03 estão registradas.
- [ ] O README aponta para este planejamento.

## Dependências

| Depende de | Tipo | Necessidade |
| --- | --- | --- |
| {{SUB-03}} | Interna | Documenta o comportamento final. |
| {{SUB-04}} | Interna | Documenta a consulta de rastreabilidade. |

## Responsável

@leohsm

## Estado inicial recomendado

`Backlog`

## Evidências esperadas

Pull Request com a implementação e os testes da unidade; saída de `pnpm test`, `pnpm lint` e `pnpm build` sem falhas.
<!-- SUB-05:END -->

---
