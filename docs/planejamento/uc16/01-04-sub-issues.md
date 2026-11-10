# 01-04 — Sub-Issues completas

**Caso de uso:** UC16 — Registrar Organização  
**Issue principal:** `[UC16] Registrar Organização`

Cada Sub-Issue abaixo está pronta para publicação. O texto entre os marcadores `START` e `END` é o corpo da issue. `{{EPIC}}` e `{{SUB-XX}}` são substituídos pelos números reais na criação.

---

## SUB-01

**Título:** `[UC16-SUB-01] [C1] Modelar a Organização e o Vínculo Organizacional`  
**Labels:** `usecase:uc16`, `domain:identidade`, `type:feature`, `layer:domain`, `priority:high`

<!-- SUB-01:START -->
> **Issue Principal:** Relacionada ao Épico {{EPIC}}

## Objetivo

Representar a Organização e o vínculo do representante, sem Organização sem representante.

## Descrição

Criar o Agregado `Organizacao` (identidade e dados conforme D-UC16-01), a entidade `VinculoOrganizacional` (Usuário, Organização, papel — D-UC16-04) e a operação de domínio `registrar(usuario, dados)` que devolve Organização e Vínculo do representante juntos.

## Origem

POS-01, POS-02; passo 3; INV-01; RN11; `trabalho3.md` §5.1, §6.1, §10.

## Escopo

**Inclui:** Agregado, entidade, erros de domínio e testes.

**Não inclui:** Persistência (SUB-02); inclusão de outros membros (UC17).

## Critérios de aceite

- [ ] A Organização nasce com identidade própria e dados conforme D-UC16-01.
- [ ] O Vínculo relaciona exatamente um Usuário e uma Organização, com o papel de representante.
- [ ] Vínculo sem Usuário ou sem Organização é recusado.
- [ ] Dados da Organização fora das regras de D-UC16-01 são recusados.
- [ ] Duas Organizações com os mesmos dados são aceitas (nenhuma unicidade assumida, D-UC16-02).
- [ ] O registro devolve a Organização e o vínculo do representante juntos: nunca Organização sem representante.

## Dependências

| Depende de | Tipo | Necessidade |
| --- | --- | --- |
| D-UC16-01 | Decisão | Define os dados da Organização. |
| D-UC16-04 | Decisão | Define o papel do vínculo. |

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

**Título:** `[UC16-SUB-02] [C1] Persistir Organização e Vínculo na mesma transação`  
**Labels:** `usecase:uc16`, `domain:identidade`, `type:feature`, `layer:repository`, `priority:high`

<!-- SUB-02:START -->
> **Issue Principal:** Relacionada ao Épico {{EPIC}}

## Objetivo

Gravar Organização e vínculo do representante como uma só operação.

## Descrição

Criar as entidades ORM, os mappers e os repositórios TypeORM, além da migration com chaves para Usuário e Organização. A operação `registrar` grava os dois na mesma transação (D-UC16-07), com adaptador em memória para os testes de domínio e de aplicação.

## Origem

Passo 3; FE-03; garantia mínima; padrão do UC01 [CÓD].

## Escopo

**Inclui:** Entidades ORM, mappers, repositórios, migration e testes de contrato.

**Não inclui:** Unicidade de Organização (D-UC16-02); revogação de vínculos.

## Critérios de aceite

- [ ] A migration cria as tabelas de Organização e de Vínculo, com chaves para Usuário e Organização, e é reversível.
- [ ] Falha ao gravar o vínculo não deixa a Organização gravada, e vice-versa.
- [ ] Organização e vínculo gravados são recuperados com todos os campos.
- [ ] Falha técnica de armazenamento é traduzida para erro de armazenamento indisponível, sem registro parcial.
- [ ] Os testes de contrato passam nos adaptadores em memória e TypeORM.

## Dependências

| Depende de | Tipo | Necessidade |
| --- | --- | --- |
| {{SUB-01}} | Interna | Persiste o modelo. |
| UC01 | Externa | A tabela de Usuário precisa existir (já implementado). |
| D-UC16-02 | Decisão | Define a unicidade. |
| D-UC16-07 | Decisão | Define a transação. |

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

**Título:** `[UC16-SUB-03] [C1] Implementar o serviço de aplicação Registrar Organização`  
**Labels:** `usecase:uc16`, `domain:identidade`, `type:feature`, `layer:application`, `priority:high`

<!-- SUB-03:START -->
> **Issue Principal:** Relacionada ao Épico {{EPIC}}

## Objetivo

Coordenar o reconhecimento do Usuário e o registro de Organização e vínculo.

## Descrição

Criar `RegistrarOrganizacao`, que reconhece o Usuário pela interface `reconhecimento-de-usuario`, chama `registrar` e persiste o resultado pelo repositório, distinguindo os erros de usuário não reconhecido, dados inválidos e falha técnica.

## Origem

Passos 2 a 4; PRE-01; FE-02, FE-03; RN11.

## Escopo

**Inclui:** Serviço de aplicação, erros de aplicação e testes com dublês.

**Não inclui:** HTTP; inclusão de membros (UC17).

## Critérios de aceite

- [ ] O Usuário cadastrado registra a Organização e recebe a Organização com identificador e dados.
- [ ] Usuário não reconhecido é recusado; nada é registrado.
- [ ] Dados inválidos são recusados como erro de domínio distinto.
- [ ] Falha técnica no registro não deixa Organização sem vínculo.
- [ ] O vínculo de representante criado fica recuperável pelo repositório depois do registro.

## Dependências

| Depende de | Tipo | Necessidade |
| --- | --- | --- |
| {{SUB-02}} | Interna | Usa o repositório transacional. |
| UC01 | Externa | Fornece o reconhecimento de Usuário (já implementado). |

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

**Título:** `[UC16-SUB-04] [C1] Expor o endpoint de registro de Organização`  
**Labels:** `usecase:uc16`, `domain:identidade`, `type:feature`, `layer:api`, `layer:integration`, `priority:high`

<!-- SUB-04:START -->
> **Issue Principal:** Relacionada ao Épico {{EPIC}}

## Objetivo

Disponibilizar o registro pela API com validação de fronteira.

## Descrição

Criar o DTO com `z.strictObject`, o controller e o filtro de erros (D-UC16-06), e o teste de ponta a ponta UC01 → UC16.

## Origem

Passos 1 e 4; FE-01 a FE-03; D1.

## Escopo

**Inclui:** DTO, controller, filtro de erros, ligação no `IdentidadeModule` e testes HTTP.

**Não inclui:** Autenticação.

## Critérios de aceite

- [ ] A requisição válida responde 201 com a Organização.
- [ ] Corpo fora do formato ou com campos não previstos responde 400 sem iniciar o caso de uso.
- [ ] Usuário não reconhecido responde 404 ou 422 conforme D-UC16-06, sem registro.
- [ ] Falha de armazenamento responde 503 sem registro.
- [ ] O teste de ponta a ponta cobre a jornada UC01 → UC16.

## Dependências

| Depende de | Tipo | Necessidade |
| --- | --- | --- |
| {{SUB-03}} | Interna | Chama o serviço. |
| D-UC16-05 | Decisão | Origem do identificador. |
| D-UC16-06 | Decisão | Rota e códigos. |

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

**Título:** `[UC16-SUB-05] [C1] Documentar o UC16 e o endpoint`  
**Labels:** `usecase:uc16`, `domain:identidade`, `type:docs`, `priority:low`

<!-- SUB-05:START -->
> **Issue Principal:** Relacionada ao Épico {{EPIC}}

## Objetivo

Manter a documentação coerente com o comportamento entregue.

## Descrição

Atualizar o README e o `requests.http` com os exemplos do caso de uso e registrar as limitações: sem autenticação (D1), sem verificação de representação, dados da Organização provisórios e sem unicidade.

## Origem

Rastreabilidade do planejamento.

## Escopo

**Inclui:** README, `requests.http` e registro de limitações.

**Não inclui:** Alteração de código.

## Critérios de aceite

- [ ] Os exemplos do `requests.http` são executáveis e cobrem sucesso e as recusas principais.
- [ ] As limitações e as decisões D-UC16-01 a D-UC16-07 estão registradas.
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
