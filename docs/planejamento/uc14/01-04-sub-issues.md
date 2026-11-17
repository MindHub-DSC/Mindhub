# 01-04 — Sub-Issues completas

**Caso de uso:** UC14 — Avaliar Sessão  
**Issue principal:** `[UC14] Avaliar Sessão`

Cada Sub-Issue abaixo está pronta para publicação. O texto entre os marcadores `START` e `END` é o corpo da issue. `{{EPIC}}` e `{{SUB-XX}}` são substituídos pelos números reais na criação.

---

## SUB-01

**Título:** `[UC14-SUB-01] [C4] Modelar a Avaliação`  
**Labels:** `usecase:uc14`, `domain:agenda`, `type:feature`, `layer:domain`, `priority:high`

<!-- SUB-01:START -->
> **Issue Principal:** Relacionada ao Épico {{EPIC}}

## Objetivo

Representar a opinião do cliente sobre uma Sessão, com conteúdo válido e imutável.

## Descrição

Criar a entidade `Avaliacao` (identidade, Sessão, autor, nota, comentário opcional, instante) conforme D-UC14-01, sem operação de edição (D-UC14-02), e os erros de domínio.

## Origem

POS-01; passo 1; `trabalho3.md` §5.1, §8, §10.

## Escopo

**Inclui:** Entidade, erros de domínio e testes.

**Não inclui:** Resposta do especialista; reputação; edição.

## Critérios de aceite

- [ ] A Avaliação referencia a Sessão e o autor (cliente).
- [ ] Conteúdo válido conforme D-UC14-01 cria a Avaliação com o instante informado.
- [ ] Nota fora da escala ou comentário acima do limite é recusado.
- [ ] A Avaliação não oferece operação de edição.

## Dependências

| Depende de | Tipo | Necessidade |
| --- | --- | --- |
| D-UC14-01 | Decisão | Define o conteúdo. |

Esta issue fornece o que é consumido por {{SUB-02}}, {{SUB-03}}.

## Responsável

@leohsm

## Estado inicial recomendado

`Backlog`

## Evidências esperadas

Pull Request com a implementação e os testes da unidade; saída de `pnpm test`, `pnpm lint` e `pnpm build` sem falhas.
<!-- SUB-01:END -->

---

## SUB-02

**Título:** `[UC14-SUB-02] [C4] Garantir a unicidade da Avaliação por Sessão no repositório`  
**Labels:** `usecase:uc14`, `domain:agenda`, `type:feature`, `layer:repository`, `priority:high`

<!-- SUB-02:START -->
> **Issue Principal:** Relacionada ao Épico {{EPIC}}

## Objetivo

Impedir duas Avaliações do mesmo cliente para a mesma Sessão, mesmo sob concorrência.

## Descrição

Criar a porta `AvaliacoesRepositorio` (`adicionar`, `buscarPorSessaoEAutor`) e o adaptador em memória com seção crítica que recusa a segunda Avaliação do mesmo cliente para a Sessão.

## Origem

POS-02; FE-03, FE-04; RN10; `trabalho4.md` TC-C4-02; `trabalho3.md` §8.

## Escopo

**Inclui:** Porta, adaptador em memória, testes de contrato e de concorrência.

**Não inclui:** Banco de dados.

## Critérios de aceite

- [ ] A segunda Avaliação do mesmo cliente para a Sessão é recusada.
- [ ] Duas Avaliações simultâneas do mesmo cliente para a mesma Sessão: apenas uma é registrada.
- [ ] Avaliações de Sessões diferentes coexistem.
- [ ] O adaptador devolve cópias defensivas e busca por Sessão e autor.

## Dependências

| Depende de | Tipo | Necessidade |
| --- | --- | --- |
| {{SUB-01}} | Interna | Usa a entidade Avaliação. |

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

**Título:** `[UC14-SUB-03] [C4] Implementar o serviço de aplicação Avaliar Sessão`  
**Labels:** `usecase:uc14`, `domain:agenda`, `type:feature`, `layer:application`, `priority:high`

<!-- SUB-03:START -->
> **Issue Principal:** Relacionada ao Épico {{EPIC}}

## Objetivo

Coordenar a elegibilidade (RN09), o registro atômico (RN10) e a resposta ao cliente.

## Descrição

Criar o serviço `AvaliarSessao`: obtém a Sessão (UC13), verifica que o autor é o cliente da Sessão e que ela está `CONCLUIDA`, cria a Avaliação e a registra pelo repositório, traduzindo a recusa de duplicidade.

## Origem

Passos 2 a 4; PRE-01; FE-01 a FE-03; RN09, RN10.

## Escopo

**Inclui:** Serviço de aplicação, erros de aplicação e testes com dublês.

**Não inclui:** HTTP; reputação.

## Critérios de aceite

- [ ] O cliente da Sessão `CONCLUIDA` avalia e recebe a Avaliação.
- [ ] Sessão que não está `CONCLUIDA` é recusada (RN09); nada é registrado.
- [ ] Autor que não é o cliente da Sessão é recusado (RN09).
- [ ] Avaliação já existente é recusada (RN10).
- [ ] Sessão inexistente é recusada sem registro.
- [ ] Toda recusa deixa o repositório sem registro novo.

## Dependências

| Depende de | Tipo | Necessidade |
| --- | --- | --- |
| {{SUB-01}} | Interna | Usa a Avaliação. |
| {{SUB-02}} | Interna | Usa a unicidade atômica. |
| UC13 | Externa | Fornece a Sessão e sua situação. |

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

**Título:** `[UC14-SUB-04] [C4] Expor o endpoint de avaliação e verificar a concorrência`  
**Labels:** `usecase:uc14`, `domain:agenda`, `type:feature`, `layer:api`, `layer:integration`, `priority:high`

<!-- SUB-04:START -->
> **Issue Principal:** Relacionada ao Épico {{EPIC}}

## Objetivo

Disponibilizar a avaliação pela API e comprovar a unicidade sob concorrência.

## Descrição

Criar DTO com `z.strictObject`, controller e tradução de erros (D-UC14-05). Escrever os testes de ponta a ponta: Sessão concluída pelo UC13, avaliação válida, duplicada e duas simultâneas.

## Origem

Passos 1 e 4; FE-02, FE-04; D1.

## Escopo

**Inclui:** DTO, controller, filtro de erros e testes HTTP.

**Não inclui:** Autenticação.

## Critérios de aceite

- [ ] A requisição válida responde 201 com a Avaliação.
- [ ] Corpo fora do formato ou com campos não previstos responde 400 sem iniciar o caso de uso.
- [ ] Autor que não é o cliente responde 403; Sessão inexistente, 404; Sessão não concluída ou já avaliada, 409.
- [ ] Duas requisições simultâneas do mesmo cliente: uma responde 201 e a outra 409.
- [ ] O teste cobre a jornada UC13 → UC14 com Sessão real.

## Dependências

| Depende de | Tipo | Necessidade |
| --- | --- | --- |
| {{SUB-03}} | Interna | Chama o serviço. |
| D-UC14-05 | Decisão | Rota e códigos. |
| D-UC14-06 | Decisão | Origem do identificador do cliente. |

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

**Título:** `[UC14-SUB-05] [C4] Documentar o UC14 e o endpoint`  
**Labels:** `usecase:uc14`, `domain:agenda`, `type:docs`, `priority:low`

<!-- SUB-05:START -->
> **Issue Principal:** Relacionada ao Épico {{EPIC}}

## Objetivo

Manter a documentação coerente com o comportamento entregue.

## Descrição

Atualizar o README e o `requests.http` com os exemplos do caso de uso e registrar as limitações: sem autenticação (D1), conteúdo da Avaliação provisório (D-UC14-01), sem edição nem prazo, sem avaliação organizacional.

## Origem

Rastreabilidade do planejamento.

## Escopo

**Inclui:** README, `requests.http` e registro de limitações.

**Não inclui:** Alteração de código.

## Critérios de aceite

- [ ] Os exemplos do `requests.http` são executáveis e cobrem sucesso e as recusas principais.
- [ ] As limitações e as decisões D-UC14-01 a D-UC14-06 estão registradas.
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
