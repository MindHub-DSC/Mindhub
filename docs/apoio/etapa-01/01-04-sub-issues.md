# 01-04 — Sub-Issues completas

**Caso de uso:** UC02 — Cadastrar Perfil de Especialista
**Issue principal:** `[UC02] Cadastrar Perfil de Especialista`

Cada Sub-Issue abaixo está pronta para publicação. O texto entre os marcadores `START` e `END` é o corpo da issue; `{{EPIC}}` é substituído pelo número real do épico na criação.

---

## SUB-01

**Título:** `[SUB-01] Expor interface pública de reconhecimento de usuário (C1)`
**Labels:** `usecase:uc02`, `domain:identidade`, `type:feature`, `layer:application`, `priority:high`

<!-- SUB-01:START -->
> **Issue Principal:** Relacionada ao Épico {{EPIC}}

## Objetivo

Permitir que outros contextos verifiquem se uma referência de usuário existe, sem acessar o modelo completo de Usuário de C1.

## Descrição

Definir em C1 uma interface pública com uma única operação de reconhecimento. Proposta de assinatura: `reconhecer(usuarioId: string): Promise<boolean>`. O retorno assíncrono antecipa a futura persistência durável sem mudar o contrato. Implementar a interface sobre o armazenamento atual de usuários e disponibilizá-la por um token de injeção do NestJS. `UsuariosService` e o tipo `Usuario` continuam internos a C1.

## Origem

- Fluxo principal, passo 3; exceção FE-02
- RN-UC02-04 — reconhecimento por interface pública restrita
- `trabalho4.md` §12.4 (ADR-04) e §13.4.2

## Escopo

**Inclui:** interface e token; implementação em C1; organização de Usuários como módulo de C1 que exporta somente a interface; testes unitários; regressão do UC01.

**Não inclui:** autenticação; vínculos organizacionais; consulta de dados cadastrais.

## Critérios de aceite

- [ ] Existe uma interface pública de C1 que recebe uma referência de usuário e informa apenas se ela é reconhecida.
- [ ] A interface não expõe nome, email nem o tipo `Usuario`.
- [ ] Para um usuário cadastrado, a operação retorna reconhecido; para um UUID inexistente, retorna não reconhecido.
- [ ] O módulo de C1 exporta o token da interface, e não a classe `UsuariosService`.
- [ ] Os testes de `test/usuarios.spec.ts` continuam passando.

## Dependências

| Depende de | Tipo | Necessidade |
| --- | --- | --- |
| — | — | Nenhuma dependência de entrada |

Esta issue fornece o contrato consumido pela SUB-04.

## Responsável

@leohsm

## Estado inicial recomendado

`Backlog`

## Evidências esperadas

Pull Request com a interface, a implementação e os testes; saída de `pnpm test` sem falhas.
<!-- SUB-01:END -->

---

## SUB-02

**Título:** `[SUB-02] Modelar Perfil de Especialista e suas invariantes`
**Labels:** `usecase:uc02`, `domain:oferta`, `type:feature`, `layer:domain`, `priority:high`

<!-- SUB-02:START -->
> **Issue Principal:** Relacionada ao Épico {{EPIC}}

## Objetivo

Representar no domínio de C2 o Perfil de Especialista e suas invariantes, sem dependência de HTTP ou de persistência.

## Descrição

Criar o tipo `PerfilEspecialista` com `id`, `usuarioId` (somente a referência), `descricao`, `especialidades`, `situacao` (`ATIVO` | `SUSPENSO`) e `criadoEm`. A operação de criação aplica as invariantes e define a situação inicial `ATIVO` (decisão D2). O perfil não armazena nome nem email do usuário.

**Divisão da validação:** o domínio protege as invariantes, qualquer que seja a origem dos dados; o schema HTTP (SUB-05) cuida apenas do formato e dos campos não previstos.

## Origem

- Fluxo principal, passo 5; POS-01, POS-02, POS-03
- RN-UC02-02 (papéis do mesmo usuário) e RN-UC02-03 (situação para RN01)
- Validações da análise técnica (§7); decisões D2 e D3

## Escopo

**Inclui:** tipo e operação de criação; tipo da situação; invariantes de descrição e especialidades; testes unitários.

**Não inclui:** alterar a situação (suspender ou reativar); persistência; HTTP.

## Critérios de aceite

- [ ] A criação gera identificador próprio, data de criação e situação `ATIVO`.
- [ ] O perfil guarda somente a referência do usuário, sem nome ou email.
- [ ] Descrição vazia (após `trim`) ou com mais de 2000 caracteres é recusada.
- [ ] Lista de especialidades vazia, com mais de 20 itens ou com item fora de 1–120 caracteres é recusada.
- [ ] Especialidades repetidas — comparadas após `trim` e conversão para minúsculas — são recusadas (decisão D3).
- [ ] A situação aceita somente `ATIVO` ou `SUSPENSO`.
- [ ] Testes unitários cobrem a criação válida e cada invariante recusada, verificando presença e formato de `id` e `criadoEm` sem depender de valores exatos.

## Dependências

| Depende de | Tipo | Necessidade |
| --- | --- | --- |
| D2 — situação inicial | Decisão | Decidida em 10/11/2026: `ATIVO` |
| D3 — especialidades repetidas | Decisão | Decidida em 10/11/2026: recusar |

Esta issue fornece o formato do perfil usado pelas SUB-03, SUB-04 e SUB-05.

## Responsável

@leohsm

## Estado inicial recomendado

`Backlog`

## Evidências esperadas

Pull Request com o modelo e os testes unitários; saída de `pnpm test` sem falhas.
<!-- SUB-02:END -->

---

## SUB-03

**Título:** `[SUB-03] Definir contrato de persistência de perfis e adaptador em memória com unicidade`
**Labels:** `usecase:uc02`, `domain:oferta`, `type:feature`, `layer:repository`, `priority:high`

<!-- SUB-03:START -->
> **Issue Principal:** Relacionada ao Épico {{EPIC}}

## Objetivo

Isolar o armazenamento de perfis atrás de um contrato e garantir a unicidade `1 : 0..1` no próprio armazenamento.

## Descrição

Definir a interface `PerfisEspecialistaRepositorio` com as operações mínimas propostas:

- `adicionar(perfil)` — registra o perfil e falha com erro identificável se já existir perfil para o mesmo `usuarioId`. A verificação e a inserção acontecem na mesma operação, sem intervalo assíncrono entre elas.
- `buscarPorUsuario(usuarioId)` — retorna o perfil do usuário ou nenhum.

Implementar um adaptador em memória que devolve cópias, nunca referências internas.

O erro de unicidade é o erro de domínio `PerfilJaExistente`, definido nesta issue e repassado pela SUB-04. Adaptadores futuros (banco de dados) devem garantir a mesma unicidade de forma atômica, por exemplo com restrição única.

## Origem

- Fluxo principal, passo 6; exceção FE-03
- RN-UC02-01 (unicidade) e RN-UC02-05 (proteção na persistência)
- `trabalho4.md` §1.3 e §13.4.4

## Escopo

**Inclui:** interface e token; adaptador em memória; testes unitários, incluindo duas adições para o mesmo usuário.

**Não inclui:** banco de dados (D4); listagem ou paginação.

## Critérios de aceite

- [ ] Existe um contrato de persistência de perfis independente da tecnologia de armazenamento.
- [ ] Adicionar um perfil para um usuário sem perfil registra o perfil e permite recuperá-lo por usuário.
- [ ] Adicionar um segundo perfil para o mesmo usuário falha com `PerfilJaExistente` e mantém o primeiro intacto.
- [ ] A verificação de unicidade e a inserção ocorrem na mesma operação do adaptador, sem `await` entre elas.
- [ ] Alterar o objeto retornado não altera o registro armazenado.
- [ ] Testes unitários cobrem os itens acima.

## Dependências

| Depende de | Tipo | Necessidade |
| --- | --- | --- |
| SUB-02 | Contrato | Formato do `PerfilEspecialista` |

Esta issue fornece o contrato de persistência consumido pela SUB-04.

## Responsável

@leohsm

## Estado inicial recomendado

`Backlog`

## Evidências esperadas

Pull Request com o contrato, o adaptador e os testes; saída de `pnpm test` sem falhas.
<!-- SUB-03:END -->

---

## SUB-04

**Título:** `[SUB-04] Implementar serviço de aplicação Cadastrar Perfil de Especialista`
**Labels:** `usecase:uc02`, `domain:oferta`, `type:feature`, `layer:application`, `priority:high`

<!-- SUB-04:START -->
> **Issue Principal:** Relacionada ao Épico {{EPIC}}

## Objetivo

Coordenar o caso de uso: reconhecer o usuário, criar o perfil e registrá-lo, traduzindo falhas em erros de aplicação.

## Descrição

Criar o serviço `CadastrarPerfilEspecialista`. Assinatura proposta: `executar({ usuarioId, descricao, especialidades }): Promise<PerfilEspecialista>`. O serviço:

1. consulta a interface de reconhecimento de C1 (SUB-01);
2. cria o perfil pelo modelo de domínio (SUB-02);
3. adiciona o perfil pelo contrato de persistência (SUB-03);
4. sinaliza `UsuarioNaoReconhecido` e repassa `PerfilJaExistente` (definido na SUB-03).

A garantia de unicidade pertence ao repositório (SUB-03); o serviço não depende de uma consulta prévia para garanti-la.

O serviço depende apenas de contratos injetados por token. A origem de `usuarioId` (corpo da requisição ou identidade autenticada) é decidida fora desta issue (D1).

## Origem

- Fluxo principal, passos 3 a 7; exceções FE-02 e FE-03
- RN-UC02-01 e RN-UC02-04

## Escopo

**Inclui:** serviço; erros de aplicação; testes unitários com dublês dos contratos.

**Não inclui:** HTTP; validação de formato da requisição; adaptadores concretos.

## Critérios de aceite

- [ ] Com usuário reconhecido e sem perfil, retorna o perfil criado com situação `ATIVO`.
- [ ] Com usuário não reconhecido, sinaliza `UsuarioNaoReconhecido` e não aciona o armazenamento.
- [ ] Com perfil já existente, sinaliza `PerfilJaExistente` e não cria um segundo registro.
- [ ] Uma violação de invariante do perfil (SUB-02) é propagada como erro de validação, sem acionar o armazenamento.
- [ ] O serviço depende apenas das interfaces da SUB-01 e da SUB-03, sem importar classes concretas de C1.
- [ ] Testes unitários com dublês cobrem os quatro cenários acima.

## Dependências

| Depende de | Tipo | Necessidade |
| --- | --- | --- |
| SUB-01 | Contrato | Assinatura da interface de reconhecimento |
| SUB-02 | Contrato | Formato e operação de criação do perfil |
| SUB-03 | Contrato | Assinatura do repositório e erro de perfil existente |

Esta issue fornece a assinatura e os erros consumidos pela SUB-05.

## Responsável

@leohsm

## Estado inicial recomendado

`Backlog`

## Evidências esperadas

Pull Request com o serviço e os testes unitários; saída de `pnpm test` sem falhas.
<!-- SUB-04:END -->

---

## SUB-05

**Título:** `[SUB-05] Expor endpoint HTTP de cadastro de perfil`
**Labels:** `usecase:uc02`, `domain:oferta`, `type:feature`, `layer:api`, `priority:medium`

<!-- SUB-05:START -->
> **Issue Principal:** Relacionada ao Épico {{EPIC}}

## Objetivo

Disponibilizar o caso de uso pela API, com validação de entrada e respostas padronizadas.

## Descrição

Criar o controller de C2 com `POST /especialistas` (proposta que segue o padrão atual `/usuarios`, sem prefixo). Definir um schema de entrada estrito (zod) e mapear as respostas:

| Situação | Resposta |
| --- | --- |
| Sucesso | 201 com o perfil |
| Dados inválidos, campos não previstos ou invariante do perfil violada (ex.: especialidades repetidas) | 400 |
| `UsuarioNaoReconhecido` | 404 |
| `PerfilJaExistente` | 409 |

A origem de `usuarioId` segue a decisão D1.

## Origem

- Fluxo principal, passos 1, 2 e 7; exceções FE-01 a FE-03
- Validações da análise técnica (§7); decisão D1

## Escopo

**Inclui:** schema de entrada; controller; mapeamento de erros; testes do controller com o serviço substituído por dublê.

**Não inclui:** implementar autenticação (apenas aplica a decisão D1); consulta ou listagem de perfis.

## Critérios de aceite

- [ ] Uma requisição válida retorna 201 com `id`, `usuarioId`, `descricao`, `especialidades`, `situacao` e `criadoEm`.
- [ ] Campos ausentes, fora dos limites ou não previstos (por exemplo, `situacao`) retornam 400.
- [ ] Especialidades repetidas retornam 400 (decisão D3).
- [ ] `UsuarioNaoReconhecido` retorna 404 e `PerfilJaExistente` retorna 409.
- [ ] Textos são normalizados com `trim` antes de chegar ao serviço.
- [ ] A origem de `usuarioId` segue a decisão D1 registrada nesta issue.
- [ ] Testes cobrem cada código de resposta.

## Dependências

| Depende de | Tipo | Necessidade |
| --- | --- | --- |
| SUB-04 | Contrato | Assinatura do serviço e erros de aplicação |
| D1 — origem da identidade | Decisão | Definir de onde vem `usuarioId` |

## Responsável

@leohsm

## Estado inicial recomendado

`Backlog`

## Evidências esperadas

Pull Request com o controller, o schema e os testes; saída de `pnpm test` sem falhas.
<!-- SUB-05:END -->

---

## SUB-06

**Título:** `[SUB-06] Integrar C1 e C2 e verificar o fluxo completo por testes HTTP`
**Labels:** `usecase:uc02`, `type:test`, `layer:integration`, `priority:medium`

<!-- SUB-06:START -->
> **Issue Principal:** Relacionada ao Épico {{EPIC}}

## Objetivo

Compor os módulos de C1 e C2 na aplicação e comprovar o comportamento de ponta a ponta.

## Descrição

Registrar o módulo de C2 no `AppModule`, ligar os contratos aos adaptadores reais (SUB-01 e SUB-03) e criar `test/perfis-especialista.spec.ts`. Os testes cadastram o usuário por `POST /usuarios` e exercitam `POST /especialistas` no fluxo principal e nas exceções.

## Origem

- Fluxo principal completo; FA-01; FE-01 a FE-03
- PRE-01; POS-01 a POS-03

## Escopo

**Inclui:** composição dos módulos; testes HTTP do fluxo; regressão do UC01.

**Não inclui:** novos comportamentos além dos especificados nas outras Sub-Issues.

## Critérios de aceite

- [ ] `POST /usuarios` seguido de `POST /especialistas` retorna 201 com perfil `ATIVO` vinculado ao `id` do usuário.
- [ ] O `usuarioId` do perfil é igual ao `id` retornado por `POST /usuarios`: cliente e especialista são o mesmo usuário.
- [ ] Um segundo cadastro para o mesmo usuário retorna 409.
- [ ] Uma referência de usuário inexistente retorna 404.
- [ ] Os testes do UC01 e do UC02 passam juntos em `pnpm test`; `pnpm lint` e `pnpm build` terminam sem erros.

## Dependências

| Depende de | Tipo | Necessidade |
| --- | --- | --- |
| SUB-01 | Integração | Implementação real do reconhecimento |
| SUB-03 | Integração | Adaptador real de persistência |
| SUB-04 | Integração | Serviço implementado |
| SUB-05 | Integração | Endpoint implementado |

## Responsável

@leohsm

## Estado inicial recomendado

`Backlog`

## Evidências esperadas

Pull Request com a composição e os testes HTTP; saídas de `pnpm test`, `pnpm lint` e `pnpm build`.
<!-- SUB-06:END -->

---

## SUB-07

**Título:** `[SUB-07] Documentar o UC02 e o endpoint`
**Labels:** `usecase:uc02`, `domain:oferta`, `type:docs`, `priority:low`

<!-- SUB-07:START -->
> **Issue Principal:** Relacionada ao Épico {{EPIC}}

## Objetivo

Manter a documentação do backend coerente com o novo comportamento.

## Descrição

Atualizar o `README.md` da raiz e o `mindhub-backend/README.md` com o UC02: objetivo, regras (unicidade e situação inicial), exemplo de requisição e respostas (201, 400, 404 e 409) e limitações (D1 e D4). Seguir o padrão de exemplos em PowerShell do README atual.

## Origem

- Rastreabilidade do caso de uso
- `trabalho4.md` §13.8 (governança da entrega)

## Escopo

**Inclui:** READMEs; exemplos de uso.

**Não inclui:** alterar `trabalho3.md` ou `trabalho4.md`, que são entregas anteriores.

## Critérios de aceite

- [ ] O README descreve o UC02, suas regras e um exemplo de uso.
- [ ] Os exemplos de resposta correspondem aos códigos do endpoint (201, 400, 404 e 409).
- [ ] As limitações (origem da identidade — D1; armazenamento em memória — D4) estão explícitas.
- [ ] Os comandos documentados funcionam em uma execução local.

## Dependências

| Depende de | Tipo | Necessidade |
| --- | --- | --- |
| SUB-05 | Contrato | Forma final do endpoint, para a seção da API |

A descrição do caso de uso e das regras pode começar antes da SUB-05.

## Responsável

@leohsm

## Estado inicial recomendado

`Backlog`

## Evidências esperadas

Pull Request com os READMEs atualizados; execução local dos exemplos.
<!-- SUB-07:END -->
