# 08-03 — Verificação de módulos e providers

**Caso de uso:** UC03 — Publicar Serviço (épico [#35](https://github.com/MindHub-DSC/Mindhub/issues/35))
**Branch:** `feature/40-uc03-endpoint-publicar-servico` @ `2545027`
**Data:** 17/11/2026

## 1. Componentes inspecionados

| Tipo | Elemento | Arquivo |
| --- | --- | --- |
| Módulo raiz | `AppModule` | `src/app.module.ts` |
| Módulo da funcionalidade | `OfertaModule` | `src/oferta/oferta.module.ts` |
| Módulo importado | `IdentidadeModule` (exporta `RECONHECIMENTO_DE_USUARIO`) | `src/identidade/identidade.module.ts` |
| Controller | `ServicosController` | `src/oferta/http/servicos.controller.ts` |
| Serviço de aplicação | `PublicarServico` | `src/oferta/aplicacao/publicar-servico.ts` |
| Token de Serviços | `SERVICOS_REPOSITORIO = Symbol('ServicosRepositorio')` | `src/oferta/dominio/servicos.repositorio.ts` |
| Implementação | `ServicosEmMemoria` | `src/oferta/infra/servicos.em-memoria.ts` |
| Token de perfis | `PERFIS_ESPECIALISTA_REPOSITORIO` → `PerfisEspecialistaTypeOrmRepositorio` | `src/oferta/dominio/perfis-especialista.repositorio.ts` |
| Pipe | `StandardSchemaValidationPipe` (`APP_PIPE`) | `src/app.module.ts` |

## 2. Os 8 pontos de verificação

| # | Ponto | Situação | Evidência |
| --- | --- | --- | --- |
| 1 | Módulo da funcionalidade íntegro | **Confirmado** | `OfertaModule dependencies initialized` |
| 2 | Controller em `controllers` | **Confirmado** | `controllers: [PerfisEspecialistaController, ServicosController]`; `ServicosController {/servicos}` no log |
| 3 | Serviço em `providers` | **Confirmado** | `{ provide: PublicarServico, useFactory: …, inject: [PERFIS_ESPECIALISTA_REPOSITORIO, SERVICOS_REPOSITORIO] }` |
| 4 | Token do repositório | **Confirmado** | `SERVICOS_REPOSITORIO` é um `Symbol` |
| 5 | Implementação em memória associada ao token | **Confirmado** | `{ provide: SERVICOS_REPOSITORIO, useClass: ServicosEmMemoria }`; a sonda confirmou `instanceof ServicosEmMemoria` |
| 6 | Módulo importado no `AppModule` | **Confirmado** | `imports: [TypeOrmModule.forRootAsync(…), IdentidadeModule, OfertaModule]` |
| 7 | Validação configurada | **Confirmado** (com o mecanismo do projeto) | `{ provide: APP_PIPE, useClass: StandardSchemaValidationPipe }`; não há `ValidationPipe` |
| 8 | Compila e inicializa sem falha de injeção | **Confirmado** | `pnpm build` exit 0; log abaixo |

## 3. Configuração real do módulo

```ts
@Module({
  imports: [
    IdentidadeModule,
    TypeOrmModule.forFeature([PerfilEspecialistaOrmEntity]),
  ],
  controllers: [PerfisEspecialistaController, ServicosController],
  providers: [
    {
      provide: PERFIS_ESPECIALISTA_REPOSITORIO,
      useFactory: (orm: Repository<PerfilEspecialistaOrmEntity>) =>
        new PerfisEspecialistaTypeOrmRepositorio(orm),
      inject: [getRepositoryToken(PerfilEspecialistaOrmEntity)],
    },
    {
      provide: CadastrarPerfilEspecialista,
      useFactory: (reconhecimento: ReconhecimentoDeUsuario, perfis: PerfisEspecialistaRepositorio) =>
        new CadastrarPerfilEspecialista(reconhecimento, perfis),
      inject: [RECONHECIMENTO_DE_USUARIO, PERFIS_ESPECIALISTA_REPOSITORIO],
    },
    // Provisório até a #37 (TypeORM): os Serviços ficam em memória e se
    // perdem ao reiniciar. Troca-se só esta linha; o contrato é o mesmo.
    { provide: SERVICOS_REPOSITORIO, useClass: ServicosEmMemoria },
    {
      provide: PublicarServico,
      useFactory: (perfis: PerfisEspecialistaRepositorio, servicos: ServicosRepositorio) =>
        new PublicarServico(perfis, servicos),
      inject: [PERFIS_ESPECIALISTA_REPOSITORIO, SERVICOS_REPOSITORIO],
    },
  ],
})
export class OfertaModule {}
```

O padrão do material (`{ provide: TOKEN, useClass: Implementacao }`) é o usado para `SERVICOS_REPOSITORIO`. Os tokens são `Symbol`s, não interfaces: `ServicosRepositorio` e `PerfisEspecialistaRepositorio` são apagadas na transpilação e só servem para os tipos.

## 4. Cadeia de resolução de dependências (projeto real)

| Passo | O que o container faz |
| --- | --- |
| 1 | Instancia `ServicosController` (registrado em `controllers`) |
| 2 | O construtor pede `@Inject(PublicarServico)`; o container procura um provider com o token `PublicarServico` (a própria classe) |
| 3 | **Diferença do material:** o `PublicarServico` não tem `@Injectable()` nem `@Inject(TOKEN)` no construtor. A aplicação não conhece o Nest; quem declara as dependências é o `useFactory` do módulo, com `inject: [PERFIS_ESPECIALISTA_REPOSITORIO, SERVICOS_REPOSITORIO]` |
| 4 | Para `SERVICOS_REPOSITORIO`, o módulo encontra `useClass: ServicosEmMemoria` e cria uma instância (singleton no módulo) |
| 5 | Para `PERFIS_ESPECIALISTA_REPOSITORIO`, chama o `useFactory` que recebe o `Repository<PerfilEspecialistaOrmEntity>` do TypeORM (que por sua vez depende do `DataSource`) |
| 6 | Chama `new PublicarServico(perfis, servicos)` e injeta o resultado no controller |
| 7 | O `PublicarServico` só conhece as interfaces `PerfisEspecialistaRepositorio` e `ServicosRepositorio`; trocar `ServicosEmMemoria` pelo adaptador TypeORM (#37) muda só o provider |

## 5. Verificação prática

### Build e inicialização

```text
$ pnpm build
$ nest build
build exit=0

$ node dist/main.js
[Nest] 11784  - 17/11/2026, 15:01:23     LOG [NestFactory] Starting Nest application...
[Nest] 11784  - 17/11/2026, 15:01:23     LOG [InstanceLoader] TypeOrmModule dependencies initialized +78ms
[Nest] 11784  - 17/11/2026, 15:01:23     LOG [InstanceLoader] AppModule dependencies initialized +1ms
[Nest] 11784  - 17/11/2026, 15:01:23     LOG [InstanceLoader] TypeOrmCoreModule dependencies initialized +69ms
[Nest] 11784  - 17/11/2026, 15:01:23     LOG [InstanceLoader] TypeOrmModule dependencies initialized +0ms
[Nest] 11784  - 17/11/2026, 15:01:23     LOG [InstanceLoader] TypeOrmModule dependencies initialized +1ms
[Nest] 11784  - 17/11/2026, 15:01:23     LOG [InstanceLoader] IdentidadeModule dependencies initialized +0ms
[Nest] 11784  - 17/11/2026, 15:01:23     LOG [InstanceLoader] OfertaModule dependencies initialized +1ms
[Nest] 11784  - 17/11/2026, 15:01:23     LOG [RoutesResolver] AppController {/}: +7ms
[Nest] 11784  - 17/11/2026, 15:01:23     LOG [RouterExplorer] Mapped {/, GET} route +2ms
[Nest] 11784  - 17/11/2026, 15:01:23     LOG [RoutesResolver] UsuariosController {/usuarios}: +0ms
[Nest] 11784  - 17/11/2026, 15:01:23     LOG [RouterExplorer] Mapped {/usuarios, POST} route +1ms
[Nest] 11784  - 17/11/2026, 15:01:23     LOG [RoutesResolver] PerfisEspecialistaController {/especialistas}: +0ms
[Nest] 11784  - 17/11/2026, 15:01:23     LOG [RouterExplorer] Mapped {/especialistas, POST} route +0ms
[Nest] 11784  - 17/11/2026, 15:01:23     LOG [RoutesResolver] ServicosController {/servicos}: +0ms
[Nest] 11784  - 17/11/2026, 15:01:23     LOG [RouterExplorer] Mapped {/servicos, POST} route +0ms
[Nest] 11784  - 17/11/2026, 15:01:23     LOG [NestApplication] Nest application successfully started +2ms
```

(O processo 6040, que estava no ar desde o Material 07, foi encerrado antes: `o processo com PID 6040 foi finalizado`.)

### Sonda da opção C2 (arquivo temporário, removido depois)

Objetivo: saber se o `OfertaModule` **real** compila sem banco, para o teste integrado da Fase 7.

```ts
const modulo = await Test.createTestingModule({ imports: [OfertaModule] })
  .overrideProvider(getRepositoryToken(PerfilEspecialistaOrmEntity)).useValue({})
  .overrideProvider(getRepositoryToken(UsuarioOrmEntity)).useValue({})
  .overrideProvider(PERFIS_ESPECIALISTA_REPOSITORIO).useValue(new PerfisEspecialistaEmMemoria())
  .compile();
expect(modulo.get(PublicarServico)).toBeInstanceOf(PublicarServico);
expect(modulo.get(SERVICOS_REPOSITORIO)).toBeInstanceOf(ServicosEmMemoria);
```

```text
 ✓ … > sonda: OfertaModule real compila sem banco? 175ms
ERRO SEM OVERRIDE: Nest can't resolve dependencies of the UsuarioOrmEntityRepository (?). Please make sure that the argument DataSource at index [0] is available in the TypeOrmModule module.
 ✓ … > sonda: sem os overrides, o que acontece? 10ms
      Tests  2 passed (2)
```

Leitura:

- **Sem trocas**, o módulo real não compila fora do `AppModule`: o `TypeOrmModule.forFeature` (aqui o do `IdentidadeModule`) precisa do `DataSource` criado pelo `TypeOrmModule.forRootAsync`, que só existe no `AppModule`.
- **Com três trocas**, compila, e o container entrega o `PublicarServico` real e o `ServicosEmMemoria` real:
  - os dois tokens de repositório TypeORM (`getRepositoryToken(...)`) viram objetos vazios: só são lidos pelas fábricas que criam os adaptadores TypeORM, e essas fábricas não são executadas no fluxo do UC03 (a de perfis é substituída; a de usuários alimenta o `ReconhecerUsuario`, que o `PublicarServico` não usa);
  - `PERFIS_ESPECIALISTA_REPOSITORIO` vira a implementação em memória do UC02 (`test/support/perfis-especialista.em-memoria.ts`), a mesma validada pela suíte de contrato de perfis.
- **Nada do UC03 é trocado:** controller, serviço e `SERVICOS_REPOSITORIO` vêm do módulo real.
- Nenhum arquivo de produção foi alterado; a árvore ficou limpa depois de remover a sonda.

## 6. Diagnóstico e pendências

- Nenhuma falha de injeção na aplicação real.
- A opção **C2** é viável e será usada na Fase 7, com os três overrides documentados no próprio teste.
- A aplicação continua no ar (processo 11784, porta 3000) para a Fase 6.
