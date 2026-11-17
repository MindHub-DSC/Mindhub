# 08-05 — Testes integrados e evidência de armazenamento

**Caso de uso:** UC03 — Publicar Serviço (épico [#35](https://github.com/MindHub-DSC/Mindhub/issues/35))
**Sub-Issue:** [#40](https://github.com/MindHub-DSC/Mindhub/issues/40) (o UC03 não tem Sub-Issue separada de testes; os testes HTTP são escopo da #40)
**Branch:** `feature/40-uc03-endpoint-publicar-servico`
**Data:** 17/11/2026

## 1. Objetivo

Exercitar o fluxo **HTTP → `ServicosController` → `PublicarServico` → `SERVICOS_REPOSITORIO` → `ServicosEmMemoria`** com os componentes reais resolvidos pelo `OfertaModule`, sem mocks de serviço nem de repositório de Serviços, e observar o estado do repositório depois de cada requisição.

## 2. Verificações antes da implementação (10.2)

| Item | Verificado |
| --- | --- |
| Convenção | `*.spec.ts` em `test/unit/` roda no `pnpm test` sem banco; `*.e2e-spec.ts` é só para PostgreSQL |
| Runner | `vitest.config.ts`: `include: ['test/unit/**/*.spec.ts']`, `globals: true` (sem import de `describe`/`it`/`expect`, como nos demais testes) |
| TypeScript | `module`/`moduleResolution: nodenext`, imports com `.js`, `experimentalDecorators` e `emitDecoratorMetadata` ligados |
| Supertest | `supertest` ^7 e `@types/supertest` ^7; import `request from 'supertest'` como no `servicos.http.spec.ts` |
| Módulo e providers | `OfertaModule` (ver `08-03`) e viabilidade da composição sem banco comprovada pela sonda |
| Validação | `StandardSchemaValidationPipe` global (`APP_PIPE`) — reproduzido no teste |
| Branch / Sub-Issue | `feature/40-uc03-endpoint-publicar-servico` / #40 |

## 3. Arquivo e componentes

**Arquivo:** `mindhub-backend/test/unit/oferta/servicos.integracao.spec.ts` (único e consolidado).

| Componente | Real ou trocado |
| --- | --- |
| `OfertaModule` | Real (`imports: [OfertaModule]`) |
| `ServicosController`, `publicarServicoSchema`, `ErrosDePublicacaoFilter` | Reais |
| `PublicarServico` | **Real** (criado pelo `useFactory` do módulo) |
| `SERVICOS_REPOSITORIO` → `ServicosEmMemoria` | **Real** (`useClass` do módulo) |
| `StandardSchemaValidationPipe`, `ArmazenamentoIndisponivelFilter` | Reais, registrados como no `AppModule` |
| `getRepositoryToken(PerfilEspecialistaOrmEntity)`, `getRepositoryToken(UsuarioOrmEntity)` | Trocados por `{}`: só alimentam fábricas de adaptadores TypeORM que este fluxo não executa |
| `PERFIS_ESPECIALISTA_REPOSITORIO` (UC02) | Trocado pela implementação em memória do UC02 (*fake* que cumpre a suíte de contrato), com um perfil `ATIVO` |

## 4. Código completo

```ts
import { StandardSchemaValidationPipe } from '@nestjs/common';
import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import request from 'supertest';
import type { App } from 'supertest/types.js';
import { ArmazenamentoIndisponivelFilter } from '../../../src/compartilhado/http/armazenamento-indisponivel.filter.js';
import { UsuarioOrmEntity } from '../../../src/identidade/infra/usuario.orm-entity.js';
import { PublicarServico } from '../../../src/oferta/aplicacao/publicar-servico.js';
import { PerfilEspecialista } from '../../../src/oferta/dominio/perfil-especialista.js';
import { PERFIS_ESPECIALISTA_REPOSITORIO } from '../../../src/oferta/dominio/perfis-especialista.repositorio.js';
import { SERVICOS_REPOSITORIO } from '../../../src/oferta/dominio/servicos.repositorio.js';
import { PerfilEspecialistaOrmEntity } from '../../../src/oferta/infra/perfil-especialista.orm-entity.js';
import { ServicosEmMemoria } from '../../../src/oferta/infra/servicos.em-memoria.js';
import { OfertaModule } from '../../../src/oferta/oferta.module.js';
import { PerfisEspecialistaEmMemoria } from '../../support/perfis-especialista.em-memoria.js';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

/**
 * Teste integrado do backend do UC03 (Material 08, #40):
 * HTTP → ServicosController → PublicarServico → SERVICOS_REPOSITORIO →
 * ServicosEmMemoria, todos REAIS e resolvidos pelo OfertaModule.
 *
 * Nenhum mock de serviço ou de repositório de Serviços. Só o que depende do
 * PostgreSQL (fora do escopo do UC03 nesta etapa) é trocado:
 * - os dois tokens de repositório TypeORM, lidos apenas pelas fábricas dos
 *   adaptadores TypeORM, que este fluxo não usa;
 * - a porta de perfis (UC02), pela implementação em memória que cumpre a
 *   mesma suíte de contrato do adaptador TypeORM.
 */
describe('POST /servicos — integração do backend (OfertaModule real, sem banco)', () => {
  let app: INestApplication<App>;
  let servicos: ServicosEmMemoria;
  let perfilAtivo: PerfilEspecialista;

  beforeAll(async () => {
    const perfis = new PerfisEspecialistaEmMemoria();
    perfilAtivo = PerfilEspecialista.cadastrar({
      usuarioId: '7b1e2c55-3a4d-4f6e-8a9b-0c1d2e3f4a5b',
      descricao: 'Consultora de produto',
      especialidades: ['Discovery'],
      agora: new Date('2026-11-17T12:00:00.000Z'),
    });
    await perfis.adicionar(perfilAtivo);

    const modulo = await Test.createTestingModule({
      imports: [OfertaModule],
    })
      .overrideProvider(getRepositoryToken(PerfilEspecialistaOrmEntity))
      .useValue({})
      .overrideProvider(getRepositoryToken(UsuarioOrmEntity))
      .useValue({})
      .overrideProvider(PERFIS_ESPECIALISTA_REPOSITORIO)
      .useValue(perfis)
      .compile();

    app = modulo.createNestApplication<INestApplication<App>>();
    // Mesma configuração global do AppModule (APP_PIPE e APP_FILTER).
    app.useGlobalPipes(new StandardSchemaValidationPipe());
    app.useGlobalFilters(new ArmazenamentoIndisponivelFilter());
    await app.init();

    // O MESMO provider que o container injetou no PublicarServico.
    servicos = modulo.get<ServicosEmMemoria>(SERVICOS_REPOSITORIO);
  });

  afterAll(async () => {
    await app?.close();
  });

  function publicar(corpo: object) {
    return request(app.getHttpServer()).post('/servicos').send(corpo);
  }

  it('compõe o fluxo com os componentes reais do módulo', () => {
    expect(app.get(PublicarServico)).toBeInstanceOf(PublicarServico);
    expect(servicos).toBeInstanceOf(ServicosEmMemoria);
  });

  it('cenário válido: 201, devolve o Serviço e o registra no repositório em memória', async () => {
    const corpo = {
      usuarioId: perfilAtivo.usuarioId,
      titulo: 'Mentoria de produto',
      descricao: 'Sessões de discovery para times iniciantes',
      modeloContratacao: 'RESERVA_DIRETA',
      condicoes: {
        preco: 15000,
        moeda: 'BRL',
        duracaoMinutos: 60,
        modalidade: 'ONLINE',
      },
    };
    const antes = servicos.chamadasDeAdicionar;

    const resposta = await publicar(corpo).expect(201);

    // Resposta HTTP: identificador gerado e dados preservados.
    expect(resposta.body.id).toMatch(UUID);
    expect(resposta.body).toEqual({
      id: resposta.body.id,
      perfilId: perfilAtivo.id,
      titulo: corpo.titulo,
      descricao: corpo.descricao,
      modeloContratacao: 'RESERVA_DIRETA',
      condicoes: corpo.condicoes,
      situacao: 'PUBLICADO',
    });

    // Armazenamento: leitura pelo contrato da porta, no provider real.
    expect(servicos.chamadasDeAdicionar).toBe(antes + 1);
    const registrado = await servicos.buscarPorId(resposta.body.id);
    expect(registrado?.perfilId).toBe(perfilAtivo.id);
    expect(registrado?.titulo).toBe(corpo.titulo);
    expect(registrado?.condicoes).toEqual(corpo.condicoes);
    expect(registrado?.situacao).toBe('PUBLICADO');
    const doPerfil = await servicos.listarPorPerfil(perfilAtivo.id);
    expect(doPerfil.map((s) => s.id)).toContain(resposta.body.id);
  });

  it('cenário inválido: 400 na fronteira e nada registrado', async () => {
    const antes = servicos.chamadasDeAdicionar;
    const totalAntes = (await servicos.listarPorPerfil(perfilAtivo.id)).length;

    const resposta = await publicar({
      usuarioId: perfilAtivo.usuarioId,
      titulo: 'Mentoria',
      descricao: 'Discovery',
      modeloContratacao: 'SOB_PROPOSTA',
      preco: 100,
    }).expect(400);

    expect(resposta.body.statusCode).toBe(400);
    expect(resposta.body.error).toBe('Bad Request');
    expect(resposta.body.message).toEqual(['Unrecognized key: "preco"']);
    expect(servicos.chamadasDeAdicionar).toBe(antes);
    expect(await servicos.listarPorPerfil(perfilAtivo.id)).toHaveLength(
      totalAntes,
    );
  });

  it('recusa de domínio pelo serviço real: 422 e nada registrado', async () => {
    const antes = servicos.chamadasDeAdicionar;

    const resposta = await publicar({
      usuarioId: perfilAtivo.usuarioId,
      titulo: 'Mentoria',
      descricao: 'Discovery',
      modeloContratacao: 'RESERVA_DIRETA',
    }).expect(422);

    expect(resposta.body.message).toBe(
      'Reserva Direta exige condições vigentes: preço, moeda, duração e modalidade.',
    );
    expect(servicos.chamadasDeAdicionar).toBe(antes);
  });
});
```

## 5. Cenários

| Teste | Comprova |
| --- | --- |
| Composição | O container entregou o `PublicarServico` real e o `ServicosEmMemoria` real |
| **Válido** | Rota disponível; corpo aceito; 201; `id` UUID gerado; dados preservados; `perfilId` do perfil encontrado pelo serviço real; **1 chamada a `adicionar`** e o Serviço **lido de volta** do provider real (`buscarPorId`, `listarPorPerfil`) |
| **Inválido** | Campo não previsto → 400 com a mensagem do zod; **nenhuma** chamada a `adicionar`; lista do perfil inalterada. Comprova a fronteira, não as regras do domínio |
| Recusa de domínio (extra) | O serviço real chama o domínio: Reserva Direta sem condições → 422; nada registrado. É algo que o nível B não consegue verificar, porque lá o serviço é simulado |

## 6. Execuções

### Teste integrado

```text
$ pnpm exec vitest run test/unit/oferta/servicos.integracao.spec.ts --reporter=verbose
 RUN  v4.1.11 C:/Users/leonardo/Desktop/DSC/Mindhub/mindhub-backend
 ✓ … > compõe o fluxo com os componentes reais do módulo 4ms
 ✓ … > cenário válido: 201, devolve o Serviço e o registra no repositório em memória 82ms
 ✓ … > cenário inválido: 400 na fronteira e nada registrado 14ms
 ✓ … > recusa de domínio pelo serviço real: 422 e nada registrado 10ms
 Test Files  1 passed (1)
      Tests  4 passed (4)
   Start at  15:07:01
   Duration  2.60s (transform 311ms, setup 0ms, import 1.93s, tests 397ms, environment 0ms)
```

`…` = `test/unit/oferta/servicos.integracao.spec.ts > POST /servicos — integração do backend (OfertaModule real, sem banco)`.

### Mutação: o serviço deixa de gravar

Para mostrar o que este nível acrescenta, a linha `await this.servicos.adicionar(servico);` de `publicar-servico.ts` foi comentada temporariamente e depois restaurada com `git checkout`:

```text
--- mutação:
-    await this.servicos.adicionar(servico);
+    // await this.servicos.adicionar(servico);
--- nível C (integrado):
     × cenário válido: 201, devolve o Serviço e o registra no repositório em memória 66ms
AssertionError: expected +0 to be 1 // Object.is equality
      Tests  1 failed | 3 passed (4)
--- nível B (HTTP com serviço simulado):
      Tests  12 passed (12)
--- publicar-servico.ts restaurado
```

O teste HTTP do Material 07 continuou **verde** com um serviço que não grava nada; o integrado **falhou**. É a conclusão do `08-02` comprovada na prática. (O unitário do serviço, nível A, também detectaria essa mutação, mas sem passar por HTTP nem pelo módulo.)

### Testes anteriores e suítes completas

```text
$ pnpm exec vitest run test/unit/oferta/publicar-servico.spec.ts
 Test Files  1 passed (1)
      Tests  6 passed (6)
   Start at  15:07:27
   Duration  366ms (transform 83ms, setup 0ms, import 109ms, tests 8ms, environment 0ms)

$ pnpm exec vitest run test/unit/oferta/servicos.http.spec.ts
 Test Files  1 passed (1)
      Tests  12 passed (12)
   Start at  15:07:29
   Duration  1.34s (transform 121ms, setup 0ms, import 802ms, tests 297ms, environment 0ms)

$ pnpm test
 Test Files  10 passed (10)
      Tests  96 passed (96)
   Start at  15:07:31
   Duration  2.74s (transform 967ms, setup 0ms, import 4.92s, tests 789ms, environment 3ms)

$ pnpm test:e2e
 Test Files  5 passed (5)
      Tests  25 passed (25)
   Start at  15:07:34
   Duration  7.80s (transform 362ms, setup 448ms, import 3.62s, tests 1.86s, environment 1ms)

$ pnpm lint   → 0 avisos
$ pnpm build  → build exit=0
```

## 7. Comparação com a linha de base (`08-01`)

| Suíte | Linha de base | Agora | Diferença |
| --- | --- | --- | --- |
| `pnpm test` | 9 arquivos, 92 testes | 10 arquivos, **96** testes | +1 arquivo, +4 testes (o integrado); 0 falhas |
| `pnpm test:e2e` | 5 arquivos, 25 testes | 5 arquivos, 25 testes | Igual; 0 falhas |

Nenhum teste anterior foi alterado. Nenhum arquivo de produção foi alterado (a mutação foi revertida).

## 8. Delimitação da evidência de armazenamento (Fase 8)

| Pergunta | Resposta |
| --- | --- |
| A resposta 201 com `id` prova o armazenamento? | **Não sozinha.** Prova que o fluxo terminou e devolveu o Serviço criado (`08-04`) |
| O que foi inspecionado? | O **provider real** obtido do container (`modulo.get(SERVICOS_REPOSITORIO)`), que é a mesma instância injetada no `PublicarServico` (provider singleton do módulo) |
| Por quais meios? | (a) Métodos **do contrato** da porta, `buscarPorId` e `listarPorPerfil`, que já existiam (critério 6 da #36, consumidos pela #37 e pelo UC04), não criados para o teste; (b) o contador público `chamadasDeAdicionar`, mecanismo que a classe em memória já tinha e que os testes unitários já usam |
| A coleção interna foi acessada? | **Não.** `registros` continua `private readonly`; nenhum cast, nenhum acesso por índice |
| Foi criado algum endpoint ou método novo? | **Não.** Nenhum `GET`, nenhum método novo na interface, nenhuma mudança em `ServicosEmMemoria` |
| O que fica comprovado | Depois do 201, o repositório real tem **exatamente uma** gravação nova, e esse Serviço pode ser lido de volta com os mesmos dados. Depois do 400 e do 422, **nenhuma** gravação |
| O que **não** fica comprovado | Durabilidade (some ao fim do processo), gravação em banco, transações e constraints SQL (#37) |

A leitura via `buscarPorId` passa por `Servico.reconstituir`, ou seja, ela compara o Serviço **reconstituído a partir do que foi guardado**, não a mesma referência de objeto. Isso é mais forte que comparar referências: mostra que os dados copiados na gravação (`paraDados`) bastam para refazer o agregado.

## 9. Limitações e pendências

- A porta de **perfis** é o *fake* em memória; a combinação com o adaptador TypeORM real continua coberta só pelo E2E (`servicos.e2e-spec.ts`).
- 403 (perfil suspenso) não foi incluído: dependeria de um perfil `SUSPENSO` no *fake*. É coberto nos níveis A e B.
- O arquivo ainda não foi commitado (Fase 11).
