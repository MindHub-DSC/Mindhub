# 06-03 — Refatoração controlada

**Caso de uso:** UC03 — Publicar Serviço (épico [#35](https://github.com/MindHub-DSC/Mindhub/issues/35))
**Sub-Issue:** [#36](https://github.com/MindHub-DSC/Mindhub/issues/36)
**Branch:** `feature/36-uc03-modelar-servico` (base `db56884`)
**Data:** 17/11/2026

## 1. Decisão adotada

**Refatoração executada** (Cenário A do `06-02`), com um único passo: remover a classe `NaoImplementado` de `servico.ts`.

## 2. Justificativa

- `NaoImplementado` era o erro provisório que o stub lançava na fase RED (`c1a8af0`). Desde o GREEN (`db56884`) nada a lança nem a importa: era código morto exportado.
- Tirava a coesão do arquivo, que deve conter só o agregado `Servico` e seus tipos. Os erros de domínio do módulo ficam em `erros.ts`.
- Dava a quem lê a falsa indicação de que havia comportamento pendente.
- A remoção não muda nenhum comportamento observável: é refatoração no sentido estrito.

## 3. Verificações prévias (7.1)

```text
$ git branch --show-current
feature/36-uc03-modelar-servico
$ git status --short -- mindhub-backend
(vazio = sem alterações)
```

| Verificação | Resultado |
| --- | --- |
| Branch da implementação ativa | Sim |
| Linha de base verde (`06-01`) | Sim: 1/1 no teste específico, 42/42 na suíte |
| Sem alterações locais no backend | Sim |
| Escopo delimitado | Apagar a classe `NaoImplementado` e seu comentário. Nada mais |

## 4. Arquivos

| Arquivo | Situação |
| --- | --- |
| `mindhub-backend/src/oferta/dominio/servico.ts` | **Modificado** (8 linhas removidas, nenhuma adicionada) |
| `mindhub-backend/test/unit/oferta/servico.spec.ts` | Analisado, **sem alteração** |
| `mindhub-backend/src/oferta/dominio/perfil-especialista.ts` | Analisado como referência de padrão, sem alteração |

## 5. Diff

```text
$ git diff -- mindhub-backend
diff --git a/mindhub-backend/src/oferta/dominio/servico.ts b/mindhub-backend/src/oferta/dominio/servico.ts
index c3b63f5..d901ada 100644
--- a/mindhub-backend/src/oferta/dominio/servico.ts
+++ b/mindhub-backend/src/oferta/dominio/servico.ts
@@ -4,14 +4,6 @@ export type ModeloContratacao = 'RESERVA_DIRETA' | 'SOB_PROPOSTA';
 
 export type SituacaoServico = 'PUBLICADO';
 
-/** Falha provisória da fase RED do TDD (#36): comportamento ainda não implementado. */
-export class NaoImplementado extends Error {
-  constructor(operacao: string) {
-    super(`${operacao} ainda não implementado.`);
-    this.name = 'NaoImplementado';
-  }
-}
-
 /**
  * Serviço (C2): oferta publicada por um Perfil de Especialista.
  * Guarda só a referência do perfil. Não há setters: o Serviço nasce por

$ git diff --stat -- mindhub-backend
 mindhub-backend/src/oferta/dominio/servico.ts | 8 --------
 1 file changed, 8 deletions(-)
```

O Git também mostrou um aviso de conversão de fim de linha (`LF will be replaced by CRLF`), que é a configuração `core.autocrlf` do Windows e não altera o conteúdo.

Confirmação de que não sobrou referência:

```text
$ grep -rn "NaoImplementado" src test
exit=1        (nenhuma ocorrência)
```

## 6. Contratos e comportamentos preservados

| Elemento | Antes | Depois |
| --- | --- | --- |
| `ModeloContratacao` | `'RESERVA_DIRETA' \| 'SOB_PROPOSTA'` | Igual |
| `SituacaoServico` | `'PUBLICADO'` | Igual |
| `Servico.publicar(dados)` | Assinatura `{ perfilId, titulo, descricao, modeloContratacao, agora }` → `Servico` | Igual |
| Construtor privado e campos `private readonly` | 6 campos | Igual |
| Getters | `id`, `perfilId`, `titulo`, `descricao`, `modeloContratacao`, `situacao` | Igual |
| Export `NaoImplementado` | Exportado, sem uso | **Removido** (nenhum consumidor) |
| Critério 1 da #36 | Atendido | Atendido |

Nada foi acrescentado: nenhuma validação, campo ou regra nova. O teste não foi alterado:

```text
$ git diff --exit-code -- test/ && echo "spec inalterado"
spec inalterado
```

## 7. Resultado imediato dos testes (7.3)

```text
$ pnpm exec vitest run test/unit/oferta/servico.spec.ts --reporter=verbose

 RUN  v4.1.11 C:/Users/leonardo/Desktop/DSC/Mindhub/mindhub-backend

 ✓ test/unit/oferta/servico.spec.ts > Servico.publicar > nasce publicado, com identidade própria, referência ao perfil e Modelo de Contratação 3ms

 Test Files  1 passed (1)
      Tests  1 passed (1)
   Start at  13:56:47
   Duration  268ms (transform 32ms, setup 0ms, import 50ms, tests 5ms, environment 0ms)

$ pnpm test
$ vitest run

 RUN  v4.1.11 C:/Users/leonardo/Desktop/DSC/Mindhub/mindhub-backend


 Test Files  6 passed (6)
      Tests  42 passed (42)
   Start at  13:56:48
   Duration  751ms (transform 393ms, setup 0ms, import 846ms, tests 55ms, environment 1ms)
```

| Execução | Linha de base (`06-01`) | Após a refatoração |
| --- | --- | --- |
| Teste específico | 1 passed (1) | 1 passed (1) |
| Suíte completa | 42 passed (42) | 42 passed (42) |

Nenhum teste falhou, então não foi preciso desfazer nem ajustar a alteração. A alteração ainda **não foi commitada**: o commit e o push ficam para a Fase 6, depois da verificação formal de regressões (Fase 5, `06-04`).
