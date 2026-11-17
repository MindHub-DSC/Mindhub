# 09-05 — Repositório TypeORM e providers

**Caso de uso:** UC03 — Publicar Serviço (épico [#35](https://github.com/MindHub-DSC/Mindhub/issues/35))
**Sub-Issue:** [#37](https://github.com/MindHub-DSC/Mindhub/issues/37)
**Branch:** `feature/37-uc03-persistir-servico`
**Data:** 17/11/2026

## 1. TDD da Fase 6

| Commit | Fase | Conteúdo |
| --- | --- | --- |
| `1290ff9` | RED | `test/unit/oferta/servicos.typeorm-repositorio.spec.ts` (queda de conexão → `ArmazenamentoIndisponivel`, 3 operações) e caso "registro corrompido" no teste de integração. Contrato: `ServicoMapper` e `RegistroDeServicoCorrompido` vazios |
| `33b8ace` | GREEN | Mapper (código no `09-04`) e adaptador |

```text
RED (1290ff9)
--- unit:
     × adicionar: queda de conexão vira ArmazenamentoIndisponivel 5ms
     × buscarPorId: queda de conexão vira ArmazenamentoIndisponivel 1ms
     × listarPorPerfil: queda de conexão vira ArmazenamentoIndisponivel 0ms
AssertionError: expected Error: ServicosTypeOrmRepositorio ainda n… to be an instance of ArmazenamentoIndisponivel
      Tests  3 failed (3)
--- integração:
      Tests  7 failed | 2 passed (9)

GREEN (33b8ace)
--- unit (falha de conexão):        Tests  3 passed (3)
--- integração (PostgreSQL):        Tests  9 passed (9)
build exit=0      lint sem avisos
```

## 2. Adaptador — `src/oferta/infra/servicos.typeorm-repositorio.ts`

```ts
import type { Repository } from 'typeorm';
import { traduzirFalhaDeConexao } from '../../compartilhado/infra/erros-de-banco.js';
import type { Servico } from '../dominio/servico.js';
import type { ServicosRepositorio } from '../dominio/servicos.repositorio.js';
import { ServicoMapper } from './servico.mapper.js';
import type { ServicoOrmEntity } from './servico.orm-entity.js';

/**
 * Adaptador TypeORM da porta ServicosRepositorio (#37).
 * Criado pelo OfertaModule por useFactory (padrão do UC02), sem decorators:
 * recebe o Repository<ServicoOrmEntity> já resolvido pelo TypeOrmModule.
 * Falhas de conexão viram ArmazenamentoIndisponivel; demais erros seguem.
 */
export class ServicosTypeOrmRepositorio implements ServicosRepositorio {
  constructor(private readonly orm: Repository<ServicoOrmEntity>) {}

  async adicionar(servico: Servico): Promise<void> {
    try {
      // insert, e não save: save faria UPDATE se o id já existisse.
      await this.orm.insert(ServicoMapper.paraOrm(servico));
    } catch (erro) {
      throw traduzirFalhaDeConexao(erro);
    }
  }

  async buscarPorId(id: string): Promise<Servico | null> {
    let registro: ServicoOrmEntity | null;
    try {
      registro = await this.orm.findOneBy({ id });
    } catch (erro) {
      throw traduzirFalhaDeConexao(erro);
    }
    return registro ? ServicoMapper.paraDominio(registro) : null;
  }

  async listarPorPerfil(perfilId: string): Promise<Servico[]> {
    let registros: ServicoOrmEntity[];
    try {
      // "ordem" (identity) dá a ordem de registro exigida pelo contrato.
      registros = await this.orm.find({
        where: { perfilId },
        order: { ordem: 'ASC' },
      });
    } catch (erro) {
      throw traduzirFalhaDeConexao(erro);
    }
    return registros.map((registro) => ServicoMapper.paraDominio(registro));
  }
}
```

| Exigência do material | Neste projeto |
| --- | --- |
| Implementa o contrato existente | `implements ServicosRepositorio` (`adicionar`, `buscarPorId`, `listarPorPerfil`), assinaturas inalteradas. O material usa `save(entity): Promise<Entity>`, que não é o contrato do projeto |
| `@Injectable()` / `@InjectRepository()` | **Não usados**, de propósito: o projeto cria adaptadores por `useFactory` no módulo (padrão do `PerfisEspecialistaTypeOrmRepositorio`), e a infraestrutura recebe o `Repository<ServicoOrmEntity>` já resolvido pelo `TypeOrmModule` |
| `Repository<ServicoOrmEntity>` completo | Sim |
| Mapper na entrada e na saída | `ServicoMapper.paraOrm` / `paraDominio` |
| Gravação | `insert`, e não `save`: `save` faria `UPDATE` se o id já existisse |
| Ordem | `find({ where: { perfilId }, order: { ordem: 'ASC' } })` |
| Erros | `traduzirFalhaDeConexao` (compartilhado com o UC02); outros erros seguem |
| ESM | Imports relativos com `.js`; `import type` para tipos |
| TypeORM fora da infra | Não: serviço de aplicação e controller continuam sem TypeORM |

## 3. Módulo — `src/oferta/oferta.module.ts` (commit `be24806`)

```ts
import { Module } from '@nestjs/common';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { IdentidadeModule } from '../identidade/identidade.module.js';
import {
  RECONHECIMENTO_DE_USUARIO,
  type ReconhecimentoDeUsuario,
} from '../identidade/publico/reconhecimento-de-usuario.js';
import { CadastrarPerfilEspecialista } from './aplicacao/cadastrar-perfil-especialista.js';
import { PublicarServico } from './aplicacao/publicar-servico.js';
import {
  PERFIS_ESPECIALISTA_REPOSITORIO,
  type PerfisEspecialistaRepositorio,
} from './dominio/perfis-especialista.repositorio.js';
import {
  SERVICOS_REPOSITORIO,
  type ServicosRepositorio,
} from './dominio/servicos.repositorio.js';
import { PerfisEspecialistaController } from './http/perfis-especialista.controller.js';
import { ServicosController } from './http/servicos.controller.js';
import { PerfilEspecialistaOrmEntity } from './infra/perfil-especialista.orm-entity.js';
import { PerfisEspecialistaTypeOrmRepositorio } from './infra/perfis-especialista.typeorm-repositorio.js';
import { ServicoOrmEntity } from './infra/servico.orm-entity.js';
import { ServicosTypeOrmRepositorio } from './infra/servicos.typeorm-repositorio.js';

/**
 * C2 — Oferta Profissional.
 * Liga as portas às implementações. Domínio e aplicação não conhecem o Nest:
 * são criados aqui por useFactory, recebendo só as interfaces.
 */
@Module({
  imports: [
    IdentidadeModule,
    TypeOrmModule.forFeature([PerfilEspecialistaOrmEntity, ServicoOrmEntity]),
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
      useFactory: (
        reconhecimento: ReconhecimentoDeUsuario,
        perfis: PerfisEspecialistaRepositorio,
      ) => new CadastrarPerfilEspecialista(reconhecimento, perfis),
      inject: [RECONHECIMENTO_DE_USUARIO, PERFIS_ESPECIALISTA_REPOSITORIO],
    },
    // #37: Serviços no PostgreSQL. ServicosEmMemoria continua disponível
    // para os testes sem banco, que sobrescrevem este provider.
    {
      provide: SERVICOS_REPOSITORIO,
      useFactory: (orm: Repository<ServicoOrmEntity>) =>
        new ServicosTypeOrmRepositorio(orm),
      inject: [getRepositoryToken(ServicoOrmEntity)],
    },
    {
      provide: PublicarServico,
      useFactory: (
        perfis: PerfisEspecialistaRepositorio,
        servicos: ServicosRepositorio,
      ) => new PublicarServico(perfis, servicos),
      inject: [PERFIS_ESPECIALISTA_REPOSITORIO, SERVICOS_REPOSITORIO],
    },
  ],
})
export class OfertaModule {}
```

Mudanças em relação ao Material 08: `ServicoOrmEntity` no `forFeature`; `SERVICOS_REPOSITORIO` passa de `useClass: ServicosEmMemoria` para `useFactory` com o adaptador TypeORM. O `ServicosEmMemoria` continua em `src/oferta/infra/` para os testes sem banco. A entidade também foi acrescentada a `ENTIDADES_ORM` (`src/database/opcoes-typeorm.ts`, commit `c819fc2`), usada pelo `AppModule`, pela CLI e pelos testes.

## 4. Preservação dos testes em memória (10.2)

Ao trocar o provider, o teste integrado do Material 08 quebrou, exatamente como o risco previsto no `08-07`:

```text
$ pnpm test
 FAIL  test/unit/oferta/servicos.integracao.spec.ts > POST /servicos — integração do backend (OfertaModule real, sem banco)
Error: Nest can't resolve dependencies of the ServicoOrmEntityRepository (?). Please make sure that the argument DataSource at index [0] is available in the TypeOrmModule module.
 Test Files  1 failed | 11 passed (12)
      Tests  106 passed | 4 skipped (110)
```

Causa: o `OfertaModule` passou a registrar `TypeOrmModule.forFeature([…, ServicoOrmEntity])`, que exige o `DataSource`. Correção **só na montagem** do teste (sem tocar em asserções):

```ts
      .overrideProvider(getRepositoryToken(ServicoOrmEntity))
      .useValue({})
      …
      .overrideProvider(SERVICOS_REPOSITORIO)
      .useValue(new ServicosEmMemoria())
```

```text
$ git diff -- …/servicos.integracao.spec.ts | grep -E "^[-+].*expect"
(nenhuma linha de expect alterada = asserções preservadas)
$ pnpm test      Test Files  12 passed (12)   Tests  110 passed (110)
$ pnpm test:e2e  Test Files  6 passed (6)     Tests  34 passed (34)
```

As 4 suítes continuam separadas:

| Suíte | Arquivo | Banco? |
| --- | --- | --- |
| Unitários do serviço (dublês em memória) | `publicar-servico.spec.ts` | Não |
| HTTP com serviço simulado | `servicos.http.spec.ts` | Não |
| Integrado em memória (Material 08) | `servicos.integracao.spec.ts` | Não (provider sobrescrito) |
| **Integração com PostgreSQL real** (Material 09) | `test/integracao/servicos.typeorm.spec.ts` | Sim, `mindhub_test` |

O E2E `test/e2e/servicos.e2e-spec.ts` passou a gravar Serviços no PostgreSQL de testes sem mudança no código (a limpeza já apaga os Serviços antes dos perfis).

## 5. Inicialização com o PostgreSQL de desenvolvimento

```text
$ taskkill //PID 11784 //F
  PID 11784 foi finalizado.
$ pnpm build
build exit=0
$ node dist/main.js
[Nest] 2716  - 17/11/2026, 15:57:22     LOG [InstanceLoader] TypeOrmModule dependencies initialized +41ms
[Nest] 2716  - 17/11/2026, 15:57:22     LOG [InstanceLoader] AppModule dependencies initialized +0ms
[Nest] 2716  - 17/11/2026, 15:57:22     LOG [InstanceLoader] TypeOrmCoreModule dependencies initialized +34ms
[Nest] 2716  - 17/11/2026, 15:57:22     LOG [InstanceLoader] TypeOrmModule dependencies initialized +0ms
[Nest] 2716  - 17/11/2026, 15:57:22     LOG [InstanceLoader] TypeOrmModule dependencies initialized +1ms
[Nest] 2716  - 17/11/2026, 15:57:22     LOG [InstanceLoader] IdentidadeModule dependencies initialized +0ms
[Nest] 2716  - 17/11/2026, 15:57:22     LOG [InstanceLoader] OfertaModule dependencies initialized +1ms
[Nest] 2716  - 17/11/2026, 15:57:22     LOG [RoutesResolver] ServicosController {/servicos}: +0ms
[Nest] 2716  - 17/11/2026, 15:57:22     LOG [RouterExplorer] Mapped {/servicos, POST} route +1ms
[Nest] 2716  - 17/11/2026, 15:57:22     LOG [NestApplication] Nest application successfully started +1ms
```

O `OfertaModule` inicializou sem erro de injeção: o `getRepositoryToken(ServicoOrmEntity)` foi resolvido pelo `TypeOrmModule` e o `SERVICOS_REPOSITORIO` pelo `useFactory`. A Fase 8 (`09-06`) mostra que o token resolve para o adaptador TypeORM: os Serviços publicados aparecem na tabela.
