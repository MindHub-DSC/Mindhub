# 08-07 — Preparação para persistência real

**Caso de uso:** UC03 — Publicar Serviço (épico [#35](https://github.com/MindHub-DSC/Mindhub/issues/35))
**Sub-Issue de persistência:** [#37](https://github.com/MindHub-DSC/Mindhub/issues/37) — [UC03-SUB-02] Persistir o Serviço com TypeORM e migration (**não iniciada**)
**Data:** 17/11/2026

> Este documento é **apenas planejamento**. Nenhuma entidade ORM, migration, branch ou alteração de código de persistência foi feita nesta etapa.

## 1. Arquitetura atual (verificada no Material 08)

```text
ServicosController                       (POST /servicos)
     |
     v
PublicarServico                          (aplicação)
     |
     v
ServicosRepositorio                      (porta; token SERVICOS_REPOSITORIO)
     |
     v
ServicosEmMemoria                        (src/oferta/infra; provider do OfertaModule)
```

O `PublicarServico` também usa `PerfisEspecialistaRepositorio` (`PERFIS_ESPECIALISTA_REPOSITORIO`), que **já** é TypeORM/PostgreSQL desde o UC02.

## 2. Evolução planejada (#37)

```text
ServicosController
     |
     v
PublicarServico
     |
     v
ServicosRepositorio   (token SERVICOS_REPOSITORIO)
     |
     +--> ServicosEmMemoria            testes unitários e integrados sem banco
     |
     +--> ServicosTypeOrmRepositorio   aplicação real (PostgreSQL)
```

São **adaptadores alternativos** do mesmo contrato. Cada contexto liga o token a **um** deles; nunca os dois gravam na mesma requisição. Na aplicação, a troca é uma linha do `OfertaModule`:

```ts
// hoje
{ provide: SERVICOS_REPOSITORIO, useClass: ServicosEmMemoria }
// depois da #37 (mesmo padrão do provider de perfis)
{
  provide: SERVICOS_REPOSITORIO,
  useFactory: (orm: Repository<ServicoOrmEntity>) => new ServicosTypeOrmRepositorio(orm),
  inject: [getRepositoryToken(ServicoOrmEntity)],
}
```

## 3. Contratos que guiam a #37

| Contrato | Exigência para o adaptador real |
| --- | --- |
| `adicionar(servico)` | Gravar todos os campos, inclusive `condicoes` (ou ausência delas) |
| `buscarPorId(id)` | Devolver `Servico.reconstituir(...)` ou `null` |
| `listarPorPerfil(perfilId)` | Ordem de registro (a suíte de contrato exige); 1 : 0..* por perfil |
| `DadosDoServico` / `paraDados` / `reconstituir` | Já existem e são a fronteira entre domínio e persistência (como o mapper do UC02) |
| Suíte de contrato | `test/support/contrato-servicos.ts` tem de passar também contra o adaptador TypeORM (critério 5 da #37) |

## 4. As 6 limitações da persistência em memória (no UC03)

| # | Limitação | Efeito concreto hoje |
| --- | --- | --- |
| 1 | **Volatilidade** | Reiniciar o processo apaga os Serviços. Observado: o Serviço `88a1b7a2-…` do `08-04` e os do `07-05` só existiram em memória; o perfil (PostgreSQL) sobreviveu ao reinício |
| 2 | **Escopo de uma instância** | Com duas instâncias da API, cada uma teria sua lista; um Serviço publicado numa não existiria na outra. A busca do UC04 ficaria inconsistente |
| 3 | **Concorrência** | Nada impede que um perfil seja suspenso entre a leitura do perfil e o `adicionar` (FE-06). A #39 depende de bloqueio ou versão do perfil **no banco**, na mesma transação (D-UC03-06); em memória isso não tem como ser feito |
| 4 | **Sem transações (ACID)** | Não há rollback se uma operação composta falhar no meio; a #39 precisa de "ler perfil + gravar Serviço" atômico |
| 5 | **Sem restrições do SGBD** | Nada garante PK única, `NOT NULL`, `CHECK` de `modelo_contratacao`/`situacao` nem FK para o perfil; hoje só o domínio protege. Um bug que contorne o domínio gravaria dado inválido |
| 6 | **Sem durabilidade nem auditoria** | Inviável em produção; não há histórico, backup nem consulta fora do processo |

## 5. Componentes preservados × componentes novos

### Preservados (inversão de dependência)

| Componente | Por quê |
| --- | --- |
| `ServicosController`, `publicarServicoSchema`, `ErrosDePublicacaoFilter` | Só conhecem o serviço de aplicação |
| `PublicarServico` | Só conhece a interface `ServicosRepositorio` |
| `Servico`, `CondicoesVigentes`, erros de domínio | Domínio puro |
| `ServicosRepositorio` e `SERVICOS_REPOSITORIO` | É o ponto de troca |
| `ServicosEmMemoria` | Continua nos testes sem banco |

### Novos ou alterados (infraestrutura, escopo da #37)

| Componente | Referência no UC02 |
| --- | --- |
| `src/oferta/infra/servico.orm-entity.ts` — tabela `oferta.servicos` | `perfil-especialista.orm-entity.ts` |
| `src/oferta/infra/servico.mapper.ts` — domínio ↔ ORM (via `paraDados`/`reconstituir`) | `perfil-especialista.mapper.ts` |
| `src/oferta/infra/servicos.typeorm-repositorio.ts` — `insert` (não `save`), `findOneBy`, `find` ordenado; falhas por `traduzirFalhaDeConexao` | `perfis-especialista.typeorm-repositorio.ts` |
| Migration reversível em `src/database/migrations/` | `…-EsquemaInicialIdentidadeOferta.ts` |
| `OfertaModule`: `TypeOrmModule.forFeature([…, ServicoOrmEntity])` + troca do provider | Provider de perfis |
| `test/integracao/servicos.typeorm.spec.ts` — suíte de contrato contra o PostgreSQL | `perfis-especialista.typeorm.spec.ts` |
| `test/support/limpeza.ts` — apagar Serviços dos perfis do teste antes dos perfis (por causa da FK) | Limpeza atual |

### Esboço da tabela (a decidir na #37)

| Coluna | Tipo | Restrição |
| --- | --- | --- |
| `id` | `uuid` | PK `pk_servicos` (gerado pelo domínio) |
| `perfil_id` | `uuid` | `NOT NULL`, FK para `oferta.perfis_especialista(id)` (mesmo contexto C2: diferente da D6 do UC02, que evita FK entre contextos); **sem** `UNIQUE` (1 : 0..*) |
| `titulo`, `descricao` | `varchar` | `NOT NULL` (limites de tamanho ainda não decididos no domínio) |
| `modelo_contratacao` | `varchar(20)` | `CHECK IN ('RESERVA_DIRETA','SOB_PROPOSTA')` |
| `situacao` | `varchar(20)` | `CHECK IN ('PUBLICADO')` |
| `preco`, `moeda`, `duracao_minutos`, `modalidade` | `integer`, `varchar`, `integer`, `varchar` | Nulas juntas; `CHECK` de "todas ou nenhuma" e de `RESERVA_DIRETA` ⇒ preenchidas; `preco >= 0`, `duracao_minutos > 0` |
| `publicado_em` | `timestamptz` | **Depende da decisão A2** (guardar o `agora`) |
| Ordem | — | `listarPorPerfil` precisa de ordem estável: `publicado_em` (se A2 = guardar) ou uma coluna de sequência |

## 6. Dependências, riscos e testes futuros

| Item | Detalhe |
| --- | --- |
| Pré-requisito | **Decisão A2** (`agora` → `publicado_em`?) antes de escrever a migration, para não precisar de uma segunda |
| Pré-requisito | Limites de tamanho de `titulo`/`descricao` (o domínio só exige mínimo de 1) |
| Pacotes | Nenhum novo: `typeorm`, `@nestjs/typeorm` e `pg` já estão instalados |
| Risco: ordem da listagem | Sem coluna de ordem, o PostgreSQL não garante a ordem de inserção; a suíte de contrato falharia de forma intermitente |
| Risco: condições parciais | Linha com só parte das condições; mitigar com `CHECK` e com o mapper usando `reconstituir` (que já recusa) |
| Risco: testes integrados sem banco | O `servicos.integracao.spec.ts` continua usando `ServicosEmMemoria`; precisa continuar compilando depois do `forFeature` novo (os overrides dos tokens TypeORM do `08-05` passam a incluir `getRepositoryToken(ServicoOrmEntity)`) |
| Risco: limpeza dos E2E | A FK exige apagar Serviços antes dos perfis |
| Testes com banco | Suíte de contrato contra TypeORM (`pnpm test:e2e`), migration `up`/`down`, falha de conexão → `ArmazenamentoIndisponivel` (critério 4 da #37), E2E existente passando a ler o Serviço do banco |
| Depois da #37 | #39 (bloqueio/versão do perfil na mesma transação) |

## 7. Rastreabilidade

- Todo este planejamento pertence à **#37**. A #37 continua **aberta e não iniciada**. Nada foi movido no Project e nenhuma branch de persistência foi criada.
- Nenhuma issue nova foi criada. As decisões pendentes (A2, tamanhos de texto) já estão registradas na #36 ou devem ser registradas na #37 quando ela começar.

## 8. Próximas ações

1. Decidir A2 e os limites de texto (registrar na #36/#37).
2. Integrar a cadeia #131 → #134 → #135 (ou criar a branch da #37 a partir da branch da #36, onde estão a porta e o domínio).
3. Implementar a #37 em TDD: suíte de contrato vermelha contra TypeORM → entidade, mapper, migration e adaptador.
4. Trocar o provider no `OfertaModule` e rodar unitários, integrados e E2E.
