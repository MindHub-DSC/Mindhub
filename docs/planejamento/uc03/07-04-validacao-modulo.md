# 07-04 — Validação e composição do módulo

**Caso de uso:** UC03 — Publicar Serviço (épico [#35](https://github.com/MindHub-DSC/Mindhub/issues/35))
**Sub-Issue:** [#40](https://github.com/MindHub-DSC/Mindhub/issues/40)
**Branch:** `feature/40-uc03-endpoint-publicar-servico`
**Data:** 17/11/2026

## 1. DTO e restrições

O schema `publicarServicoSchema` (`src/oferta/http/publicar-servico.dto.ts`, detalhado no `07-03`) exige: objeto sem campos extras; `usuarioId` UUID; `titulo` e `descricao` string; `modeloContratacao` `RESERVA_DIRETA` ou `SOB_PROPOSTA`; `condicoes` opcional, objeto sem campos extras com `preco` e `duracaoMinutos` number e `moeda` e `modalidade` string.

## 2. Validação na fronteira

O projeto **não usa** o `ValidationPipe` com `class-validator` do exemplo do material. A configuração equivalente já existia em `src/app.module.ts` e **não foi alterada**:

```ts
providers: [
  AppService,
  { provide: APP_PIPE, useClass: StandardSchemaValidationPipe },
  { provide: APP_FILTER, useClass: ArmazenamentoIndisponivelFilter },
],
```

Como funciona:

| Aspecto | `ValidationPipe` + `class-validator` (material) | `StandardSchemaValidationPipe` + zod (projeto) |
| --- | --- | --- |
| Onde fica a regra | Decoradores na classe DTO (`@IsString()`) | Schema zod passado ao parâmetro: `@Body({ schema: publicarServicoSchema })` |
| Como o pipe encontra a regra | Lê os metadados dos decoradores da classe | Lê o `schema` registrado no parâmetro; o zod implementa a interface *Standard Schema* |
| Campos não previstos | `whitelist: true` **remove** os campos sem decorador (com `forbidNonWhitelisted` recusaria) | `z.strictObject` **recusa** o corpo inteiro com 400: nada é descartado em silêncio (FE-01) |
| Transformação | `transform: true` cria uma instância da classe DTO (e converte tipos só com configuração) | O controller recebe o valor já validado pelo schema, um objeto simples tipado por `z.infer`; não há conversão de tipos (ex.: `"60"` não vira `60`) |
| Entrada inválida | 400 antes do método do controller | 400 antes do método do controller |
| Escopo | Global em `main.ts` (`useGlobalPipes`) | Global pelo token `APP_PIPE` no `AppModule`, então também vale nos testes que importam o `AppModule` |

## 3. Estrutura dos módulos

| Módulo | Papel | Alteração |
| --- | --- | --- |
| `AppModule` | TypeORM, pipe e filtro globais; importa `IdentidadeModule` e `OfertaModule` | Nenhuma |
| `OfertaModule` | C2: perfis (UC02) e Serviços (UC03) | Controller e 2 providers novos |

`src/oferta/oferta.module.ts` (trecho alterado):

```ts
  controllers: [PerfisEspecialistaController, ServicosController],
  providers: [
    /* ... providers do UC02, sem alteração ... */
    // Provisório até a #37 (TypeORM): os Serviços ficam em memória e se
    // perdem ao reiniciar. Troca-se só esta linha; o contrato é o mesmo.
    { provide: SERVICOS_REPOSITORIO, useClass: ServicosEmMemoria },
    {
      provide: PublicarServico,
      useFactory: (
        perfis: PerfisEspecialistaRepositorio,
        servicos: ServicosRepositorio,
      ) => new PublicarServico(perfis, servicos),
      inject: [PERFIS_ESPECIALISTA_REPOSITORIO, SERVICOS_REPOSITORIO],
    },
  ],
```

## 4. Providers, token e implementação

| Token | Implementação | Observação |
| --- | --- | --- |
| `PERFIS_ESPECIALISTA_REPOSITORIO` (já existia) | `PerfisEspecialistaTypeOrmRepositorio` (PostgreSQL) | Reutilizado: o `PublicarServico` busca o perfil real do ator |
| `SERVICOS_REPOSITORIO` (da #36) | `ServicosEmMemoria` | **Provisório e didático/operacional**: permite subir a aplicação antes da #37. Não é a persistência definitiva; os Serviços se perdem ao reiniciar |
| `PublicarServico` | `useFactory`, como o `CadastrarPerfilEspecialista` | A aplicação não conhece o Nest; o relógio padrão (`new Date()`) é usado |

Para isso, o adaptador foi **movido** de `test/support/servicos.em-memoria.ts` para `src/oferta/infra/servicos.em-memoria.ts` (`git mv`), sem mudar comportamento: só os imports e o comentário. Não foi criado um segundo contrato: é a mesma classe, validada pela mesma suíte de contrato.

```text
$ pnpm test   (depois do movimento)
 Test Files  8 passed (8)
      Tests  80 passed (80)
```

## 5. Inicialização real da aplicação

```text
$ pnpm db:up
 Container mindhub-postgres-1 Starting
 Container mindhub-postgres-1 Started
 Container mindhub-postgres-1 Waiting
 Container mindhub-postgres-1 Healthy

$ pnpm build        → build exit=0
$ node dist/main.js     (PORT=3000, lido do .env)
[Nest] 6040  - 17/11/2026, 14:38:08     LOG [NestFactory] Starting Nest application...
[Nest] 6040  - 17/11/2026, 14:38:08     LOG [InstanceLoader] TypeOrmModule dependencies initialized +100ms
[Nest] 6040  - 17/11/2026, 14:38:08     LOG [InstanceLoader] AppModule dependencies initialized +0ms
[Nest] 6040  - 17/11/2026, 14:38:08     LOG [InstanceLoader] TypeOrmCoreModule dependencies initialized +80ms
[Nest] 6040  - 17/11/2026, 14:38:08     LOG [InstanceLoader] TypeOrmModule dependencies initialized +0ms
[Nest] 6040  - 17/11/2026, 14:38:08     LOG [InstanceLoader] TypeOrmModule dependencies initialized +1ms
[Nest] 6040  - 17/11/2026, 14:38:08     LOG [InstanceLoader] IdentidadeModule dependencies initialized +0ms
[Nest] 6040  - 17/11/2026, 14:38:08     LOG [InstanceLoader] OfertaModule dependencies initialized +0ms
[Nest] 6040  - 17/11/2026, 14:38:08     LOG [RoutesResolver] AppController {/}: +11ms
[Nest] 6040  - 17/11/2026, 14:38:08     LOG [RouterExplorer] Mapped {/, GET} route +2ms
[Nest] 6040  - 17/11/2026, 14:38:08     LOG [RoutesResolver] UsuariosController {/usuarios}: +0ms
[Nest] 6040  - 17/11/2026, 14:38:08     LOG [RouterExplorer] Mapped {/usuarios, POST} route +1ms
[Nest] 6040  - 17/11/2026, 14:38:08     LOG [RoutesResolver] PerfisEspecialistaController {/especialistas}: +0ms
[Nest] 6040  - 17/11/2026, 14:38:08     LOG [RouterExplorer] Mapped {/especialistas, POST} route +0ms
[Nest] 6040  - 17/11/2026, 14:38:08     LOG [RoutesResolver] ServicosController {/servicos}: +0ms
[Nest] 6040  - 17/11/2026, 14:38:08     LOG [RouterExplorer] Mapped {/servicos, POST} route +1ms
[Nest] 6040  - 17/11/2026, 14:38:08     LOG [NestApplication] Nest application successfully started +1ms

$ curl -s -o /dev/null -w "GET / -> %{http_code}\n" http://localhost:3000/
GET / -> 200
```

| Verificação (10.4) | Resultado |
| --- | --- |
| Sem erro de dependências (`UnknownDependenciesException`) | Sim: nenhum erro no log |
| Módulos inicializados (`InstanceLoader`) | `OfertaModule dependencies initialized` |
| Rota mapeada (`RoutesResolver` / `RouterExplorer`) | `ServicosController {/servicos}` e `Mapped {/servicos, POST} route` |

## 6. Verificações de qualidade

```text
$ pnpm build   → exit 0
$ pnpm lint    → sem avisos
$ pnpm test    → Test Files 8 passed (8), Tests 80 passed (80)
```

## 7. Pendências

- A rota ainda não foi chamada: requisições reais na Fase 8 (`07-05`).
- A aplicação continua no ar (processo 6040, porta 3000) para a Fase 8.
- Persistência real dos Serviços: #37.
