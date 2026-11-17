# 06-05 — Revisão técnica do Pull Request

**Caso de uso:** UC03 — Publicar Serviço (épico [#35](https://github.com/MindHub-DSC/Mindhub/issues/35))
**Sub-Issue:** [#36](https://github.com/MindHub-DSC/Mindhub/issues/36)
**PR revisado:** [#131](https://github.com/MindHub-DSC/Mindhub/pull/131) @ `8c98453`
**Data:** 17/11/2026

## 1. Situação do PR no momento da revisão

```text
$ git log --oneline origin/main..HEAD
8c98453 refactor(oferta): remove NaoImplementado sem uso após o GREEN (ref #36)
db56884 feat(oferta): implement Servico.publicar to satisfy test (ref #36)
c1a8af0 test(oferta): add failing test for Servico.publicar (ref #36)

$ gh pr view 131 --json title,files,reviews,mergeable,mergeStateStatus
title: "test(oferta): teste RED de Servico.publicar (UC03-SUB-01, ref #36)"
files: mindhub-backend/src/oferta/dominio/servico.ts +66 -0
       mindhub-backend/test/unit/oferta/servico.spec.ts +31 -0
mergeable: MERGEABLE    mergeStateStatus: BLOCKED    reviews: 0

$ gh pr checks 131
no checks reported on the 'feature/36-uc03-modelar-servico' branch
```

## 2. Aplicação do Refinamento 1 (PRs dependentes)

O Refinamento 1 exige revisar separadamente um PR de testes e um PR de implementação derivado dele. **Neste projeto não existem PRs dependentes**:

| Verificação | Resultado |
| --- | --- |
| PRs abertos para a #36 | Só o #131 (`gh pr list --state open`) |
| Estratégia adotada | Cenário A do `05-02`: a #36 cobre teste e implementação, na mesma branch e no mesmo PR |
| Branch-base do #131 | `main` (não depende de outra branch de feature) |

Por isso há **uma** avaliação técnica. Para manter a separação que o refinamento quer garantir, a revisão abaixo distingue o que cada commit traz (teste × implementação × refatoração), em vez de presumir que o teste foi "absorvido" pela implementação.

### Matriz por commit (substitui a matriz entre PRs)

| Critério de análise | `c1a8af0` (RED) | `db56884` (GREEN) | `8c98453` (REFACTOR) |
| --- | --- | --- | --- |
| Sub-Issue | #36 | #36 | #36 |
| Arquivos | `servico.spec.ts` (+31) e stub `servico.ts` (+34) | `servico.ts` (+51 −11) | `servico.ts` (−8) |
| Natureza | Teste do critério 1 + contrato (tipos, assinatura, getters) | Código de produção mínimo | Remoção de código morto |
| Resultado dos testes no commit | 1 falha legítima, 41 passam (`05-01`) | 42/42 (`05-05`) | 42/42 (`06-04`) |
| Critérios atendidos | Nenhum (fase RED) | Critério 1 | Critério 1 (preservado) |
| Critérios pendentes | 1 a 6 | 2 a 6 | 2 a 6 |
| Parecer | Aprovado | Aprovado | Aprovado |

## 3. Avaliação técnica do PR #131

| # | Critério | Avaliação | Resultado |
| --- | --- | --- | --- |
| 1 | Aderência ao escopo | Implementa só o critério 1 da #36, sem validações nem campos fora do teste. O **título do PR** ainda descreve só a fase RED ("teste RED de Servico.publicar"), mas o PR agora contém RED, GREEN e REFACTOR | Atende, com apontamento A1 |
| 2 | Qualidade do design | Agregado imutável (construtor privado, `private readonly`, sem setters), complexidade 1, no padrão do `PerfilEspecialista`. O parâmetro `agora` é recebido e não usado (`servico.ts:31`) | Atende, com apontamento A2 |
| 3 | Respeito aos contratos | Assinatura, tipos e getters fixados no RED estão intactos; o agregado só importa `node:crypto` | Atende |
| 4 | Qualidade dos testes | Padrão AAA, 5 asserções ligadas aos elementos do critério 1, sem `skip` ou condicionais. Lacunas: `descricao` é guardada mas não verificada; não há teste de que duas publicações geram identidades diferentes (o `PerfilEspecialista` tem esse teste) | Atende, com apontamentos A3 e A4 |
| 5 | Preservação de estabilidade | 42/42 unitários, lint e build com exit 0 (`06-04`). O repositório não tem CI: as evidências são só locais | Atende, com apontamento A5 |
| 6 | Rastreabilidade Git | 3 commits atômicos, Conventional Commits, todos com `ref #36`. Os dois primeiros têm assunto em inglês e o terceiro em português | Atende, com apontamento A6 |

**Escopo da Sub-Issue × escopo do PR:** a #36 tem 6 critérios; o PR entrega o critério 1. Isso não é defeito do código, mas impede considerar a #36 concluída (apontamento B1).

## 4. Níveis de revisão

| Nível | Quem | Situação |
| --- | --- | --- |
| Autoavaliação técnica | @leohsm (autor) | Feita: comentário no #131 em 11/11/2026 (fase RED) e esta revisão |
| Parecer de IA | Claude (assistente deste material) | Este documento. **Não é revisão humana** |
| Revisão humana independente | Nenhum outro integrante | **Não realizada.** A equipe tem um integrante. O GitHub não permite aprovar o próprio PR, e a `main` exige 1 aprovação |

Nenhum dos pareceres acima equivale à revisão por pares que a proteção da `main` exige. Isso é registrado como limitação e é tratado na avaliação de integração (`06-07`).

## 5. Apontamentos técnicos

| ID | Arquivo / linha | Descrição | Impacto | Recomendação | Classificação |
| --- | --- | --- | --- | --- | --- |
| A1 | Título do PR #131 | O título "test(oferta): teste RED de Servico.publicar…" não descreve mais o conteúdo (RED + GREEN + REFACTOR) | Rastreabilidade: o título vira a mensagem do merge commit | Renomear para algo como `feat(oferta): modelar Servico.publicar — critério 1 (UC03-SUB-01, ref #36)` | Sugestão de melhoria |
| A2 | `servico.ts:31` | `agora: Date` é recebido e ignorado | O contrato sugere um dado temporal que não existe; a #37 pode modelar a tabela sem saber se haverá `publicadoEm` | Decidir na #36 se vira `publicadoEm` (novo teste RED) ou sai da assinatura. Não é refatoração | Dúvida/esclarecimento |
| A3 | `servico.spec.ts` (bloco Assert) | `descricao` é guardada e exposta, mas nenhuma asserção a verifica | Um erro que troque ou perca a descrição passaria nos testes | Adicionar `expect(servico.descricao).toBe(...)` | Sugestão de melhoria |
| A4 | `servico.spec.ts` | Não há teste de que publicações diferentes recebem identidades diferentes | A regex garante formato de UUID, não unicidade | Teste análogo a "gera identidades diferentes a cada cadastro" do `PerfilEspecialista` | Sugestão de melhoria |
| A5 | Repositório | Sem CI (`gh pr checks` sem checks) | As evidências dependem de execução local | Fora do escopo da #36; registrar como débito do projeto | Sugestão de melhoria |
| A6 | Commits `c1a8af0` e `db56884` | Assunto em inglês; o restante do projeto e o commit `8c98453` usam português | Consistência do histórico | Não reescrever o histórico já publicado; manter português daqui em diante | Sugestão de melhoria |
| B1 | Escopo da #36 | Critérios 2 a 6 sem teste e sem implementação | O PR não conclui a Sub-Issue; integrar agora entregaria à #37 e à #40 um agregado sem validações | Novos ciclos RED → GREEN neste PR antes do merge | **Pendência bloqueante** (para a integração, não para a qualidade do código entregue) |

**Registro no GitHub:** os apontamentos acima ainda **não** foram publicados como comentários no PR #131. A publicação depende de autorização do responsável (é uma ação pública) e será registrada no `06-06`.

## 6. Parecer técnico

| PR | Parecer | Estado formal (Refinamento 2) |
| --- | --- | --- |
| #131 | **Aprovado tecnicamente para o critério 1**, com 6 sugestões/dúvidas não bloqueantes (A1 a A6). **Não concluído quanto ao escopo da #36** (B1) | **Estado A — Tecnicamente revisado.** Não chega ao Estado B: falta a revisão humana independente e a pendência B1 está aberta |

O código entregue é correto, simples e bem testado para o que se propõe. A aprovação técnica deste parecer **não autoriza o merge**: essa decisão é tratada no `06-07`.
