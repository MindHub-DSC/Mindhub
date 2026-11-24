# 12-02 — Mapa de dependências

**Caso de uso:** UC03 — Publicar Serviço (épico [#35](https://github.com/MindHub-DSC/Mindhub/issues/35))
**Issue:** [#147](https://github.com/MindHub-DSC/Mindhub/issues/147) · **Código:** `feature/144-uc03-contrato-http` @ `472cdac`
**Data:** 24/11/2026

Os dois mapas abaixo respondem a perguntas diferentes: o **fluxo de execução** mostra a sequência de uma requisição; as **dependências de código** mostram quem importa quem. Não são o mesmo desenho.

## A. Fluxo de execução (uma requisição `POST /servicos`) [CÓD]

```text
Cliente HTTP
  → APP_PIPE: StandardSchemaValidationPipe  (valida o corpo com publicarServicoSchema)
  → ServicosController.publicar()
  → PublicarServico.executar(comando)
       → PerfisEspecialistaRepositorio.buscarPorUsuario(usuarioId)   (porta → adaptador TypeORM)
       → Servico.publicar({...})                                     (domínio valida invariantes, gera id)
       → ServicosRepositorio.adicionar(servico)                      (porta)
            → ServicosTypeOrmRepositorio.adicionar()
                 → ServicoMapper.paraOrm()  → TypeORM insert  → PostgreSQL (oferta.servicos)
  ← Servico
  ← paraResposta(servico)  → ServicoResponse  → JSON (201)

Erros: AtorSemPerfil / PerfilSuspenso / ServicoInvalido → ErrosDePublicacaoFilter (404/403/422/400)
       ArmazenamentoIndisponivel → ArmazenamentoIndisponivelFilter (503)
```

## B. Dependências de código (setas = "importa") [CÓD]

```text
ServicosController ──► PublicarServico ──► ServicosRepositorio (porta, interface)
        │                    │                     ▲
        │                    ├──► PerfisEspecialistaRepositorio (porta)       │ implements
        │                    └──► Servico (domínio)                           │
        ├──► paraResposta / schema (mesmo módulo HTTP)      ServicosTypeOrmRepositorio ──► TypeORM, ServicoMapper
        └──► ErrosDePublicacaoFilter                                                  └──► ServicoOrmEntity

OfertaModule ──► compõe: SERVICOS_REPOSITORIO = new ServicosTypeOrmRepositorio(Repository<ServicoOrmEntity>)
                         PublicarServico       = new PublicarServico(perfis, servicos)
```

Domínio e aplicação **não importam** Nest, TypeORM, `pg`, Express nem Zod; o adaptador **implementa** a porta e é o único que conhece o ORM; o módulo **compõe**.

### Evidência (buscas executadas em `src/`)

```text
$ grep -rnE "from '(@nestjs|typeorm|pg|express|zod)" */dominio */aplicacao identidade/publico
(nenhum resultado)
$ grep -rnE "infra/|typeorm|Repository" */http
compartilhado/http/armazenamento-indisponivel.filter.ts:3: import { ArmazenamentoIndisponivel } from '../infra/erros-de-banco.js';
$ grep -rnE "from '\.\./(http|infra)" */dominio */aplicacao
(nenhum resultado)
$ grep -rnE "from '\.\./(http|aplicacao)" */infra
(nenhum resultado)
$ grep -rn "@Injectable\|@Inject(" .
app.service.ts (AppService) · usuarios.controller.ts · perfis-especialista.controller.ts · servicos.controller.ts
```

Os únicos `@Inject` estão em **controllers** (pegam a classe de aplicação). Nenhum decorator em domínio, aplicação, adaptadores ou mappers.

## C. Mapeamentos (distintos) [CÓD]

| Mapeamento | Componente | Direção | Responsabilidade |
| --- | --- | --- | --- |
| Mapper HTTP | `paraResposta` (`oferta/http/publicar-servico.dto.ts`) | `Servico` → `ServicoResponse` | Representação **pública** (7 campos; `publicadoEm` e `ordem` fora) |
| Mapper de persistência | `ServicoMapper` (`oferta/infra/servico.mapper.ts`) | `Servico` ↔ `ServicoOrmEntity` | Adaptação à tabela (condições "achatadas" em 4 colunas; `ordem` técnica); usa `paraDados()` e `reconstituir()` |

Nenhum dos dois contém regra de negócio; um não chama o outro.

## D. Composição de providers [CÓD]

| Token / classe | Provider (em `OfertaModule`) | Dependências injetadas |
| --- | --- | --- |
| `PERFIS_ESPECIALISTA_REPOSITORIO` | `useFactory` → `new PerfisEspecialistaTypeOrmRepositorio(orm)` | `getRepositoryToken(PerfilEspecialistaOrmEntity)` |
| `SERVICOS_REPOSITORIO` (Symbol) | `useFactory` → `new ServicosTypeOrmRepositorio(orm)` | `getRepositoryToken(ServicoOrmEntity)` |
| `PublicarServico` | `useFactory` → `new PublicarServico(perfis, servicos)` | `PERFIS_ESPECIALISTA_REPOSITORIO`, `SERVICOS_REPOSITORIO` |
| `TypeOrmModule.forFeature([PerfilEspecialistaOrmEntity, ServicoOrmEntity])` | import do módulo | — |

Interfaces somem no JavaScript: quem resolve a injeção é o **token** `SERVICOS_REPOSITORIO` (um `Symbol`) ligado ao adaptador por `useFactory`, não o `implements`. Esse ponto é coberto por `test/unit/oferta/servicos.composicao.spec.ts` (inclusive o erro clássico de registrar a classe em vez do token) e pelo `servicos.integracao.spec.ts`, que sobrescreve o provider por `ServicosEmMemoria`. Em execução, o log do contêiner mostra `OfertaModule dependencies initialized` e `Mapped {/servicos, POST} route`.

## E. Arquivos de referência

`oferta/http/servicos.controller.ts`, `oferta/http/publicar-servico.dto.ts`, `oferta/aplicacao/publicar-servico.ts`, `oferta/dominio/{servico,servicos.repositorio}.ts`, `oferta/infra/{servicos.typeorm-repositorio,servico.mapper,servico.orm-entity}.ts`, `oferta/oferta.module.ts`, `app.module.ts`.
