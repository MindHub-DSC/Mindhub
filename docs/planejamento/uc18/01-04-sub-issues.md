# 01-04 — Sub-Issues completas

**Caso de uso:** UC18 — Suspender Perfil de Especialista  
**Issue principal:** `[UC18] Suspender Perfil de Especialista`

Cada Sub-Issue abaixo está pronta para publicação. O texto entre os marcadores `START` e `END` é o corpo da issue. `{{EPIC}}` e `{{SUB-XX}}` são substituídos pelos números reais na criação.

---

## SUB-01

**Título:** `[UC18-SUB-01] [C2] Implementar a transição de suspensão no Perfil de Especialista`  
**Labels:** `usecase:uc18`, `domain:oferta`, `domain:governanca`, `type:feature`, `layer:domain`, `layer:repository`, `priority:high`

<!-- SUB-01:START -->
> **Issue Principal:** Relacionada ao Épico {{EPIC}}

## Objetivo

Permitir que C2 mude o perfil de `ATIVO` para `SUSPENSO` preservando identidade e histórico.

## Descrição

Adicionar ao `PerfilEspecialista` a operação `suspender`, recusando perfil já `SUSPENSO`. Persistir a nova situação no repositório (em memória e TypeORM) com controle de versão para a concorrência com publicação e solicitação. A situação `SUSPENSO` já existe no código [CÓD `situacao-perfil.ts`].

## Origem

Passo 3; POS-01, POS-03, POS-04; FE-02, FE-04; RN01; `trabalho3.md` §9, §11.

## Escopo

**Inclui:** Operação de domínio, erro de domínio, persistência da situação, controle de versão e testes.

**Não inclui:** Registro administrativo (SUB-02); reativação (UC19).

## Critérios de aceite

- [ ] Perfil `ATIVO` passa a `SUSPENSO`, mantendo identidade, Usuário e data de criação.
- [ ] Perfil já `SUSPENSO` é recusado sem alterar o estado (FE-02).
- [ ] Perfil suspenso é recusado por RN01 ao tentar publicar ou receber solicitação (verificação em teste de domínio).
- [ ] Identidade e histórico de dados anteriores permanecem inalterados.
- [ ] Duas suspensões simultâneas resultam em um único efeito.

## Dependências

| Depende de | Tipo | Necessidade |
| --- | --- | --- |
| UC02 | Externa | Fornece o Perfil de Especialista e a situação (já implementado). |

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

**Título:** `[UC18-SUB-02] [C6] Registrar a ação administrativa em C6`  
**Labels:** `usecase:uc18`, `domain:governanca`, `type:feature`, `layer:domain`, `layer:repository`, `priority:high`

<!-- SUB-02:START -->
> **Issue Principal:** Relacionada ao Épico {{EPIC}}

## Objetivo

Guardar autor, justificativa e instante de cada ação administrativa, de forma reutilizável por UC19 e UC21.

## Descrição

Criar em `governanca` o registro `AcaoAdministrativa` (tipo, perfil alvo, autor, justificativa, instante, referência opcional a uma decisão) e sua porta e adaptadores (memória e TypeORM com migration). O registro é imutável. O tipo `SUSPENSAO` é o primeiro tipo; `REATIVACAO` é incluído no UC19.

## Origem

Passo 4; POS-02; FE-01, FE-05; RN15; `trabalho4.md` §3.6.

## Escopo

**Inclui:** Entidade de registro, porta, adaptadores, migration e testes de contrato.

**Não inclui:** Decisão de disputa (UC21); consulta e relatório de ações.

## Critérios de aceite

- [ ] O registro guarda autor, justificativa, instante e perfil alvo e não pode ser alterado depois de gravado.
- [ ] Justificativa vazia é recusada pelo registro (RN15).
- [ ] O registro aceita referência opcional a uma decisão de disputa (FE-05).
- [ ] Os testes de contrato passam nos adaptadores em memória e TypeORM.
- [ ] Falha técnica de armazenamento é traduzida para erro de armazenamento indisponível.

## Dependências

| Depende de | Tipo | Necessidade |
| --- | --- | --- |
| D-UC18-02 | Decisão | Define a relação de consistência com a suspensão. |

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

**Título:** `[UC18-SUB-03] [C2] Implementar o serviço de aplicação Suspender Perfil`  
**Labels:** `usecase:uc18`, `domain:oferta`, `domain:governanca`, `type:feature`, `layer:application`, `priority:high`

<!-- SUB-03:START -->
> **Issue Principal:** Relacionada ao Épico {{EPIC}}

## Objetivo

Coordenar verificação do ator, suspensão, registro e aviso.

## Descrição

Criar o serviço `SuspenderPerfil` que verifica se o ator é Administrador (D-UC18-01), chama `suspender` no perfil, registra a ação em C6 e pede o aviso ao especialista pela porta de notificações (D-UC18-05), cuja falha não desfaz a suspensão. Distinguir os erros: ator não autorizado, perfil inexistente, justificativa ausente, perfil já suspenso.

## Origem

Fluxo principal, passos 2 a 5; FE-01 a FE-03; RN15.

## Escopo

**Inclui:** Serviço de aplicação, porta de notificação, erros de aplicação e testes com dublês.

**Não inclui:** HTTP; entrega real de notificações.

## Critérios de aceite

- [ ] Administrador suspende perfil `ATIVO` com justificativa e recebe o perfil `SUSPENSO`.
- [ ] A suspensão e o registro administrativo acontecem juntos conforme D-UC18-02: nunca um sem o outro.
- [ ] Ator que não é Administrador é recusado sem alterar nada (FE-03).
- [ ] Perfil já `SUSPENSO` é recusado sem novo registro (FE-02).
- [ ] Falha do aviso ao especialista não desfaz a suspensão nem o registro.
- [ ] Perfil inexistente é recusado sem registro.
- [ ] Justificativa ausente é recusada; nada é registrado.

## Dependências

| Depende de | Tipo | Necessidade |
| --- | --- | --- |
| {{SUB-01}} | Interna | Usa a operação de suspensão. |
| {{SUB-02}} | Interna | Usa o registro administrativo. |
| D-UC18-01 | Decisão | Define como reconhecer o Administrador. |
| D-UC18-05 | Decisão | Define o aviso. |

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

**Título:** `[UC18-SUB-04] [C2] Expor o endpoint de suspensão e provar a concorrência com publicação`  
**Labels:** `usecase:uc18`, `domain:oferta`, `domain:governanca`, `type:feature`, `layer:api`, `layer:integration`, `priority:high`

<!-- SUB-04:START -->
> **Issue Principal:** Relacionada ao Épico {{EPIC}}

## Objetivo

Disponibilizar a suspensão pela API e verificar o efeito de RN01 nos demais casos de uso.

## Descrição

Criar o DTO (identificador do perfil e justificativa), o controller administrativo e a tradução de erros. Escrever o teste de integração: perfil suspenso recusa publicar Serviço (UC03) e receber Solicitação (UC05), e a concorrência entre suspensão e essas operações respeita a ordem (TC-C2-01).

## Origem

Passo 1; FE-01, FE-03, FE-04; RN01; TC-C2-01.

## Escopo

**Inclui:** DTO, controller, filtro de erros, ligação nos módulos e testes HTTP e de integração.

**Não inclui:** Autenticação real; interface administrativa.

## Critérios de aceite

- [ ] Requisição válida responde 200 com o perfil `SUSPENSO`.
- [ ] Justificativa ausente responde 400/422 sem registrar nada; ator não Administrador responde 403.
- [ ] Depois da suspensão, publicar Serviço e enviar Solicitação são recusados; as operações anteriores permanecem.
- [ ] Corpo fora do formato responde 400 sem iniciar o caso de uso.

## Dependências

| Depende de | Tipo | Necessidade |
| --- | --- | --- |
| {{SUB-03}} | Interna | Chama o serviço de aplicação. |
| UC03 | Externa | Operação cuja recusa é verificada. |
| UC05 | Externa | Operação cuja recusa é verificada. |

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

**Título:** `[UC18-SUB-05] [C2] Documentar o UC18 e o endpoint`  
**Labels:** `usecase:uc18`, `domain:oferta`, `domain:governanca`, `type:docs`, `priority:low`

<!-- SUB-05:START -->
> **Issue Principal:** Relacionada ao Épico {{EPIC}}

## Objetivo

Manter a documentação coerente com o comportamento entregue.

## Descrição

Atualizar o README e o `requests.http` com a suspensão e registrar as limitações: sem autenticação real, efeito sobre propostas já enviadas e reservas futuras indefinido, visibilidade dos Serviços indefinida.

## Origem

Rastreabilidade do planejamento.

## Escopo

**Inclui:** README, `requests.http` e registro de limitações.

**Não inclui:** Alteração de código.

## Critérios de aceite

- [ ] Os exemplos do `requests.http` são executáveis e cobrem sucesso e recusas principais.
- [ ] As limitações e decisões D-UC18-01 a D-UC18-05 estão registradas.
- [ ] O README aponta para este planejamento.

## Dependências

| Depende de | Tipo | Necessidade |
| --- | --- | --- |
| {{SUB-04}} | Interna | Documenta o comportamento final. |

## Responsável

@leohsm

## Estado inicial recomendado

`Backlog`

## Evidências esperadas

Pull Request com a implementação e os testes da unidade; saída de `pnpm test`, `pnpm lint` e `pnpm build` sem falhas.
<!-- SUB-05:END -->

---
