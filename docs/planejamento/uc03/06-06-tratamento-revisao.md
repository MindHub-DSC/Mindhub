# 06-06 — Tratamento das observações de revisão

**Caso de uso:** UC03 — Publicar Serviço (épico [#35](https://github.com/MindHub-DSC/Mindhub/issues/35))
**Sub-Issue:** [#36](https://github.com/MindHub-DSC/Mindhub/issues/36)
**PR:** [#131](https://github.com/MindHub-DSC/Mindhub/pull/131)
**Data:** 17/11/2026

## 1. Registro dos apontamentos no GitHub

Os apontamentos do `06-05` foram publicados no PR #131 como uma revisão do tipo **comentário** (sem aprovação), sobre o commit `8c98453`, identificada como parecer de IA:

- Revisão: <https://github.com/MindHub-DSC/Mindhub/pull/131#pullrequestreview-5943028245> (estado `COMMENTED`)
- Comentários de linha: A2 em `servico.ts:31`; A3 e A4 em `servico.spec.ts` (bloco Assert)
- Corpo da revisão: A1, A5, A6 e B1

## 2. Apontamentos, decisões e responsáveis

| ID | Autor do apontamento | PR / trecho | Classificação | Decisão | Responsável |
| --- | --- | --- | --- | --- | --- |
| A1 | Claude (parecer de IA) | #131 / título | Sugestão | **Acatado** | @leohsm |
| A2 | Claude (parecer de IA) | #131 / `servico.ts:31` | Dúvida | **Postergado** (decisão de contrato, registrada na #36) | @leohsm |
| A3 | Claude (parecer de IA) | #131 / `servico.spec.ts` | Sugestão | **Acatado** | @leohsm |
| A4 | Claude (parecer de IA) | #131 / `servico.spec.ts` | Sugestão | **Acatado** | @leohsm |
| A5 | Claude (parecer de IA) | Repositório (sem CI) | Sugestão | **Postergado** (débito do projeto) | Equipe |
| A6 | Claude (parecer de IA) | Commits `c1a8af0`, `db56884` | Sugestão | **Recusado** para o histórico já publicado | @leohsm |
| B1 | Claude (parecer de IA) | Escopo da #36 | Pendência bloqueante | **Aberto**: continua bloqueando a integração | @leohsm |

## 3. Ajustes implementados

### A1 — título do PR

```text
$ gh pr edit 131 --title "feat(oferta): modelar Servico.publicar — critério 1 (UC03-SUB-01, ref #36)"
$ gh pr view 131 --json title,isDraft,headRefOid
feat(oferta): modelar Servico.publicar — critério 1 (UC03-SUB-01, ref #36) | draft=true | head=992c8f1
```

Título anterior: `test(oferta): teste RED de Servico.publicar (UC03-SUB-01, ref #36)`.

### A3 e A4 — reforço do teste do critério 1

Natureza da mudança: **só teste**. Não é refatoração nem evolução funcional: verifica com mais precisão um comportamento que o GREEN já entregou (a `descricao` guardada e a identidade própria do critério 1). O código de produção não mudou.

```text
$ git diff -- test/
@@ -25,7 +25,20 @@ describe('Servico.publicar', () => {
     expect(servico.id).toMatch(UUID);
     expect(servico.perfilId).toBe(perfilId);
     expect(servico.titulo).toBe('Mentoria de produto');
+    expect(servico.descricao).toBe('Sessões de discovery para times iniciantes');
     expect(servico.modeloContratacao).toBe('SOB_PROPOSTA');
     expect(servico.situacao).toBe('PUBLICADO');
   });
+
+  it('gera identidades diferentes a cada publicação', () => {
+    const dados = {
+      perfilId: randomUUID(),
+      titulo: 'Mentoria de produto',
+      descricao: 'Sessões de discovery para times iniciantes',
+      modeloContratacao: 'SOB_PROPOSTA' as const,
+      agora,
+    };
+
+    expect(Servico.publicar(dados).id).not.toBe(Servico.publicar(dados).id);
+  });
 });
```

#### Verificação de que as novas verificações podem falhar

Como as asserções novas cobrem um comportamento já existente, elas passam de primeira. Para descartar falso positivo, `servico.ts` foi alterado de propósito (sem commit), o teste foi executado e o arquivo foi restaurado:

```text
--- mutação aplicada:
-      randomUUID(),
+      "00000000-0000-4000-8000-000000000000",
-      dados.descricao,
+      dados.titulo,
     × nasce publicado, com identidade própria, referência ao perfil e Modelo de Contratação 8ms
     × gera identidades diferentes a cada publicação 1ms
 FAIL  test/unit/oferta/servico.spec.ts > Servico.publicar > nasce publicado, com identidade própria, referência ao perfil e Modelo de Contratação
AssertionError: expected 'Mentoria de produto' to be 'Sessões de discovery para times inici…' // Object.is equality
Expected: "Sessões de discovery para times iniciantes"
Received: "Mentoria de produto"
 FAIL  test/unit/oferta/servico.spec.ts > Servico.publicar > gera identidades diferentes a cada publicação
AssertionError: expected '00000000-0000-4000-8000-000000000000' not to be '00000000-0000-4000-8000-000000000000' // Object.is equality
      Tests  2 failed (2)
--- servico.ts restaurado
```

#### Commit e push

```text
$ git add mindhub-backend/test/unit/oferta/servico.spec.ts
$ git commit   (mensagem abaixo)
992c8f15f45ed585893e52c1a5b594bf4faa5d97
test(oferta): verifica descrição e unicidade da identidade do Serviço (ref #36)
 mindhub-backend/test/unit/oferta/servico.spec.ts | 13 +++++++++++++

$ git push
   8c98453..992c8f1  feature/36-uc03-modelar-servico -> feature/36-uc03-modelar-servico
```

A descrição do PR #131 foi atualizada com o commit `992c8f1` e o novo total de testes.

## 4. Evidências de estabilidade após os ajustes

```text
$ pnpm exec vitest run test/unit/oferta/servico.spec.ts --reporter=verbose
 ✓ test/unit/oferta/servico.spec.ts > Servico.publicar > nasce publicado, com identidade própria, referência ao perfil e Modelo de Contratação 2ms
 ✓ test/unit/oferta/servico.spec.ts > Servico.publicar > gera identidades diferentes a cada publicação 1ms

 Test Files  1 passed (1)
      Tests  2 passed (2)
   Start at  14:04:53
   Duration  328ms (transform 37ms, setup 0ms, import 57ms, tests 5ms, environment 0ms)

$ pnpm test
 Test Files  6 passed (6)
      Tests  43 passed (43)
   Start at  14:04:54
   Duration  804ms (transform 476ms, setup 0ms, import 1.02s, tests 65ms, environment 2ms)

$ pnpm lint    → lint exit=0
$ pnpm build   → build exit=0
```

| Medida | Antes dos ajustes (`06-04`) | Depois dos ajustes |
| --- | --- | --- |
| `servico.spec.ts` | 1 passed (1) | 2 passed (2) |
| Suíte | 42 passed (42) | 43 passed (43) — +1 teste novo, nenhuma falha |
| Lint / build | exit 0 / exit 0 | exit 0 / exit 0 |

## 5. Justificativas dos itens não adotados

| ID | Justificativa |
| --- | --- |
| A2 | Guardar `agora` como `publicadoEm` ou retirá-lo da assinatura muda o contrato do agregado: é evolução, não ajuste de revisão. Precisa de decisão do responsável e de um teste RED próprio. Registrado na #36: <https://github.com/MindHub-DSC/Mindhub/issues/36#issuecomment-6955122141> |
| A5 | Configurar CI afeta o repositório inteiro e não faz parte da #36. Fica como débito do projeto |
| A6 | Corrigir o idioma de `c1a8af0` e `db56884` exigiria reescrever o histórico já publicado e `git push --force`, o que o Material 06 proíbe. Os commits novos (`8c98453`, `992c8f1`) já seguem o português |
| B1 | Não se resolve com ajuste de revisão: exige os ciclos RED → GREEN dos critérios 2 a 6 da #36. **Permanece bloqueante**, sem evidência de resolução |

## 6. Situação final dos comentários no GitHub

| ID | Onde | Resposta |
| --- | --- | --- |
| A2 | Comentário de linha | <https://github.com/MindHub-DSC/Mindhub/pull/131#discussion_r4603044240> — postergado, link para a #36 |
| A3 | Comentário de linha | <https://github.com/MindHub-DSC/Mindhub/pull/131#discussion_r4603044744> — acatado em `992c8f1`, com evidência da mutação |
| A4 | Comentário de linha | <https://github.com/MindHub-DSC/Mindhub/pull/131#discussion_r4603045128> — acatado em `992c8f1`, com evidência da mutação |
| A1, A5, A6, B1 | Comentário geral | <https://github.com/MindHub-DSC/Mindhub/pull/131#issuecomment-6955125683> — tabela de decisões |

Nenhum apontamento bloqueante foi marcado como resolvido: o **B1 segue aberto**. Os comentários A3 e A4 foram respondidos com evidência e ficam a cargo do responsável para marcar como resolvidos no GitHub.
