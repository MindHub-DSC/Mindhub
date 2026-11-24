# 12-05 — Refatoração controlada: registro de preservação arquitetural

**Caso de uso:** UC03 — Publicar Serviço (épico [#35](https://github.com/MindHub-DSC/Mindhub/issues/35))
**Issue:** [#147](https://github.com/MindHub-DSC/Mindhub/issues/147)
**Data:** 24/11/2026

## 1. Decisão

**Nenhuma refatoração foi realizada.** A auditoria (`12-03`) não comprovou problema que justifique mudar código, e a matriz (`12-04`) classificou todos os achados como preservar, adiar ou investigar. Este é o **Cenário B** do material (preservação justificada), válido por si só.

Não há diff, não há commit de código e não há PR de código criados para esta atividade.

## 2. Componentes examinados

Controller, DTO de entrada, DTO de resposta, mapper HTTP, `PublicarServico`, `Servico`, `ServicosRepositorio` (porta), `ServicosTypeOrmRepositorio`, `ServicosEmMemoria`, `ServicoMapper`, `ServicoOrmEntity`, `OfertaModule`, `AppModule`, filtros de erro e suítes de teste (`12-02` e `12-03`).

## 3. Critérios

Os oito critérios do material (separação de responsabilidades, acoplamento, coesão, duplicação, legibilidade, testabilidade, estabilidade dos contratos, configuração e composição).

## 4. Evidências

- Domínio e aplicação sem imports de `@nestjs`, `typeorm`, `pg`, `express` ou `zod`; adaptador é o único a conhecer o ORM (`12-02`, seção B).
- Mapper HTTP único e protegido por teste fechado de não exposição (Material 11, `472cdac`); mapper de persistência sem regra de negócio.
- Composição por token `Symbol` e `useFactory`, coberta por teste de composição e por inicialização real do contêiner.
- Regressão reexecutada agora, sem falhas (`12-06`).

## 5. Hipóteses investigadas

H1 a H5 (Controller com ORM, Service com infraestrutura, Repository expondo ORM, mapeamento HTTP duplicado, providers inconsistentes): todas **descartadas com evidência** (`12-03`, seção 3). O exemplo de duplicação do mapper também não se aplica: o Material 11 já implementou o mapper e o Controller o usa, então não foi recriado.

## 6. Motivos para preservar

Não há risco técnico demonstrável a reduzir; as observações A1 a A5 têm baixo risco e baixo benefício de mudança; A6 é contrato HTTP e mudá-lo exigiria análise de compatibilidade (Material 11). Mudar por estética violaria o princípio central do Material 12.

## 7. Contratos preservados (inalterados)

`PublicarServico.executar(comando): Promise<Servico>`; `ServicosRepositorio { adicionar, buscarPorId, listarPorPerfil }` e `SERVICOS_REPOSITORIO`; `paraResposta(servico): ServicoResponse`; `POST /servicos` → `201` com `{ id, perfilId, titulo, descricao, modeloContratacao, condicoes | null, situacao }`.

## 8. Riscos residuais

- Dívida de documentação A1 (comentários), a corrigir na #41.
- Dois formatos de erro (A6) até a #41.
- A conclusão vale para o código da cadeia de PRs Draft (`472cdac`), não para a `main`.

## 9. Verificações e limitações

Build, lint, `pnpm test` e `pnpm test:e2e` (banco de testes) reexecutados e aprovados (`12-06`). Testes reduzem riscos, mas não provam ausência de defeitos; concorrência (#39) e falhas reais de infraestrutura não foram exercitadas.
