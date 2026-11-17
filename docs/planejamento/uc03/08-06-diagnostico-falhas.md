# 08-06 — Diagnóstico de falhas de integração

**Caso de uso:** UC03 — Publicar Serviço (épico [#35](https://github.com/MindHub-DSC/Mindhub/issues/35))
**Sub-Issue:** [#40](https://github.com/MindHub-DSC/Mindhub/issues/40)
**Branch:** `feature/40-uc03-endpoint-publicar-servico`
**Data:** 17/11/2026

## 1. Categorias de falha no projeto

| Categoria | Exemplo concreto no UC03 | Como aparece | O que detecta |
| --- | --- | --- | --- |
| **Composição / DI** | `SERVICOS_REPOSITORIO` sem provider; implementação registrada pela classe e não pelo token; `OfertaModule` sem importar `IdentidadeModule`; `TypeOrmModule.forFeature` sem o `DataSource` | `UnknownDependenciesException` na compilação do módulo (a aplicação nem sobe) | `servicos.composicao.spec.ts`, `servicos.integracao.spec.ts`, inicialização real |
| **Fronteira HTTP** | Schema sem `z.strictObject`; `@Body()` sem `{ schema }`; pipe global ausente; rota `@Controller('servico')`; filtro sem `@UseFilters` | 201 onde devia ser 400; 404 de rota; 500 em vez de 404/403/422 | `servicos.http.spec.ts` (nível B), integrado (nível C) |
| **Comportamento entre camadas** | Serviço que não chama `adicionar`; serviço que passa o `usuarioId` como `perfilId`; repositório que devolve referência e não cópia | 201 "correto" com nada gravado ou dado errado | Nível A (`publicar-servico.spec.ts`), nível C (`servicos.integracao.spec.ts`, mutação no `08-05`), contrato da porta |

Já observado nesta etapa: o `UnknownDependenciesException` do `TypeOrmModule` ao compilar o `OfertaModule` fora do `AppModule` (`08-03`), e a mutação "serviço não grava" pega só pelos níveis A e C (`08-05`).

## 2. Experimento em contexto isolado

### Configuração

Um `Test.createTestingModule` próprio, **sem importar o `OfertaModule`**, com:

- `controllers: [ServicosController]` (real);
- o provider do `PublicarServico` (real) **na mesma forma do `OfertaModule`**: `useFactory` com `inject: [PERFIS_ESPECIALISTA_REPOSITORIO, SERVICOS_REPOSITORIO]`;
- `PERFIS_ESPECIALISTA_REPOSITORIO` com a implementação em memória;
- e **sem** o provider de `SERVICOS_REPOSITORIO`.

### Captura da mensagem real (sonda temporária, removida depois)

```text
$ pnpm exec vitest run test/unit/oferta/_sonda-di.spec.ts --reporter=verbose
stdout | test/unit/oferta/_sonda-di.spec.ts > sonda DI
NOME: UnknownDependenciesException
MENSAGEM:
Nest can't resolve dependencies of the PublicarServico (Symbol(PerfisEspecialistaRepositorio), ?). Please make sure that the argument Symbol(ServicosRepositorio) at index [1] is available in the RootTestModule module.
Potential solutions:
- Is RootTestModule a valid NestJS module?
- If Symbol(ServicosRepositorio) is a provider, is it part of the current RootTestModule?
- If Symbol(ServicosRepositorio) is exported from a separate @Module, is that module imported within RootTestModule?
  @Module({
    imports: [ /* the Module containing Symbol(ServicosRepositorio) */ ]
  })
For more common dependency resolution issues, see: https://docs.nestjs.com/faq/common-errors
```

(A primeira tentativa, sem `--reporter=verbose`, não mostrou o `console.log`: o reporter padrão do Vitest 4 esconde a saída de testes que passam.)

### Anatomia da mensagem

| Trecho | Significado no projeto |
| --- | --- |
| `UnknownDependenciesException` | Classe do erro: o container não achou um provider pedido |
| `dependencies of the PublicarServico` | O provider que **falhou ao ser criado**: o `useFactory` do `PublicarServico` |
| `(Symbol(PerfisEspecialistaRepositorio), ?)` | A lista do `inject`. O primeiro foi resolvido; o `?` marca o que faltou |
| `argument Symbol(ServicosRepositorio) at index [1]` | O **token ausente** (`SERVICOS_REPOSITORIO`, um `Symbol` com essa descrição) e sua **posição** no `inject` (segundo parâmetro da fábrica) |
| `in the RootTestModule module` | O **módulo** onde a busca aconteceu (o módulo raiz criado pelo `Test.createTestingModule`); na aplicação real seria `OfertaModule` |
| `Potential solutions` | As três causas típicas: provider não registrado, provider em outro módulo não importado, ou módulo inválido |

A exceção também traz o contexto estruturado (visto no teste da seção 3): `type: "PublicarServico"`, `context.index: 1`, `context.name: Symbol(ServicosRepositorio)`, `context.dependencies: [Symbol(PerfisEspecialistaRepositorio), Symbol(ServicosRepositorio)]`.

### Causa raiz e correção

O `PublicarServico` pede `SERVICOS_REPOSITORIO`, mas o módulo não tem nenhum provider com esse token. A interface `ServicosRepositorio` **não serve de token** (é apagada na transpilação). Registrar `ServicosEmMemoria` pela classe (`providers: [ServicosEmMemoria]`) também não resolve, porque cria o token `ServicosEmMemoria`, não `SERVICOS_REPOSITORIO`.

Correção, igual à do `OfertaModule`:

```ts
{ provide: SERVICOS_REPOSITORIO, useClass: ServicosEmMemoria }
```

## 3. Teste permanente — `test/unit/oferta/servicos.composicao.spec.ts`

Mantido na suíte como verificação explícita, com `.rejects`:

| Teste | Verifica |
| --- | --- |
| Sem provider para `SERVICOS_REPOSITORIO` | `rejects.toThrow` com a primeira frase exata da mensagem real |
| Implementação registrada pela classe | Classe `UnknownDependenciesException` (pelo `constructor.name`, pois o `@nestjs/core` não exporta a classe) e contexto `{ type: 'PublicarServico', context: { index: 1, name: SERVICOS_REPOSITORIO } }` |
| Correção | Compila; o container entrega `PublicarServico`, `ServicosEmMemoria` e `ServicosController` |

A primeira versão do segundo teste falhou por erro **meu**: usei `toMatchObject({ name: 'UnknownDependenciesException' })`, mas `name` não é propriedade própria da exceção (o nome vem da classe). Troquei pela verificação do `constructor.name` e do contexto estruturado:

```text
$ pnpm exec vitest run test/unit/oferta/servicos.composicao.spec.ts --reporter=verbose
 ✓ … > sem provider para SERVICOS_REPOSITORIO: o Nest não resolve o PublicarServico 12ms
 ✓ … > implementação registrada pela classe, e não pelo token: mesmo erro 4ms
 ✓ … > correção: associar o token à implementação compõe o fluxo 223ms
 Test Files  1 passed (1)
      Tests  3 passed (3)
   Start at  15:10:09
   Duration  1.09s (transform 134ms, setup 0ms, import 650ms, tests 241ms, environment 0ms)

$ pnpm test
 Test Files  11 passed (11)
      Tests  99 passed (99)
   Start at  15:10:11
   Duration  2.56s (transform 1.03s, setup 0ms, import 5.89s, tests 985ms, environment 5ms)
$ pnpm lint   → 0 avisos
$ pnpm build  → build exit=0
```

`…` = `test/unit/oferta/servicos.composicao.spec.ts > Composição do PublicarServico — diagnóstico de injeção (isolado)`.

## 4. Verificação de que a produção ficou intacta

```text
$ git status --short
?? docs/planejamento/uc03/08-01-diagnostico-arquitetura.md
… (08-02 a 08-05)
?? mindhub-backend/test/unit/oferta/servicos.composicao.spec.ts
?? mindhub-backend/test/unit/oferta/servicos.integracao.spec.ts
```

Nenhum arquivo de `src/` alterado: o `OfertaModule` não foi quebrado para provocar o erro, e nada quebrado será commitado.

## 5. Conclusões

- Uma falha de composição no Nest aparece **na compilação do módulo**, antes de qualquer requisição. A mensagem diz exatamente qual provider falhou, em qual posição e qual token faltou.
- Neste projeto o serviço de aplicação é criado por `useFactory`. Por isso a "posição no construtor" do material corresponde à **posição no `inject`** da fábrica.
- O nível B (HTTP com serviço simulado) **não** detecta esse tipo de falha, porque registra o serviço com `useValue`. O nível C e este teste de composição detectam.
