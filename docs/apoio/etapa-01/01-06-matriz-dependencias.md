# 01-06 — Matriz de dependências

**Caso de uso:** UC02 — Cadastrar Perfil de Especialista

| Atividade | Depende de | Justificativa técnica | Condição de desbloqueio | Paralelismo possível |
| --- | --- | --- | --- | --- |
| SUB-01 | — | Altera apenas C1 | — | Sim, desde o início |
| SUB-02 | D2, D3 (decisões) | Situação inicial e tratamento de repetições afetam as invariantes | Desbloqueada: D2 e D3 decididas em 10/11/2026 | Sim, com a SUB-01 |
| SUB-03 | SUB-02 | O repositório armazena o tipo `PerfilEspecialista` | Formato do perfil acordado (não precisa da implementação) | Sim, com a SUB-04, após o acordo do formato |
| SUB-04 | SUB-01, SUB-02, SUB-03 | O serviço chama as três abstrações | Assinaturas acordadas; implementação pode usar dublês | Sim, com a SUB-03 |
| SUB-05 | SUB-04; D1 | O controller chama o serviço; a origem de `usuarioId` define o contrato HTTP | Assinatura do serviço acordada e D1 decidida | Sim, com a SUB-07, após D1 |
| SUB-06 | SUB-01, SUB-03, SUB-04, SUB-05 | Testes de ponta a ponta exigem os componentes reais conectados | Implementações concluídas | Não; é o ponto de integração |
| SUB-07 | SUB-05 (só a seção da API) | Exemplos dependem do formato final do endpoint | Endpoint definido | Sim, a descrição do caso de uso pode começar antes |

## Verificação de ciclos

Não há dependências circulares. A ordem topológica é: `SUB-01, SUB-02 → SUB-03 → SUB-04 → SUB-05 → SUB-06`, com a SUB-07 paralela a partir do acordo de contratos.

## Caminho crítico

`SUB-02 → SUB-03 → SUB-04 → SUB-05 → SUB-06`. A decisão D1 está no caminho crítico, porque condiciona a SUB-05.
