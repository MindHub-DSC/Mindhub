# 07-06 — Testes HTTP

**Caso de uso:** UC03 — Publicar Serviço (épico [#35](https://github.com/MindHub-DSC/Mindhub/issues/35))
**Sub-Issue:** [#40](https://github.com/MindHub-DSC/Mindhub/issues/40). Os testes HTTP fazem parte do escopo da própria #40; o UC03 não tem Sub-Issue separada de testes.
**Branch:** `feature/40-uc03-endpoint-publicar-servico`
**Data:** 17/11/2026

## 1. Arquivos, framework e ferramentas

| Arquivo | Nível | Ferramentas |
| --- | --- | --- |
| `mindhub-backend/test/unit/oferta/servicos.http.spec.ts` | Fronteira HTTP com serviço simulado | Vitest 4.1.11 (`vi.fn()`), `@nestjs/testing`, Supertest 7 |
| `mindhub-backend/test/e2e/servicos.e2e-spec.ts` | E2E: PostgreSQL de teste para usuários e perfis, Serviços em memória | Vitest (config E2E), Supertest, `iniciarAppDeTeste` |

Ambiente conferido antes de escrever: `supertest` e `@types/supertest` instalados; runner Vitest com `globals: true`; só `vi.fn()`, nenhum `jest.fn()`.

## 2. Cenários

### Refinamento 3 (obrigatórios)

| Teste | O que verifica |
| --- | --- |
| **Teste 1**: requisição válida | Status **201**; `executar` chamado **1 vez** e **com o corpo recebido**; corpo da resposta com os nomes exatos do contrato (`id`, `perfilId`, `titulo`, `descricao`, `modeloContratacao`, `condicoes`, `situacao`) |
| **Teste 2**: entrada inválida (6 variações) | Status **400**, `error: "Bad Request"` e **`expect(publicarServico.executar).not.toHaveBeenCalled()`**. Variações: campo não previsto, `usuarioId` fora do formato, título que não é texto, modelo desconhecido, condição com tipo errado, corpo vazio |

### Complementares (critérios 3 a 5 da #40)

| Teste | Verifica |
| --- | --- |
| Tradução de erros (5 variações) | `AtorSemPerfil` → 404, `PerfilSuspenso` → 403, `CondicoesVigentesAusentes` → 422, `ServicoInvalido` → 400, todos com a mensagem do erro; `ArmazenamentoIndisponivel` → 503 com mensagem genérica |
| E2E 1 | Jornada UC01 → UC02 → UC03: usuário e perfil `ATIVO` criados pela API; Serviço publicado com 201 e `perfilId` igual ao id do perfil gravado no PostgreSQL |
| E2E 2 | Com a aplicação real: usuário sem perfil → 404; Reserva Direta sem condições → 422 |

### Contexto de teste (12.3)

- `Test.createTestingModule({ controllers: [ServicosController], providers: [{ provide: PublicarServico, useValue: publicarServico }] })`.
- `app.useGlobalPipes(new StandardSchemaValidationPipe())` e `app.useGlobalFilters(new ArmazenamentoIndisponivelFilter())`: reproduzem o `APP_PIPE` e o `APP_FILTER` do `AppModule`. O projeto valida com zod, não com `ValidationPipe`.
- `await app.init()` no `beforeAll`; `mockReset()` no `beforeEach`; `await app.close()` no `afterAll`.

## 3. Código — `test/unit/oferta/servicos.http.spec.ts`

```ts
import { randomUUID } from 'node:crypto';
import { StandardSchemaValidationPipe } from '@nestjs/common';
import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import type { App } from 'supertest/types.js';
import { ArmazenamentoIndisponivelFilter } from '../../../src/compartilhado/http/armazenamento-indisponivel.filter.js';
import { ArmazenamentoIndisponivel } from '../../../src/compartilhado/infra/erros-de-banco.js';
import {
  AtorSemPerfil,
  PerfilSuspenso,
  PublicarServico,
} from '../../../src/oferta/aplicacao/publicar-servico.js';
import {
  CondicoesVigentesAusentes,
  ServicoInvalido,
} from '../../../src/oferta/dominio/erros.js';
import { Servico } from '../../../src/oferta/dominio/servico.js';
import { ServicosController } from '../../../src/oferta/http/servicos.controller.js';

/**
 * Fronteira HTTP do UC03 (#40) com o serviço de aplicação simulado:
 * roteamento, schema + pipe, serialização, delegação e tradução de erros.
 * Não usa banco nem o PublicarServico real.
 */
describe('POST /servicos (fronteira HTTP, serviço simulado)', () => {
  let app: INestApplication<App>;
  const publicarServico = { executar: vi.fn() };

  const usuarioId = randomUUID();
  const corpoValido = {
    usuarioId,
    titulo: 'Mentoria de produto',
    descricao: 'Sessões de discovery',
    modeloContratacao: 'RESERVA_DIRETA',
    condicoes: {
      preco: 15000,
      moeda: 'BRL',
      duracaoMinutos: 60,
      modalidade: 'ONLINE',
    },
  };

  beforeAll(async () => {
    const modulo = await Test.createTestingModule({
      controllers: [ServicosController],
      providers: [{ provide: PublicarServico, useValue: publicarServico }],
    }).compile();
    app = modulo.createNestApplication<INestApplication<App>>();
    // Reproduz o que o AppModule registra globalmente (APP_PIPE e APP_FILTER).
    app.useGlobalPipes(new StandardSchemaValidationPipe());
    app.useGlobalFilters(new ArmazenamentoIndisponivelFilter());
    await app.init();
  });

  beforeEach(() => {
    publicarServico.executar.mockReset();
  });

  afterAll(async () => {
    await app.close();
  });

  function publicar(corpo: object) {
    return request(app.getHttpServer()).post('/servicos').send(corpo);
  }

  // Teste 1 (Refinamento 3) — critério 1 da #40.
  it('requisição válida: 201, delega ao serviço e devolve o Serviço publicado', async () => {
    const servico = Servico.publicar({
      perfilId: randomUUID(),
      titulo: corpoValido.titulo,
      descricao: corpoValido.descricao,
      modeloContratacao: 'RESERVA_DIRETA',
      condicoes: corpoValido.condicoes,
      agora: new Date(),
    });
    publicarServico.executar.mockResolvedValue(servico);

    const resposta = await publicar(corpoValido).expect(201);

    expect(publicarServico.executar).toHaveBeenCalledTimes(1);
    expect(publicarServico.executar).toHaveBeenCalledWith(corpoValido);
    expect(resposta.body).toEqual({
      id: servico.id,
      perfilId: servico.perfilId,
      titulo: 'Mentoria de produto',
      descricao: 'Sessões de discovery',
      modeloContratacao: 'RESERVA_DIRETA',
      condicoes: corpoValido.condicoes,
      situacao: 'PUBLICADO',
    });
  });

  // Teste 2 (Refinamento 3) — critério 2 da #40 (FE-01).
  it.each([
    ['campo não previsto', { ...corpoValido, situacao: 'PUBLICADO' }],
    ['usuarioId fora do formato', { ...corpoValido, usuarioId: 'abc' }],
    ['título não é texto', { ...corpoValido, titulo: 123 }],
    ['modelo desconhecido', { ...corpoValido, modeloContratacao: 'LEILAO' }],
    [
      'condição com tipo errado',
      { ...corpoValido, condicoes: { ...corpoValido.condicoes, preco: '150' } },
    ],
    ['corpo vazio', {}],
  ])(
    'entrada inválida (%s): 400 sem chamar o serviço',
    async (_caso, corpo) => {
      const resposta = await publicar(corpo).expect(400);

      expect(resposta.body.statusCode).toBe(400);
      expect(resposta.body.error).toBe('Bad Request');
      expect(publicarServico.executar).not.toHaveBeenCalled();
    },
  );

  // Critérios 3 e 4 da #40 (D-UC03-07): códigos distintos e estáveis.
  it.each([
    ['ator sem perfil', new AtorSemPerfil(), 404],
    ['perfil suspenso', new PerfilSuspenso(), 403],
    ['Reserva Direta sem condições', new CondicoesVigentesAusentes(), 422],
    [
      'dado de domínio inválido',
      new ServicoInvalido('O título: informe ao menos 1 caractere.'),
      400,
    ],
    [
      'armazenamento indisponível',
      new ArmazenamentoIndisponivel({ cause: new Error('ECONNREFUSED') }),
      503,
    ],
  ])('%s → responde com o status mapeado', async (_caso, erro, status) => {
    publicarServico.executar.mockRejectedValue(erro);

    const resposta = await publicar(corpoValido).expect(status);

    expect(resposta.body.statusCode).toBe(status);
    expect(typeof resposta.body.message).toBe('string');
    // 503 usa mensagem genérica, sem detalhes da infraestrutura.
    expect(resposta.body.message).toBe(
      status === 503
        ? 'Serviço temporariamente indisponível. Tente novamente.'
        : erro.message,
    );
  });
});
```

## 4. Código — `test/e2e/servicos.e2e-spec.ts`

```ts
import { randomUUID } from 'node:crypto';
import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import type { App } from 'supertest/types.js';
import type { DataSource } from 'typeorm';
import { iniciarAppDeTeste } from '../support/app-de-teste.js';
import { limparDadosDosUsuarios } from '../support/limpeza.js';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

/**
 * UC03 — POST /servicos de ponta a ponta (critério 5 da #40):
 * UC01 cria o usuário, UC02 cria o perfil ATIVO no PostgreSQL e o UC03
 * publica o Serviço. Os Serviços ainda ficam em memória (#37 pendente).
 */
describe('UC03 — Publicar Serviço (E2E, jornada UC01 → UC02 → UC03)', () => {
  let app: INestApplication<App>;
  let banco: DataSource;
  const usuariosDoTeste: string[] = [];

  beforeAll(async () => {
    ({ app, banco } = await iniciarAppDeTeste());
  });

  afterEach(async () => {
    await limparDadosDosUsuarios(banco, usuariosDoTeste.splice(0));
  });

  afterAll(async () => {
    await app.close();
  });

  async function prepararEspecialista(): Promise<string> {
    const usuario = await request(app.getHttpServer())
      .post('/usuarios')
      .send({ nome: 'Ana', email: `e2e-${randomUUID()}@exemplo.test` })
      .expect(201);
    usuariosDoTeste.push(usuario.body.id);
    const perfil = await request(app.getHttpServer())
      .post('/especialistas')
      .send({
        usuarioId: usuario.body.id,
        descricao: 'Consultora de produto',
        especialidades: ['Discovery'],
      })
      .expect(201);
    expect(perfil.body.situacao).toBe('ATIVO');
    return usuario.body.id;
  }

  function publicar(corpo: object) {
    return request(app.getHttpServer()).post('/servicos').send(corpo);
  }

  it('especialista com perfil ATIVO publica Serviço em Reserva Direta (201)', async () => {
    const usuarioId = await prepararEspecialista();
    const [perfil] = await banco.query(
      'SELECT id FROM oferta.perfis_especialista WHERE usuario_id = $1',
      [usuarioId],
    );

    const resposta = await publicar({
      usuarioId,
      titulo: 'Mentoria de produto',
      descricao: 'Sessões de discovery',
      modeloContratacao: 'RESERVA_DIRETA',
      condicoes: {
        preco: 15000,
        moeda: 'BRL',
        duracaoMinutos: 60,
        modalidade: 'ONLINE',
      },
    }).expect(201);

    expect(resposta.body.id).toMatch(UUID);
    expect(resposta.body.perfilId).toBe(perfil.id);
    expect(resposta.body.modeloContratacao).toBe('RESERVA_DIRETA');
    expect(resposta.body.condicoes).toEqual({
      preco: 15000,
      moeda: 'BRL',
      duracaoMinutos: 60,
      modalidade: 'ONLINE',
    });
    expect(resposta.body.situacao).toBe('PUBLICADO');
  });

  it('usuário sem perfil recebe 404 e Reserva Direta sem condições recebe 422', async () => {
    const usuarioId = await prepararEspecialista();

    await publicar({
      usuarioId: randomUUID(),
      titulo: 'Mentoria',
      descricao: 'Discovery',
      modeloContratacao: 'SOB_PROPOSTA',
    }).expect(404);

    await publicar({
      usuarioId,
      titulo: 'Mentoria',
      descricao: 'Discovery',
      modeloContratacao: 'RESERVA_DIRETA',
    }).expect(422);
  });
});
```

## 5. Execuções

### Teste HTTP isolado

```text
$ pnpm exec vitest run test/unit/oferta/servicos.http.spec.ts --reporter=verbose
[Nest] 15188  - 17/11/2026, 14:46:09   ERROR [Armazenamento] Banco indisponível: ECONNREFUSED
 ✓ … > requisição válida: 201, delega ao serviço e devolve o Serviço publicado 40ms
 ✓ … > entrada inválida (campo não previsto): 400 sem chamar o serviço 7ms
 ✓ … > entrada inválida (usuarioId fora do formato): 400 sem chamar o serviço 5ms
 ✓ … > entrada inválida (título não é texto): 400 sem chamar o serviço 4ms
 ✓ … > entrada inválida (modelo desconhecido): 400 sem chamar o serviço 4ms
 ✓ … > entrada inválida (condição com tipo errado): 400 sem chamar o serviço 3ms
 ✓ … > entrada inválida (corpo vazio): 400 sem chamar o serviço 4ms
 ✓ … > ator sem perfil → responde com o status mapeado 3ms
 ✓ … > perfil suspenso → responde com o status mapeado 3ms
 ✓ … > Reserva Direta sem condições → responde com o status mapeado 3ms
 ✓ … > dado de domínio inválido → responde com o status mapeado 7ms
 ✓ … > armazenamento indisponível → responde com o status mapeado 6ms
 Test Files  1 passed (1)
      Tests  12 passed (12)
   Start at  14:46:08
   Duration  1.01s (transform 99ms, setup 0ms, import 600ms, tests 230ms, environment 0ms)
```

`…` = `test/unit/oferta/servicos.http.spec.ts > POST /servicos (fronteira HTTP, serviço simulado)`. A linha `ERROR [Armazenamento]` é o log esperado do filtro de 503 no último cenário.

A primeira versão do arquivo também passou (12/12), mas com dois defeitos corrigidos antes desta execução: o título usava `%i` para um objeto (aparecia `NaN`) e o `ArmazenamentoIndisponivel` era construído com um `Error` em vez de `{ cause }`.

### Verificação por mutação

Os testes foram escritos depois do código (o Material 07 não pede RED nesta fase). Para descartar falso positivo, o controller foi alterado de propósito (filtro desligado e título trocado na delegação) e restaurado em seguida:

```text
--- mutação: sem filtro e delegando título trocado
     × requisição válida: 201, delega ao serviço e devolve o Serviço publicado 59ms
     × ator sem perfil → responde com o status mapeado 8ms
     × perfil suspenso → responde com o status mapeado 13ms
     × Reserva Direta sem condições → responde com o status mapeado 13ms
     × dado de domínio inválido → responde com o status mapeado 6ms
      Tests  5 failed | 7 passed (12)
```

Depois de restaurar: `Tests  12 passed (12)`. Os 6 casos de 400 e o de 503 continuaram passando porque a mutação não tocou a validação nem o filtro global.

### E2E (PostgreSQL de teste)

```text
$ pnpm exec vitest run --config ./vitest.config.e2e.ts test/e2e/servicos.e2e-spec.ts --reporter=verbose
 ✓ … > especialista com perfil ATIVO publica Serviço em Reserva Direta (201) 122ms
 ✓ … > usuário sem perfil recebe 404 e Reserva Direta sem condições recebe 422 45ms
 Test Files  1 passed (1)
      Tests  2 passed (2)
   Duration  2.18s (transform 296ms, setup 95ms, import 1.02s, tests 418ms, environment 0ms)

$ pnpm test:e2e
 Test Files  5 passed (5)
      Tests  25 passed (25)
   Start at  14:46:45
   Duration  6.73s (transform 375ms, setup 412ms, import 3.16s, tests 1.52s, environment 0ms)
```

### Testes unitários anteriores (domínio e aplicação)

```text
$ pnpm exec vitest run test/unit/oferta/servico.spec.ts test/unit/oferta/publicar-servico.spec.ts
 Test Files  2 passed (2)
      Tests  33 passed (33)
   Duration  407ms (transform 137ms, setup 0ms, import 197ms, tests 20ms, environment 0ms)
```

### Suíte unitária completa, lint e build

```text
$ pnpm test
 Test Files  9 passed (9)
      Tests  92 passed (92)
   Start at  14:47:02
   Duration  1.60s (transform 759ms, setup 0ms, import 2.13s, tests 351ms, environment 2ms)
$ pnpm lint   → 0 avisos
$ pnpm build  → build exit=0
```

## 6. Regressões

| Suíte | Antes desta fase | Depois |
| --- | --- | --- |
| `pnpm test` (unitários) | 8 arquivos, 80 testes (`07-04`) | 9 arquivos, **92** (+12 HTTP), 0 falhas |
| `pnpm test:e2e` (integração + E2E) | Não executada antes desta fase nesta sessão | 5 arquivos, **25**, 0 falhas (inclui os 2 novos do UC03 e as suítes existentes de UC01/UC02) |

Nenhum teste anterior foi alterado nesta fase.

## 7. Níveis de teste

| Nível | Neste projeto | Comprova |
| --- | --- | --- |
| Unitário de controller (método chamado direto) | Não usado | — |
| **Fronteira HTTP com serviço simulado** | `servicos.http.spec.ts` | Rota, schema + pipe, serialização JSON, status codes, delegação e tradução de erros. Não executa regra de negócio |
| Unitário de domínio e aplicação | `servico.spec.ts`, `publicar-servico.spec.ts` | Invariantes do Serviço e regras do caso de uso (RN01), com dublês em memória |
| **E2E** | `servicos.e2e-spec.ts` | Jornada real HTTP → aplicação → domínio → PostgreSQL (perfis) |
| Integração com persistência real **dos Serviços** | Não existe | Fica para a #37 (TypeORM) |

## 8. Limitações e pendências

- Os testes HTTP verdes comprovam a fronteira; **não** substituem a persistência real dos Serviços (#37), que hoje ficam em memória.
- O 403 (perfil suspenso) não aparece no E2E: não existe operação de suspender perfil pela API (UC18). Está coberto no teste com serviço simulado e no unitário da #38.
- Concorrência (FE-06) é da #39.
