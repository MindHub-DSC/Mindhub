# 01-04 — Sub-Issues completas

**Caso de uso:** UC17 — Vincular Membro à Organização  
**Issue principal:** `[UC17] Vincular Membro à Organização`

Cada Sub-Issue abaixo está pronta para publicação. O texto entre os marcadores `START` e `END` é o corpo da issue. `{{EPIC}}` e `{{SUB-XX}}` são substituídos pelos números reais na criação.

---

## SUB-01

**Título:** `[UC17-SUB-01] [C1] Estender o Vínculo Organizacional com papéis de membro`  
**Labels:** `usecase:uc17`, `domain:identidade`, `type:feature`, `layer:domain`, `priority:high`

<!-- SUB-01:START -->
> **Issue Principal:** Relacionada ao Épico {{EPIC}}

## Objetivo

Permitir registrar vínculos de membros com papel, mantendo a invariante do Vínculo.

## Descrição

Estender o `VinculoOrganizacional` do UC16 com o objeto de valor `PapelDoVinculo` (conjunto provisório, D-UC17-01) e a operação de domínio `vincularMembro(organizacao, usuario, papel)`. A duplicidade de vínculo do mesmo Usuário na mesma Organização segue D-UC17-03.

## Origem

Passo 4; POS-01; INV-01; `trabalho3.md` §6.1, §8, §10.

## Escopo

**Inclui:** Extensão do domínio, objeto de valor, erros de domínio e testes.

**Não inclui:** Verificação do Representante (SUB-02); revogação.

## Critérios de aceite

- [ ] O Vínculo de membro relaciona exatamente um Usuário e uma Organização, com um papel válido.
- [ ] Papel fora do conjunto provisório de D-UC17-01 é recusado.
- [ ] O vínculo duplicado do mesmo Usuário e papel segue a decisão D-UC17-03.
- [ ] Um Usuário pode ter vínculos com Organizações diferentes e uma Organização pode ter vários vínculos.

## Dependências

| Depende de | Tipo | Necessidade |
| --- | --- | --- |
| UC16 | Externa | Fornece o Vínculo e a Organização. |
| D-UC17-01 | Decisão | Define os papéis. |

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

**Título:** `[UC17-SUB-02] [C1] Verificar o vínculo do Representante no instante da operação`  
**Labels:** `usecase:uc17`, `domain:identidade`, `type:feature`, `layer:repository`, `priority:high`

<!-- SUB-02:START -->
> **Issue Principal:** Relacionada ao Épico {{EPIC}}

## Objetivo

Garantir que o vínculo do Representante seja lido e o novo vínculo registrado na mesma unidade de consistência.

## Descrição

Estender o repositório de vínculos com a leitura do vínculo compatível do Representante e o registro do novo vínculo na mesma operação transacional, com restrições de unicidade conforme D-UC17-03. Escrever o teste que simula a revogação do vínculo do Representante entre a leitura e o registro.

## Origem

Passo 2 e 4; FE-03; RN11; `trabalho4.md` TC-C1-01.

## Escopo

**Inclui:** Extensão da porta, adaptadores, migration (se houver restrição) e testes de contrato e de concorrência.

**Não inclui:** Revogação como Caso de Uso.

## Critérios de aceite

- [ ] O repositório indica se o Representante tem vínculo compatível com a Organização.
- [ ] A leitura do vínculo do Representante e o registro do novo vínculo ocorrem na mesma operação transacional.
- [ ] Vínculo revogado entre a leitura e o registro (simulado) faz a operação posterior ser recusada.
- [ ] As restrições de D-UC17-03 são aplicadas no armazenamento.
- [ ] Os testes de contrato passam nos adaptadores em memória e TypeORM.

## Dependências

| Depende de | Tipo | Necessidade |
| --- | --- | --- |
| {{SUB-01}} | Interna | Persiste o Vínculo de membro. |
| D-UC17-03 | Decisão | Define a duplicidade. |

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

**Título:** `[UC17-SUB-03] [C1] Implementar o serviço de aplicação Vincular Membro`  
**Labels:** `usecase:uc17`, `domain:identidade`, `type:feature`, `layer:application`, `priority:high`

<!-- SUB-03:START -->
> **Issue Principal:** Relacionada ao Épico {{EPIC}}

## Objetivo

Coordenar a verificação do Representante, o reconhecimento do membro, o registro e o aviso.

## Descrição

Criar `VincularMembro`: verifica o vínculo do Representante (SUB-02), reconhece o Usuário a vincular pela interface existente, registra o vínculo e avisa o membro pela porta de notificações (D-UC17-05), com falha tolerada. Distingue os erros: Representante sem vínculo, Usuário não reconhecido e Organização inexistente.

## Origem

Passos 2 a 5; PRE-01, PRE-02; FE-01 a FE-04; RN11.

## Escopo

**Inclui:** Serviço de aplicação, porta de notificação, erros de aplicação e testes com dublês.

**Não inclui:** HTTP; entrega real de notificações; aceite do vínculo (D-UC17-02).

## Critérios de aceite

- [ ] O Representante com vínculo compatível vincula o Usuário com um papel e recebe o vínculo.
- [ ] Representante sem vínculo compatível é recusado; nada é registrado.
- [ ] Usuário a vincular não reconhecido é recusado; nada é registrado.
- [ ] Falha do aviso ao membro não invalida o vínculo já registrado.
- [ ] Organização inexistente é recusada sem registro.
- [ ] Vínculo do Representante revogado durante a operação (simulado) é recusado.

## Dependências

| Depende de | Tipo | Necessidade |
| --- | --- | --- |
| {{SUB-02}} | Interna | Usa a verificação e o registro. |
| UC01 | Externa | Fornece o reconhecimento de Usuário (já implementado). |
| D-UC17-02 | Decisão | Define se há aceite. |
| D-UC17-05 | Decisão | Define o aviso. |

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

**Título:** `[UC17-SUB-04] [C1] Expor o endpoint de vínculo e verificar a jornada`  
**Labels:** `usecase:uc17`, `domain:identidade`, `type:feature`, `layer:api`, `layer:integration`, `priority:high`

<!-- SUB-04:START -->
> **Issue Principal:** Relacionada ao Épico {{EPIC}}

## Objetivo

Disponibilizar o vínculo pela API e comprovar a jornada UC16 → UC17.

## Descrição

Criar o DTO com `z.strictObject`, o controller e o filtro de erros (D-UC17-06), e o teste de ponta a ponta: Organização registrada (UC16), Usuário cadastrado (UC01), vínculo válido e recusas.

## Origem

Passos 1 e 5; FE-01 a FE-03; D1.

## Escopo

**Inclui:** DTO, controller, filtro de erros e testes HTTP.

**Não inclui:** Autenticação.

## Critérios de aceite

- [ ] A requisição válida responde 201 com o vínculo.
- [ ] Corpo fora do formato ou com campos não previstos responde 400 sem iniciar o caso de uso.
- [ ] Representante sem vínculo responde 403; Usuário ou Organização inexistente responde 404 ou 422 conforme D-UC17-06.
- [ ] O teste cobre a jornada UC01 → UC16 → UC17.

## Dependências

| Depende de | Tipo | Necessidade |
| --- | --- | --- |
| {{SUB-03}} | Interna | Chama o serviço. |
| D-UC17-06 | Decisão | Rota e códigos. |
| D-UC17-07 | Decisão | Origem do identificador. |

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

**Título:** `[UC17-SUB-05] [C1] Documentar o UC17 e o endpoint`  
**Labels:** `usecase:uc17`, `domain:identidade`, `type:docs`, `priority:low`

<!-- SUB-05:START -->
> **Issue Principal:** Relacionada ao Épico {{EPIC}}

## Objetivo

Manter a documentação coerente com o comportamento entregue.

## Descrição

Atualizar o README e o `requests.http` com os exemplos do caso de uso e registrar as limitações: sem autenticação (D1), sem revogação de vínculo, sem aceite do membro e papéis provisórios.

## Origem

Rastreabilidade do planejamento.

## Escopo

**Inclui:** README, `requests.http` e registro de limitações.

**Não inclui:** Alteração de código.

## Critérios de aceite

- [ ] Os exemplos do `requests.http` são executáveis e cobrem sucesso e as recusas principais.
- [ ] As limitações e as decisões D-UC17-01 a D-UC17-07 estão registradas.
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
