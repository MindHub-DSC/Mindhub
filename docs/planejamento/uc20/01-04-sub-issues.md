# 01-04 — Sub-Issues completas

**Caso de uso:** UC20 — Abrir Disputa  
**Issue principal:** `[UC20] Abrir Disputa`

Cada Sub-Issue abaixo está pronta para publicação. O texto entre os marcadores `START` e `END` é o corpo da issue. `{{EPIC}}` e `{{SUB-XX}}` são substituídos pelos números reais na criação.

---

## SUB-01

**Título:** `[UC20-SUB-01] [C6] Modelar a Disputa e seu ciclo provisório`  
**Labels:** `usecase:uc20`, `domain:governanca`, `type:feature`, `layer:domain`, `layer:repository`, `priority:high`

<!-- SUB-01:START -->
> **Issue Principal:** Relacionada ao Épico {{EPIC}}

## Objetivo

Representar a Disputa `Aberta` com questionamento e evidências preservados.

## Descrição

Criar o Agregado `Disputa` (identidade, Contratação, Sessão e Pagamento opcionais, autor, papel do autor, questionamento, evidências, instante, situação `ABERTA`) e a operação `abrir`, deixando os demais estados do ciclo (D-UC20-03) apenas declarados. Definir a porta `DisputasRepositorio` e o adaptador em memória, com várias Disputas por Contratação (D-UC20-05).

## Origem

POS-01, POS-02; passo 3; RN15; INV-01; `trabalho3.md` §5.1, §8, §11.5.

## Escopo

**Inclui:** Agregado, erros de domínio, porta, adaptador em memória e testes.

**Não inclui:** Decisão (UC21); estados intermediários.

## Critérios de aceite

- [ ] A Disputa nasce `ABERTA` com Contratação, autor, papel do autor, questionamento, evidências e instante.
- [ ] Sessão e Pagamento são opcionais e, quando informados, ficam associados à Disputa.
- [ ] Questionamento vazio é recusado.
- [ ] O autor e o instante de abertura ficam registrados e não podem ser alterados (RN15).
- [ ] Mais de uma Disputa para a mesma Contratação é aceita (D-UC20-05).
- [ ] O adaptador em memória devolve cópias defensivas.

## Dependências

| Depende de | Tipo | Necessidade |
| --- | --- | --- |
| D-UC20-03 | Decisão | Define o ciclo provisório. |
| D-UC20-04 | Decisão | Define as evidências. |
| D-UC20-05 | Decisão | Define a cardinalidade. |

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

**Título:** `[UC20-SUB-02] [C6] Definir as portas de verificação das partes e do pertencimento`  
**Labels:** `usecase:uc20`, `domain:governanca`, `type:feature`, `layer:adapter`, `priority:high`

<!-- SUB-02:START -->
> **Issue Principal:** Relacionada ao Épico {{EPIC}}

## Objetivo

Permitir que C6 verifique, por visões públicas, as partes da Contratação e o pertencimento de Sessão e Pagamento.

## Descrição

Criar as portas `VisaoDaContratacao`, `VisaoDaSessao`, `VisaoDoPagamento` e `VisaoDeVinculos` (UC15-SUB-01) em C6, com adaptadores simulados nos testes e a ligação aos contextos reais conforme eles forem entregues. C6 não importa Agregados de outros contextos.

## Origem

Passo 2; FE-01 a FE-03; RN11; `trabalho4.md` §3.6, TC-C6-02.

## Escopo

**Inclui:** Portas, adaptadores simulados, contratos e testes.

**Não inclui:** Alterar Reserva, Pagamento ou Contratação.

## Critérios de aceite

- [ ] A visão da Contratação informa cliente, especialista e Organização (quando houver).
- [ ] A visão da Sessão e do Pagamento informa a Contratação a que pertencem.
- [ ] A visão de vínculos informa se o Representante tem vínculo compatível.
- [ ] Nenhuma porta oferece operação que altere os outros contextos.
- [ ] Os adaptadores simulados respeitam os contratos das portas.

## Dependências

| Depende de | Tipo | Necessidade |
| --- | --- | --- |
| UC07 | Externa | Fornece a Contratação. |
| UC13 | Externa | Fornece a Sessão. |
| UC10 | Externa | Fornece o Pagamento. |
| UC15 | Externa | Fornece a visão de vínculos (UC15-SUB-01). |

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

**Título:** `[UC20-SUB-03] [C6] Implementar o serviço de aplicação Abrir Disputa`  
**Labels:** `usecase:uc20`, `domain:governanca`, `type:feature`, `layer:application`, `priority:high`

<!-- SUB-03:START -->
> **Issue Principal:** Relacionada ao Épico {{EPIC}}

## Objetivo

Coordenar a verificação das partes, o registro e o aviso sem alterar os outros contextos.

## Descrição

Criar `AbrirDisputa`: verifica que o ator é parte da Contratação (ou Representante com vínculo), verifica que a Sessão ou o Pagamento pertencem à Contratação, registra a Disputa e avisa a outra parte e a administração (D-UC20-06), com falha tolerada. Não altera nem bloqueia nenhum outro contexto.

## Origem

Passos 2 a 4; FE-01 a FE-03; RN11; TC-C6-02.

## Escopo

**Inclui:** Serviço de aplicação, porta de notificação, erros de aplicação e testes com dublês.

**Não inclui:** Decisão da Disputa; HTTP.

## Critérios de aceite

- [ ] Uma parte da Contratação abre a Disputa e recebe a Disputa `ABERTA` com o questionamento preservado.
- [ ] Ator que não é parte da Contratação é recusado sem registro.
- [ ] Sessão ou Pagamento que não pertence à Contratação é recusado sem registro.
- [ ] Representante sem vínculo compatível é recusado sem registro.
- [ ] Abrir a Disputa não altera nem bloqueia Reserva, Pagamento ou Contratação (verificado com dublês que falham se chamados).
- [ ] A falha do aviso não invalida a Disputa registrada.

## Dependências

| Depende de | Tipo | Necessidade |
| --- | --- | --- |
| {{SUB-01}} | Interna | Usa o Agregado e o repositório. |
| {{SUB-02}} | Interna | Usa as visões. |
| D-UC20-06 | Decisão | Define o aviso. |

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

**Título:** `[UC20-SUB-04] [C6] Expor o endpoint de abertura de Disputa e verificar a jornada`  
**Labels:** `usecase:uc20`, `domain:governanca`, `type:feature`, `layer:api`, `layer:integration`, `priority:high`

<!-- SUB-04:START -->
> **Issue Principal:** Relacionada ao Épico {{EPIC}}

## Objetivo

Disponibilizar a abertura pela API e comprovar a jornada com Contratação real.

## Descrição

Criar o DTO com `z.strictObject`, o controller e o filtro de erros (D-UC20-07) e o teste de ponta a ponta com a Contratação do UC07 ou do UC08, a Sessão do UC13 e o Pagamento do UC10.

## Origem

Passo 1; FE-01 a FE-03; D1.

## Escopo

**Inclui:** DTO, controller, filtro de erros, ligação dos módulos e testes HTTP.

**Não inclui:** Autenticação.

## Critérios de aceite

- [ ] A requisição válida responde 201 com a Disputa `ABERTA`.
- [ ] Corpo fora do formato ou com campos não previstos responde 400 sem iniciar o caso de uso.
- [ ] Ator que não é parte e Representante sem vínculo respondem 403.
- [ ] Sessão ou Pagamento que não pertence à Contratação responde 422; Contratação inexistente, 404.
- [ ] O teste de ponta a ponta não altera nenhuma Reserva, Pagamento ou Contratação.

## Dependências

| Depende de | Tipo | Necessidade |
| --- | --- | --- |
| {{SUB-03}} | Interna | Chama o serviço. |
| D-UC20-07 | Decisão | Rota e códigos. |
| D-UC20-08 | Decisão | Origem do identificador. |

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

**Título:** `[UC20-SUB-05] [C6] Documentar o UC20 e o endpoint`  
**Labels:** `usecase:uc20`, `domain:governanca`, `type:docs`, `priority:low`

<!-- SUB-05:START -->
> **Issue Principal:** Relacionada ao Épico {{EPIC}}

## Objetivo

Manter a documentação coerente com o comportamento entregue.

## Descrição

Atualizar o README e o `requests.http` com os exemplos do caso de uso e registrar as limitações: sem autenticação (D1), sem prazo para abrir, ciclo da Disputa provisório e sem efeito sobre outros contextos.

## Origem

Rastreabilidade do planejamento.

## Escopo

**Inclui:** README, `requests.http` e registro de limitações.

**Não inclui:** Alteração de código.

## Critérios de aceite

- [ ] Os exemplos do `requests.http` são executáveis e cobrem sucesso e as recusas principais.
- [ ] As limitações e as decisões D-UC20-01 a D-UC20-08 estão registradas.
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
