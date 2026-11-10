# 01-12 — Relatório de consistência e cobertura

## Quantitativos

| Item | Quantidade |
| --- | --- |
| Issue principal (épico) | 1 |
| Sub-Issues | 7 |
| Labels planejadas | 15 |
| Regras do caso de uso | 5 (RN-UC02-01 a 05) |
| Fluxos | 1 principal, 1 alternativo, 3 de exceção |
| Decisões registradas | 4 (D1 a D4); D2 e D3 decididas, D1 pendente, D4 fora do escopo |

## Cobertura

Todos os passos do fluxo principal, o fluxo alternativo, as três exceções, as cinco regras e as validações de entrada estão associados a pelo menos uma Sub-Issue e a um critério de aceite ([01-05](01-05-matriz-rastreabilidade.md)).

## Dependências críticas

- **Caminho crítico:** `SUB-02 → SUB-03 → SUB-04 → SUB-05 → SUB-06`.
- **Contratos que liberam paralelismo:** interface de reconhecimento (SUB-01), formato do perfil (SUB-02) e contrato de persistência (SUB-03).
- **Decisão no caminho crítico:** D1 (origem da identidade) condiciona a SUB-05 e, por consequência, a SUB-06.

## Decisões que dependem de validação do estudante

| ID | Decisão | Proposta deste planejamento |
| --- | --- | --- |
| D1 | Origem de `usuarioId` | Decidir antes da SUB-05; o T4 indica que o ID enviado pelo cliente não deve substituir a identidade autenticada |
| D2 | Situação inicial | **Decidida (10/11/2026):** `ATIVO` |
| D3 | Especialidades repetidas | **Decidida (10/11/2026):** recusar (400), sem diferenciar maiúsculas e minúsculas |
| D4 | Persistência durável | Fora do escopo; adaptador em memória |
| — | Código UC02 e rota `POST /especialistas` | Propostas; o projeto não tem numeração formal de casos de uso |

## Riscos técnicos

| Risco | Onde | Mitigação |
| --- | --- | --- |
| Unicidade violada por verificação e inserção separadas | SUB-03 | Verificar e inserir na mesma operação; teste específico |
| Regressão do cadastro de usuário ao reorganizar C1 | SUB-01 | Manter `test/usuarios.spec.ts` passando |
| Contrato HTTP instável enquanto D1 estiver aberta | SUB-05, SUB-06, SUB-07 | Decidir D1 antes de puxar a SUB-05 |
| Acoplamento de C2 ao modelo completo de Usuário | SUB-01, SUB-04 | Interface restrita e critério de aceite específico |

## Recomendações para o início da implementação

1. Aplicar a Definition of Ready e registrar a revisão de cada Sub-Issue.
2. Registrar nas issues fornecedoras as assinaturas dos contratos (SUB-01, SUB-02 e SUB-03) antes de puxar as consumidoras.
3. Decidir D1 cedo, porque ela está no caminho crítico.
