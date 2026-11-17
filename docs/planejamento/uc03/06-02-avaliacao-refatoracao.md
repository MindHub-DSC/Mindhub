# 06-02 — Avaliação da necessidade de refatoração

**Caso de uso:** UC03 — Publicar Serviço (épico [#35](https://github.com/MindHub-DSC/Mindhub/issues/35))
**Sub-Issue:** [#36](https://github.com/MindHub-DSC/Mindhub/issues/36)
**Código analisado:** `mindhub-backend/src/oferta/dominio/servico.ts` @ `db56884` (código completo no `06-01`)
**Referência de padrão:** agregado irmão `mindhub-backend/src/oferta/dominio/perfil-especialista.ts`
**Data:** 17/11/2026

## 1. Análise pelos critérios de qualidade

| # | Critério | Avaliação | Classificação |
| --- | --- | --- | --- |
| 1 | Clareza e nomenclatura | `publicar`, `perfilId`, `titulo`, `modeloContratacao`, `situacao` vêm da linguagem do UC03 e seguem o padrão do `PerfilEspecialista` (`cadastrar`, `usuarioId`) | Adequado |
| 2 | Coesão e responsabilidade | `Servico` só cria e expõe o Serviço. Porém o arquivo também declara e exporta `NaoImplementado`, um erro técnico da fase RED sem relação com o domínio. No módulo, os erros de domínio ficam em `erros.ts` | **Problema comprovado** (D1) |
| 3 | Duplicação (DRY) | Nenhuma dentro do arquivo. O padrão "construtor privado + getters" se repete com `PerfilEspecialista`; duas ocorrências não justificam uma abstração comum | Adequado |
| 4 | Complexidade desnecessária | Complexidade ciclomática 1 em todos os métodos; sem condicionais, laços ou abstrações prematuras | Adequado |
| 5 | Acoplamento e limites arquiteturais | Só importa `node:crypto`. Sem Nest, ORM ou HTTP: respeita a camada de domínio | Adequado |
| 6 | Legibilidade e manutenibilidade | Boa. Os comentários explicam a fábrica e citam o critério 1 da #36. A presença de `NaoImplementado` sugere ao leitor que algo ainda está sem implementar, o que não é verdade | Afetado por D1 |
| 7 | Testabilidade | Fábrica estática sem dependências externas; testada sem mocks | Adequado |
| 8 | Preservação de contratos | Assinatura de `publicar`, tipos `ModeloContratacao`/`SituacaoServico` e os 6 getters estão como o RED fixou | Adequado |

### Evidência do D1

```text
$ grep -rn "NaoImplementado" src test
src/oferta/dominio/servico.ts:8:export class NaoImplementado extends Error {
src/oferta/dominio/servico.ts:11:    this.name = 'NaoImplementado';
```

As duas ocorrências são a própria declaração da classe. Nenhum arquivo de `src/` ou `test/` a importa ou lança. É **código morto exportado**: faz parte da API pública do módulo de domínio sem ter função.

## 2. Distinção: refatoração × correção de defeito × evolução

| Conceito | Definição aplicada | Itens |
| --- | --- | --- |
| **Refatoração** | Muda a estrutura interna; os testes continuam passando da mesma forma | D1 |
| **Correção de defeito** | Corrige comportamento incorreto ou inesperado | Nenhum: o código faz exatamente o que o critério 1 exige |
| **Evolução funcional** | Nova regra ou critério ainda não coberto; entra por novo ciclo RED → GREEN | D2, D3, D5, D6, D7 |

## 3. Classificação dos débitos do `05-06`

| # | Item | Muda comportamento observável? | Classificação | Destino |
| --- | --- | --- | --- | --- |
| D1 | Remover `NaoImplementado` | Não: nada a usa | **Problema comprovado** (refatoração) | Fase 4 deste material |
| D2 | `agora` recebido e ignorado | Sim. Guardar `publicadoEm` cria estado e getter novos (como o `criadoEm` do `PerfilEspecialista`); tirar `agora` da assinatura quebra o contrato do RED | **Evolução futura** | Decisão registrada na #36 + teste RED |
| D3 | Título, descrição e `perfilId` aceitam vazio (D-UC03-01) | Sim: passaria a lançar erro | **Evolução futura** | RED do critério 5 |
| D4 | `SituacaoServico` sem objeto como `situacao-perfil.ts` | Não | **Oportunidade opcional, adiada**: com uma única situação seria abstração prematura | Quando surgir a 2ª situação |
| D5 | `ModeloContratacao` não validado em execução | Sim | **Evolução futura** | RED do critério 2 |
| D6 | Falta o erro `ServicoInvalido` (como `PerfilInvalido` em `erros.ts`) | Sim: só existe junto com validações | **Evolução futura** | Com D3 e D5 |
| D7 | Falta `reconstituir` | Sim: operação nova | **Evolução futura** | RED do critério 6 |

Revisão da prioridade 2 do `05-06` (comentário de classe citando D-UC03-01 a 03): **não adotada**. Essas decisões tratam de validações que ainda não existem. O comentário descreveria regras não implementadas; ele entra junto com o código que as aplica.

## 4. Parecer

**Cenário A — Refatoração recomendada, com escopo mínimo:** remover a classe `NaoImplementado` de `servico.ts`.

Justificativa:

- É o único problema estrutural comprovado, com evidência (`grep` sem nenhum uso).
- A remoção não altera o comportamento observável: `publicar`, os tipos e os getters ficam idênticos, e o teste do critério 1 não depende da classe.
- Melhora a coesão do arquivo (só o agregado e seus tipos) e elimina a falsa indicação de algo pendente.
- O restante do código já está simples, coeso e no padrão do agregado irmão. Qualquer outra mudança seria refatoração artificial ou evolução disfarçada.

## 5. Riscos

| Risco | Mitigação |
| --- | --- |
| Algum código importar `NaoImplementado` fora do que o `grep` cobre | `pnpm build` (compilação TypeScript) e `pnpm lint` falham se houver import quebrado |
| Introduzir validação ou campo novo sob o rótulo de refatoração | Escopo limitado a apagar a classe; D2 a D7 ficam fora, como evoluções |
| Regressão invisível | Reexecutar o teste específico e a suíte completa (linha de base: 1/1 e 42/42) logo após a alteração |

## 6. Ações seguintes

1. **Fase 4:** na branch `feature/36-uc03-modelar-servico`, remover `NaoImplementado`, reexecutar o teste específico e a suíte, e registrar no `06-03`.
2. **Fora deste material:** registrar na #36 a decisão pendente sobre `agora`/`publicadoEm` (D2) e seguir com os ciclos RED → GREEN dos critérios 2 a 6.
