# 04-07 — Draft Pull Request

**Caso de uso:** UC03 — Publicar Serviço (épico [#35](https://github.com/MindHub-DSC/Mindhub/issues/35))
**Sub-Issue:** [#36](https://github.com/MindHub-DSC/Mindhub/issues/36)
**Data:** 11/11/2026

| Item | Valor |
| --- | --- |
| URL | <https://github.com/MindHub-DSC/Mindhub/pull/131> |
| Título | `test(oferta): teste RED de Servico.publicar (UC03-SUB-01, ref #36)` |
| Origem (compare) | `feature/36-uc03-modelar-servico` |
| Destino (base) | `main` |
| Estado | **Draft**, aberto (`isDraft: true`, `state: OPEN`) |
| Merge | Não realizado. `mergeStateStatus: BLOCKED` (a `main` é protegida) |

## Descrição submetida

```markdown
## 📝 Draft Pull Request — [UC03-SUB-01] Modelar o Serviço e suas condições vigentes

### 📌 Issue Vinculada
Ref: #36 (épico #35)

### 🎯 Objetivo desta Alteração
Estabelecer o primeiro teste automatizado na fase RED do ciclo TDD, validando o critério de aceite:
> "O Serviço nasce publicado, com identidade própria, referência ao perfil e Modelo de Contratação declarado."

### 🛠️ Alterações Incluídas
- Criação do arquivo de teste: `mindhub-backend/test/unit/oferta/servico.spec.ts` (cenário com dados válidos, padrão AAA).
- Stub mínimo de contrato: `mindhub-backend/src/oferta/dominio/servico.ts`. Declara `Servico.publicar`, que apenas lança `NaoImplementado`. **Não há regra de negócio.**

### 🧪 Evidência da Fase RED (TDD)
O teste foi executado (`pnpm test`) e falhou conforme o esperado devido à ausência da implementação funcional. Os outros 41 testes continuam passando; `pnpm lint` e `pnpm build` sem erros.

FAIL  test/unit/oferta/servico.spec.ts > Servico.publicar > nasce publicado, ...
NaoImplementado: Servico.publicar ainda não implementado.
 ❯ Servico.publicar src/oferta/dominio/servico.ts:32:11
 ❯ test/unit/oferta/servico.spec.ts:22:29

 Test Files  1 failed | 5 passed (6)
      Tests  1 failed | 41 passed (42)

### ⏳ Estado Atual e Próximos Passos
- [x] Branch de trabalho criada a partir da main
- [x] Teste automatizado escrito e falhando legitimamente (RED)
- [x] Commit atômico registrado
- [ ] Implementação de código de produção para satisfazer o teste (fase GREEN - Material 05)
- [ ] Refatoração e limpeza de código (fase REFACTOR)

⚠️ **ATENÇÃO: Este Pull Request é um RASCUNHO (DRAFT) e NÃO DEVE SER INTEGRADO (MERGE) até a conclusão das fases GREEN e REFACTOR.**

🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

*(No GitHub, o trecho da falha está dentro de um bloco `text`; aqui foi simplificado para não aninhar blocos de código.)*
