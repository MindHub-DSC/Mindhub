# 01-12 — Relatório de consistência e cobertura

**Caso de uso:** UC16 — Registrar Organização

## Quantidades

- **Issue principal:** 1 (`[UC16] Registrar Organização`).
- **Sub-Issues:** 5 (SUB-01 a SUB-05): 5 em C1.
- **Labels novas:** `usecase:uc16`.

## Cobertura

| Elemento da especificação | Total | Cobertos | Parcial | Sem cobertura |
| --- | --- | --- | --- | --- |
| Pré-condições | 1 | 1 | 0 | 0 |
| Pós-condições | 2 | 2 | 0 | 0 |
| Passos do fluxo principal | 4 | 4 | 0 | 0 |
| Fluxos de exceção | 3 | 3 | 0 | 0 |
| Regras de negócio | 1 | 1 | 0 | 0 |
| Invariantes | 1 | 1 | 0 | 0 |

Não há cobertura parcial: todos os itens documentados têm Sub-Issue e critério de aceite.

## Dependências críticas

1. **D-UC16-01.** Define o que é uma Organização; mudar depois afeta o modelo, a migration e a API.
2. **UC17 e UC15.** Dependem do formato do Vínculo definido aqui.

## Decisões que dependem de validação

| ID | Decisão | Natureza | Quem decide | Quando |
| --- | --- | --- | --- | --- |
| D-UC16-01 | Quais dados identificam uma Organização (nome, documento fiscal)? Não documentado. Proposta: apenas o nome. | Dúvida documentada | @leohsm (domínio) | Antes da SUB-01 |
| D-UC16-02 | Pode existir mais de uma Organização com os mesmos dados? Não documentado; nenhuma unicidade assumida. | Dúvida documentada | @leohsm (domínio) | Antes da SUB-02 |
| D-UC16-03 | Há verificação de que a pessoa realmente representa a organização? Não documentado; nenhuma verificação criada. | Dúvida documentada | @leohsm (domínio) | Antes de uso real |
| D-UC16-04 | Papel do vínculo do criador: representante (documentado); a lista de papéis é indefinida (T3 §6.1). | Dúvida documentada | @leohsm (domínio) | Antes da SUB-01 |
| D-UC16-05 | Origem do identificador do Usuário (D1). | Dúvida documentada | @leohsm | Antes da SUB-04 |
| D-UC16-06 | Rota e códigos HTTP: `POST /organizacoes`; 404/422 usuário não reconhecido, 400 formato. | Proposta técnica | @leohsm | Antes da SUB-04 |
| D-UC16-07 | Organização e vínculo gravados na mesma transação. | Proposta técnica | @leohsm | Antes da SUB-02 |

## Riscos e recomendações

| Risco | Impacto | Recomendação |
| --- | --- | --- |
| Dados da Organização inventados | Retrabalho quando o domínio decidir | Manter só o nome e marcá-lo como D-UC16-01 |
| Organização sem representante por falha parcial | Organização inalcançável | Transação única e teste de falha simulada (SUB-02) |
| Representação não verificada | Qualquer Usuário se declara representante | Documentar como limitação; decisão do domínio (D-UC16-03) |

**Recomendação para o início:** responder D-UC16-01 e D-UC16-04 e planejar o UC17 em seguida, pois reutiliza o Vínculo; não iniciar antes de revisar a classificação Futuro.
