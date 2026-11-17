# 06-01 — Diagnóstico do estado GREEN

**Caso de uso:** UC03 — Publicar Serviço (épico [#35](https://github.com/MindHub-DSC/Mindhub/issues/35))
**Sub-Issue:** [#36](https://github.com/MindHub-DSC/Mindhub/issues/36) — [UC03-SUB-01] [C2] Modelar o Serviço e suas condições vigentes
**Responsável:** Leonardo Herrero S. Martins (@leohsm)
**Data:** 17/11/2026
**Fontes:** `05-01` a `05-08` desta pasta; branch `feature/36-uc03-modelar-servico` @ `db56884`; PR [#131](https://github.com/MindHub-DSC/Mindhub/pull/131).

## 1. Identificação

| Item | Valor |
| --- | --- |
| Projeto | MindHub |
| Caso de uso / Épico | UC03 — Publicar Serviço / #35 |
| Issue do teste | #36 |
| Issue da implementação | #36 (Cenário A do `05-02`: a mesma Sub-Issue cobre teste e implementação) |
| Critério de aceite coberto | Critério 1 da #36: *"O Serviço nasce publicado, com identidade própria, referência ao perfil e Modelo de Contratação declarado."* |
| Critérios pendentes | 2 a 6 da #36 (sem teste) |
| Contratos | `ModeloContratacao`, `SituacaoServico`, `Servico.publicar(dados)`, getters `id`, `perfilId`, `titulo`, `descricao`, `modeloContratacao`, `situacao` |
| Camada | Domínio (`src/oferta/dominio`), sem Nest, ORM ou HTTP |
| Framework / runner | Vitest 4.1.11 (`pnpm test` → `vitest run`) |

## 2. Código recuperado

### Produção — `mindhub-backend/src/oferta/dominio/servico.ts` (@ `db56884`)

```ts
import { randomUUID } from 'node:crypto';

export type ModeloContratacao = 'RESERVA_DIRETA' | 'SOB_PROPOSTA';

export type SituacaoServico = 'PUBLICADO';

/** Falha provisória da fase RED do TDD (#36): comportamento ainda não implementado. */
export class NaoImplementado extends Error {
  constructor(operacao: string) {
    super(`${operacao} ainda não implementado.`);
    this.name = 'NaoImplementado';
  }
}

/**
 * Serviço (C2): oferta publicada por um Perfil de Especialista.
 * Guarda só a referência do perfil. Não há setters: o Serviço nasce por
 * `publicar` e muda apenas por comportamentos nomeados.
 */
export class Servico {
  private constructor(
    private readonly _id: string,
    private readonly _perfilId: string,
    private readonly _titulo: string,
    private readonly _descricao: string,
    private readonly _modeloContratacao: ModeloContratacao,
    private readonly _situacao: SituacaoServico,
  ) {}

  /**
   * UC03: única forma de nascer um Serviço. Gera a identidade própria e define
   * a situação inicial PUBLICADO (critério 1 da #36).
   */
  static publicar(dados: {
    perfilId: string;
    titulo: string;
    descricao: string;
    modeloContratacao: ModeloContratacao;
    agora: Date;
  }): Servico {
    return new Servico(
      randomUUID(),
      dados.perfilId,
      dados.titulo,
      dados.descricao,
      dados.modeloContratacao,
      'PUBLICADO',
    );
  }

  get id(): string {
    return this._id;
  }

  get perfilId(): string {
    return this._perfilId;
  }

  get titulo(): string {
    return this._titulo;
  }

  get descricao(): string {
    return this._descricao;
  }

  get modeloContratacao(): ModeloContratacao {
    return this._modeloContratacao;
  }

  get situacao(): SituacaoServico {
    return this._situacao;
  }
}
```

### Teste — `mindhub-backend/test/unit/oferta/servico.spec.ts` (inalterado desde `c1a8af0`)

```ts
import { randomUUID } from 'node:crypto';
import { Servico } from '../../../src/oferta/dominio/servico.js';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const agora = new Date('2026-11-11T12:00:00.000Z');

describe('Servico.publicar', () => {
  // Critério de aceite 1 da #36 (UC03): o Serviço nasce publicado, com
  // identidade própria, referência ao perfil e Modelo de Contratação declarado.
  it('nasce publicado, com identidade própria, referência ao perfil e Modelo de Contratação', () => {
    // Arrange: dados válidos. Sob Proposta não exige condições vigentes (D-UC03-03).
    const perfilId = randomUUID();
    const dados = {
      perfilId,
      titulo: 'Mentoria de produto',
      descricao: 'Sessões de discovery para times iniciantes',
      modeloContratacao: 'SOB_PROPOSTA' as const,
      agora,
    };

    // Act
    const servico = Servico.publicar(dados);

    // Assert
    expect(servico.id).toMatch(UUID);
    expect(servico.perfilId).toBe(perfilId);
    expect(servico.titulo).toBe('Mentoria de produto');
    expect(servico.modeloContratacao).toBe('SOB_PROPOSTA');
    expect(servico.situacao).toBe('PUBLICADO');
  });
});
```

## 3. Situação real do repositório (17/11/2026)

```text
$ git status
On branch feature/36-uc03-modelar-servico
Your branch is up to date with 'origin/feature/36-uc03-modelar-servico'.

Untracked files:
  (use "git add <file>..." to include in what will be committed)
	docs/planejamento/
	docs/prompts/

nothing added to commit but untracked files present (use "git add" to track)

$ git branch -vv
  docs/planejamento-casos-de-uso             e8df25c [origin/docs/planejamento-casos-de-uso] docs(planejamento): registra o Material 04 do UC03 (#36, Draft PR #131)
  feat/issue-1-cadastrar-perfil-especialista 69d3e84 [origin/feat/issue-1-cadastrar-perfil-especialista] docs(backend): documenta o primeiro slice e a reprodução com PostgreSQL
* feature/36-uc03-modelar-servico            db56884 [origin/feature/36-uc03-modelar-servico] feat(oferta): implement Servico.publicar to satisfy test (ref #36)
  main                                       43a14f6 [origin/main] Merge pull request #132 from MindHub-DSC/docs/planejamento-casos-de-uso

$ git log -n 3 --oneline
db56884 feat(oferta): implement Servico.publicar to satisfy test (ref #36)
c1a8af0 test(oferta): add failing test for Servico.publicar (ref #36)
cbf21f5 Merge pull request #34 from MindHub-DSC/feat/issue-1-cadastrar-perfil-especialista
```

Leitura:

- Nenhuma alteração local em arquivos rastreados; a branch está sincronizada com a remota (`up to date`), sem commits além do GREEN (`db56884`).
- Os itens não rastreados são documentação (`docs/planejamento/`, `docs/prompts/`), fora do escopo do código.
- **Diferença em relação ao Material 05:** a `main` avançou de `cbf21f5` para `43a14f6` com o merge do PR #132, que trouxe só documentação de planejamento. `git diff --stat cbf21f5..origin/main -- mindhub-backend` é vazio: nenhum arquivo do backend mudou na `main`.

## 4. Linha de base dos testes

### Teste específico

```text
$ pnpm exec vitest run test/unit/oferta/servico.spec.ts --reporter=verbose

 RUN  v4.1.11 C:/Users/leonardo/Desktop/DSC/Mindhub/mindhub-backend

 ✓ test/unit/oferta/servico.spec.ts > Servico.publicar > nasce publicado, com identidade própria, referência ao perfil e Modelo de Contratação 3ms

 Test Files  1 passed (1)
      Tests  1 passed (1)
   Start at  13:54:06
   Duration  222ms (transform 29ms, setup 0ms, import 44ms, tests 4ms, environment 0ms)
```

### Suíte completa

```text
$ pnpm test
$ vitest run

 RUN  v4.1.11 C:/Users/leonardo/Desktop/DSC/Mindhub/mindhub-backend


 Test Files  6 passed (6)
      Tests  42 passed (42)
   Start at  13:54:07
   Duration  589ms (transform 324ms, setup 0ms, import 678ms, tests 46ms, environment 1ms)
```

| Execução | Comando | Testes | Aprovados | Reprovados | Duração | Warnings/erros |
| --- | --- | --- | --- | --- | --- | --- |
| Teste específico | `pnpm exec vitest run test/unit/oferta/servico.spec.ts --reporter=verbose` | 1 | 1 | 0 | 222ms | Nenhum |
| Suíte completa | `pnpm test` | 42 (6 arquivos) | 42 | 0 | 589ms | Nenhum |

## 5. Histórico (Material 05) × execução atual

| Medida | Material 05 (12/11/2026) | Atual (17/11/2026) | Situação |
| --- | --- | --- | --- |
| `servico.spec.ts` | 1 passed | 1 passed | Igual |
| Test Files | 6 passed (6) | 6 passed (6) | Igual |
| Tests | 42 passed (42) | 42 passed (42) | Igual |

## 6. Branches, commits e Pull Requests no GitHub

| Item | Valor |
| --- | --- |
| PR | [#131](https://github.com/MindHub-DSC/Mindhub/pull/131): `feature/36-uc03-modelar-servico` → `main` |
| Estado | `OPEN`, Draft, `reviewDecision: REVIEW_REQUIRED`, 0 reviews |
| Commits | `c1a8af0` (RED), `db56884` (GREEN) |
| Comentários | 1, a autorrevisão inicial de @leohsm (11/11/2026) |
| PRs dependentes | Nenhum: teste e implementação estão no mesmo PR |
| Proteção da `main` | 1 aprovação obrigatória; sem status checks; sem CI configurado no repositório |
| Issue #36 / épico #35 | Abertas |
| Card #36 no Project | `In Progress` (registrado no `05-07`) |

## 7. Pendências herdadas do Material 05

1. Remover `NaoImplementado`, sem uso desde o GREEN (D1 do `05-06`).
2. Decidir o destino do parâmetro `agora` (D2).
3. Critérios 2 a 6 da #36 sem teste (D3, D5, D6, D7).
4. Revisão apenas por autorrevisão (equipe de um integrante).
5. Artefatos `05-*` ainda não versionados.

## 8. Prontidão para a refatoração

| Condição | Situação |
| --- | --- |
| Branch da implementação ativa | Sim (`feature/36-uc03-modelar-servico`) |
| Sem alterações locais em arquivos rastreados | Sim |
| Teste específico verde | Sim (1/1) |
| Suíte completa verde | Sim (42/42) |

**Linha de base verde. Pronto para a Fase 3 — avaliação da necessidade de refatoração.**
