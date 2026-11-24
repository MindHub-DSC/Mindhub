# 12-07 — Decisões arquiteturais

**Caso de uso:** UC03 — Publicar Serviço (épico [#35](https://github.com/MindHub-DSC/Mindhub/issues/35))
**Issue:** [#147](https://github.com/MindHub-DSC/Mindhub/issues/147)
**Data:** 24/11/2026

Registro proporcional: só as decisões efetivamente tomadas. Os detalhes estão em `12-03` e `12-04`.

## AD-01 — Preservar a arquitetura do fluxo `POST /servicos`

| Campo | Conteúdo |
| --- | --- |
| **Problema** | Avaliar se o fluxo integrado (HTTP → aplicação → porta → adaptador TypeORM → PostgreSQL) precisa de refatoração |
| **Evidência** | Nenhum import de framework/ORM em domínio e aplicação; Controller sem ORM; porta só com tipos de domínio; mapper HTTP único com teste fechado; composição por token coberta por teste; regressão sem falhas (`12-02`, `12-03`, `12-06`) |
| **Alternativas** | (a) refatorar A1–A5; (b) unificar formatos de erro; (c) preservar |
| **Decisão** | Preservar; nenhuma alteração de código |
| **Justificativa** | Nenhum problema comprovado; as observações têm baixo risco e a mudança só geraria diff cosmético ou alteraria contrato HTTP |
| **Consequências** | Benefício: sem risco de regressão e contratos intactos. Custo: dívidas A1 e A6 continuam abertas. Risco remanescente: conclusão válida só para `472cdac` (cadeia de PRs Draft) |
| **Verificação** | `pnpm build`, `pnpm lint`, `pnpm test` (112) e `pnpm test:e2e` (35, banco `mindhub_test`) executados agora |

## AD-02 — Tratar os comentários desatualizados (A1) na documentação do UC03

| Campo | Conteúdo |
| --- | --- |
| **Problema** | `servicos.repositorio.ts` e `servicos.em-memoria.ts` ainda dizem que a TypeORM "terá" #37 e que a aplicação usa a memória provisoriamente |
| **Evidência** | Trechos citados no `12-03` (A1); `oferta.module.ts` já descreve o estado correto |
| **Alternativas** | Corrigir agora num PR de código; adiar para a #41 |
| **Decisão** | Adiar para a #41 (documentação do UC03), que já altera o texto do caso de uso |
| **Justificativa** | Não é falha arquitetural; um PR só de comentário seria alteração cosmética isolada |
| **Consequências** | O texto enganoso permanece até a #41; risco baixo |
| **Verificação** | Conferir na #41 que os dois comentários foram atualizados |

## AD-03 — Não unificar os formatos de erro neste material

| Campo | Conteúdo |
| --- | --- |
| **Problema** | Respostas de erro com dois formatos (com e sem `error`) |
| **Evidência** | Matriz do `11-04` |
| **Alternativas** | Unificar em `{statusCode, message, error}`; manter |
| **Decisão** | Manter; tratar na #41 com a análise de compatibilidade do `11-06` |
| **Justificativa** | É contrato HTTP estabilizado no Material 11 (D-UC03-07); mudar exige decisão de produto e comunicação a consumidores |
| **Consequências** | Clientes devem ler `statusCode` e `message` e não depender de `error` |
| **Verificação** | Testes HTTP do contrato (`servicos.http.spec.ts`) seguem como guarda |

## Gatilhos para reabrir

Segundo endpoint de Oferta com DTOs próprios (separar `publicar-servico.dto.ts`, A4); exigência de imagem enxuta ou de pastas de teste isoladas (mover `ServicosEmMemoria`, A2); início da #39 (concorrência) usando `buscarPorId`/`listarPorPerfil` (A3).
