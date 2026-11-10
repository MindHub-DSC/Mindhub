# 01-09 — Distribuição de responsabilidades

**Equipe:** um integrante — Leonardo Herrero S. Martins (@leohsm).

| Issue | Atividade técnica | Responsável | Dependências de execução | Estado inicial |
| --- | --- | --- | --- | --- |
| Épico | [UC02] Cadastrar Perfil de Especialista | @leohsm | — | `Backlog` |
| SUB-01 | Interface pública de reconhecimento (C1) | @leohsm | — | `Backlog` |
| SUB-02 | Modelo de domínio do perfil | @leohsm | D2, D3 | `Backlog` |
| SUB-03 | Contrato de persistência e adaptador | @leohsm | SUB-02 (contrato) | `Backlog` |
| SUB-04 | Serviço de aplicação | @leohsm | SUB-01, SUB-02, SUB-03 (contratos) | `Backlog` |
| SUB-05 | Endpoint HTTP | @leohsm | SUB-04 (contrato); D1 | `Backlog` |
| SUB-06 | Integração e testes HTTP | @leohsm | SUB-01, SUB-03, SUB-04, SUB-05 (implementações) | `Backlog` |
| SUB-07 | Documentação | @leohsm | SUB-05 (contrato, só a seção da API) | `Backlog` |

## Recomendações de comunicação e alinhamento

- Como o trabalho é individual, a comunicação serve sobretudo ao **registro**: decisões (D1 a D3), assinaturas de contratos e impedimentos devem ser escritos como comentários nas issues correspondentes, para que possam ser recuperados.
- A revisão de cada issue será feita pelo próprio integrante. Isso deve ser declarado como **autorrevisão**, e não como revisão independente.
- Antes de começar uma atividade que consome um contrato, registrar na issue fornecedora a assinatura acordada.
