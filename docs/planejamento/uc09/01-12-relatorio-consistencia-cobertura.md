# 01-12 — Relatório de consistência e cobertura

**Caso de uso:** UC09 — Agendar Sessão Contratada

## Quantidades

- **Issue principal:** 1 (`[UC09] Agendar Sessão Contratada`).
- **Sub-Issues:** 7 (SUB-01 a SUB-07): 2 em C3, 5 em C4.
- **Labels novas:** `usecase:uc09`.

## Cobertura

| Elemento da especificação | Total | Cobertos | Parcial | Sem cobertura |
| --- | --- | --- | --- | --- |
| Pré-condições | 1 | 1 | 0 | 0 |
| Pós-condições | 3 | 2 | 1 | 0 |
| Passos do fluxo principal | 6 | 6 | 0 | 0 |
| Fluxos alternativos | 2 | 2 | 0 | 0 |
| Fluxos de exceção | 7 | 7 | 0 | 0 |
| Regras de negócio | 4 | 3 | 1 | 0 |
| Invariantes | 1 | 1 | 0 | 0 |

As coberturas parciais são decisões declaradas: POS-03 — exclusividade das retenções é hipótese de T4 §8.1.4 (D-UC09-05); RN11 — o vínculo organizacional depende de UC16/UC17 (Futuro); só o cliente individual é verificado.

## Dependências críticas

1. **D-UC09-02 e D-UC09-05.** Definem o que bloqueia um horário; mudar depois altera o repositório e os testes de concorrência.
2. **UC10.** Depende de SUB-01, SUB-03 e SUB-05 (Reserva, prazo, valor esperado e liberação).
3. **UC07.** Sem a Contratação formada a SUB-04 só é verificável com dublês.

## Decisões que dependem de validação

| ID | Decisão | Natureza | Quem decide | Quando |
| --- | --- | --- | --- | --- |
| D-UC09-01 | Pacotes: quando a Contratação prevê várias sessões, uma Reserva por sessão ou várias de uma vez? Este planejamento trata uma Reserva por chamada. | Dúvida documentada | @leohsm (domínio) | Antes da SUB-03 |
| D-UC09-02 | Disponibilidade do especialista: o que torna um horário disponível além de não colidir com outras Reservas (lacuna `casos-de-uso.md` §8)? | Dúvida documentada | @leohsm (domínio) | Antes da SUB-02 |
| D-UC09-03 | Intervalo de preparação entre sessões: precisa de validação do domínio. Não implementado. | Dúvida documentada | @leohsm (domínio) | Antes de uso real |
| D-UC09-04 | Prazo numérico da retenção e prazo de histórico das operações. Proposta: valor configurável. | Dúvida documentada | @leohsm (domínio) | Antes da SUB-03 |
| D-UC09-05 | Exclusividade das retenções (não só das confirmadas): hipótese de T4 §8.1.4 que complementa RN03. | Dúvida documentada | @leohsm (domínio) | Antes da SUB-02 |
| D-UC09-06 | Intervalos com início incluído e fim excluído (proposta de T4 §8.1.4). | Proposta técnica | @leohsm | Antes da SUB-01 |
| D-UC09-07 | Mecanismo de expiração: verificação no momento do acesso mais varredura periódica no processo, com relógio injetável. | Proposta técnica | @leohsm | Antes da SUB-05 |
| D-UC09-08 | Persistência em memória nesta etapa; exclusão de sobreposição no banco só na persistência durável. | Proposta técnica | @leohsm | Antes da SUB-02 |
| D-UC09-09 | Origem do identificador do Cliente (D1). | Dúvida documentada | @leohsm | Antes da SUB-06 |
| D-UC09-10 | Rota e códigos HTTP: `POST /contratacoes/{id}/reservas`; 409 horário ocupado e conflito de identificação, 422 intervalo inválido, 403 ator não cliente. | Proposta técnica | @leohsm | Antes da SUB-06 |

## Riscos e recomendações

| Risco | Impacto | Recomendação |
| --- | --- | --- |
| Corrida entre verificar e gravar | Duas Reservas válidas para o mesmo horário | Seção crítica por especialista e teste de concorrência repetido (SUB-02) |
| Repetição que renova a retenção | Prazo estendido sem pagamento | Teste de repetição após a expiração (SUB-03) |
| Memória como único armazenamento | Perda das Reservas ao reiniciar; sem exclusão no banco | Aceitar nesta etapa; exigir restrição de exclusão na persistência durável |

**Recomendação para o início:** responder D-UC09-02, D-UC09-04 e D-UC09-05, iniciar por SUB-01 e SUB-02 e antecipar a SUB-05 para liberar o UC10.
