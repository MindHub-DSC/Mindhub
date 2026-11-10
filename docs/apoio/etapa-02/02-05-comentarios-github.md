# 02-05 — Comentários técnicos para o GitHub

Os comentários abaixo registram a **pré-análise automatizada** em cada Sub-Issue. Eles foram publicados no GitHub em 10/11/2026. O template ao final serve para o **registro da revisão humana**, que ainda não foi feita.

<!-- C:SUB-01:START -->
### 🔎 Pré-análise técnica (assistida por IA) — SUB-01

> Esta pré-análise não substitui a revisão humana. Revisor designado: @leohsm (autorrevisão — trabalho individual).

**Elementos avaliados:** título, objetivo, escopo, critérios de aceite, dependências, labels e suficiência para iniciar.

**Resultado:** conforme.

**Observações:**
- A assinatura `reconhecer(usuarioId): Promise<boolean>` é uma proposta. Como esta issue fornece o contrato da SUB-04 (#5), a assinatura acordada deve ser registrada aqui antes de a SUB-04 ser puxada.
- A reorganização de Usuários em um módulo de C1 deve manter `test/usuarios.spec.ts` passando.

**Condições para `Ready`:** registro da revisão humana (DoR-07).
<!-- C:SUB-01:END -->

<!-- C:SUB-02:START -->
### 🔎 Pré-análise técnica (assistida por IA) — SUB-02

> Esta pré-análise não substitui a revisão humana. Revisor designado: @leohsm (autorrevisão — trabalho individual).

**Elementos avaliados:** título, objetivo, escopo, critérios de aceite, dependências, labels e suficiência para iniciar.

**Resultado:** ajustes necessários — **já aplicados na descrição** em 10/11/2026.

**Ajustes aplicados:**
- Incluída a divisão da validação: o domínio protege as invariantes; o schema HTTP (SUB-05, #6) cuida do formato e dos campos não previstos.
- Especialidades repetidas passam a ser comparadas após `trim` e conversão para minúsculas.
- Os testes verificam presença e formato de `id` e `criadoEm`, sem depender de valores exatos.

**Decisões registradas:** D2 (situação inicial `ATIVO`) e D3 (recusar especialidades repetidas), tomadas por @leohsm em 10/11/2026.

**Condições para `Ready`:** validar os ajustes e registrar a revisão humana (DoR-07).
<!-- C:SUB-02:END -->

<!-- C:SUB-03:START -->
### 🔎 Pré-análise técnica (assistida por IA) — SUB-03

> Esta pré-análise não substitui a revisão humana. Revisor designado: @leohsm (autorrevisão — trabalho individual).

**Elementos avaliados:** título, objetivo, escopo, critérios de aceite, dependências, labels e suficiência para iniciar.

**Resultado:** ajuste necessário — **já aplicado na descrição** em 10/11/2026.

**Ajuste aplicado:**
- O erro de unicidade passa a ser o erro de domínio `PerfilJaExistente`, definido nesta issue e repassado pela SUB-04 (#5). Antes, as duas issues usavam nomes diferentes.
- Incluída nota: adaptadores futuros (banco de dados) devem garantir a unicidade de forma atômica.

**Observação:** o critério "sem `await` entre verificação e inserção" é verificado por inspeção de código; anexar o trecho no PR.

**Condições para `Ready`:** validar o ajuste e registrar a revisão humana (DoR-07).
<!-- C:SUB-03:END -->

<!-- C:SUB-04:START -->
### 🔎 Pré-análise técnica (assistida por IA) — SUB-04

> Esta pré-análise não substitui a revisão humana. Revisor designado: @leohsm (autorrevisão — trabalho individual).

**Elementos avaliados:** título, objetivo, escopo, critérios de aceite, dependências, labels e suficiência para iniciar.

**Resultado:** ajuste necessário — **já aplicado na descrição** em 10/11/2026.

**Ajuste aplicado:**
- Novo critério: uma violação de invariante do perfil é propagada como erro de validação, sem acionar o armazenamento.
- Esclarecido que a garantia de unicidade pertence ao repositório (SUB-03, #4).

**Observação:** a dependência da SUB-02 (#3) é de implementação (o serviço usa a criação real do perfil). As dependências da SUB-01 (#2) e da SUB-03 (#4) são de contrato e podem ser substituídas por dublês nos testes.

**Condições para `Ready`:** validar o ajuste e registrar a revisão humana (DoR-07).
<!-- C:SUB-04:END -->

<!-- C:SUB-05:START -->
### 🔎 Pré-análise técnica (assistida por IA) — SUB-05

> Esta pré-análise não substitui a revisão humana. Revisor designado: @leohsm (autorrevisão — trabalho individual).

**Elementos avaliados:** título, objetivo, escopo, critérios de aceite, dependências, labels e suficiência para iniciar.

**Resultado:** não pronta.

**Problema:** a decisão **D1 — origem da identidade do agente** está pendente. O Trabalho 4 (§6.2 e §13.1) indica que o ID informado pelo cliente HTTP não deve substituir a identidade autenticada, mas não existe autenticação implementada nem mecanismo escolhido. Sem essa decisão, o contrato de entrada do endpoint não pode ser fechado.

**Ajuste necessário:** registrar nesta issue a decisão D1 e, se preciso, ajustar o critério "A origem de `usuarioId` segue a decisão D1".

**Condições para `Ready`:** D1 registrada (DoR-05) e revisão humana registrada (DoR-07).
<!-- C:SUB-05:END -->

<!-- C:SUB-06:START -->
### 🔎 Pré-análise técnica (assistida por IA) — SUB-06

> Esta pré-análise não substitui a revisão humana. Revisor designado: @leohsm (autorrevisão — trabalho individual).

**Elementos avaliados:** título, objetivo, escopo, critérios de aceite, dependências, labels e suficiência para iniciar.

**Resultado:** ajuste aplicado; issue ainda não pronta.

**Ajuste aplicado:** o critério "sem criar outro usuário" não era verificável por HTTP (não há consulta de usuários). Foi reescrito: o `usuarioId` do perfil deve ser igual ao `id` retornado por `POST /usuarios`.

**Pendência:** os testes HTTP dependem do contrato da SUB-05 (#6), que aguarda a decisão D1.

**Condições para `Ready`:** D1 registrada na SUB-05 (DoR-05) e revisão humana registrada (DoR-07).
<!-- C:SUB-06:END -->

<!-- C:SUB-07:START -->
### 🔎 Pré-análise técnica (assistida por IA) — SUB-07

> Esta pré-análise não substitui a revisão humana. Revisor designado: @leohsm (autorrevisão — trabalho individual).

**Elementos avaliados:** título, objetivo, escopo, critérios de aceite, dependências, labels e suficiência para iniciar.

**Resultado:** conforme.

**Observação:** a descrição do caso de uso e das regras pode começar já. A seção da API depende da SUB-05 (#6), e a verificação dos exemplos depende da integração (SUB-06, #7).

**Condições para `Ready`:** registro da revisão humana (DoR-07).
<!-- C:SUB-07:END -->

---

## Template de registro da revisão humana

```markdown
### 📋 Registro de Revisão de Planejamento

**Revisor:** @leohsm (autorrevisão — trabalho individual)
**Issue:** [SUB-XX] - [Título da Sub-Issue]
**Data da Revisão:** [DD/MM/AAAA]
**Resultado:** [ ] Aprovada sem ressalvas | [ ] Aprovada com ajustes menores | [ ] Ajustes necessários solicitados

**Observações Técnicas:**
- [Pontos verificados na especificação e nos critérios de aceite]

**Ajustes Solicitados:**
- [Ajustes que ainda precisam ser aplicados, se houver]

**Conclusão e Prontidão:**
- [Liberada para `Ready` ou mantida em `Backlog`, e por quê]
```
