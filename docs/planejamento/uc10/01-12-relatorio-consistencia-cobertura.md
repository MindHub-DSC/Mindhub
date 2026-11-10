# 01-12 — Relatório de consistência e cobertura

**Caso de uso:** UC10 — Pagar Reserva

## Quantidades

- **Issue principal:** 1 (`[UC10] Pagar Reserva`).
- **Sub-Issues:** 8 (SUB-01 a SUB-08): 4 de C5, 2 de C4, 1 de integração e 1 de documentação.
- **Labels novas:** 3 (`usecase:uc10`, `domain:pagamentos`, `domain:agenda`); `layer:adapter` vem do UC05 e as demais são reutilizadas do UC02.

## Cobertura

| Elemento da especificação | Total | Cobertos | Parcial | Sem cobertura |
| --- | --- | --- | --- | --- |
| Pré-condições | 1 | 1 | 0 | 0 |
| Pós-condições | 2 | 2 | 0 | 0 |
| Passos do fluxo principal | 7 | 7 | 0 | 0 |
| Fluxos alternativos e de exceção | 7 | 2 (FE-01, FE-03) | 5 (FA-01, FA-02, FA-03, FE-02, FE-04) | 0 |
| Regras de negócio | 5 | 5 (RN02, RN03, RN06, RN07, RN08) | 0 | 0 |
| Invariantes | 2 | 2 | 0 | 0 |

As coberturas parciais são decisões declaradas: FA-01 e FA-03 dependem de D-UC10-01; FA-02 cobre só a expiração informada pelo provedor (D-UC10-05); FE-02 registra a divergência sem política de reconciliação (D-UC10-08); FE-04 não presume resultado, mas não o recupera ativamente (D-UC10-07).

## Dependências críticas

1. **UC09 — reter horário.** Não foi especificado nem planejado. Bloqueia SUB-03, SUB-06 e SUB-07. O UC09 precisa entregar Reserva retida com prazo, valor esperado (C01) e espaço para a correlação do Pagamento.
2. **Contrato C02 entre SUB-05 e SUB-06.** É a fronteira de autoridade entre C5 e C4. Se C5 passar a decidir a Reserva, o TC-C5-02 fica invalidado.
3. **D-UC10-01.** Enquanto o conflito entre FA-01 e FA-03 não for decidido, a SUB-06 não pode ir para `Ready`.
4. **UC07.** A jornada de ponta a ponta (SUB-07) começa com uma Contratação formada pelo UC07.

## Decisões que dependem de validação

| ID | Decisão | Quem decide | Quando |
| --- | --- | --- | --- |
| D1 | Origem do `clienteId` | @leohsm | Antes da SUB-07 |
| D-UC10-01 | Recusa libera a Reserva ou permite nova tentativa no prazo | Domínio | Antes da SUB-06 |
| D-UC10-02 | Provedor real e autenticação do retorno | @leohsm | Antes da SUB-07 (segredo compartilhado); antes de uso real (provedor) |
| D-UC10-03 | Um Pagamento pendente por Reserva | @leohsm (domínio) | Antes da SUB-03 |
| D-UC10-04 | Entrega do fato dentro do processo | @leohsm | Antes da SUB-05 |
| D-UC10-05 | Expiração só por resultado do provedor | @leohsm | Antes da SUB-05 |
| D-UC10-06 | Validade conferida pelo relógio de C4 | @leohsm | Antes da SUB-06 |
| D-UC10-07 | Sem recuperação ativa do resultado desconhecido | @leohsm | Antes da SUB-04 |
| D-UC10-08 | Divergências só registradas | Domínio | Antes de uso real |
| D-UC10-09 | Tradução HTTP | @leohsm | Antes da SUB-07 |
| D-UC10-10 | Aviso ao Cliente pela porta de C4 | @leohsm | Antes da SUB-06 |

## Riscos e recomendações

| Risco | Impacto | Recomendação |
| --- | --- | --- |
| Confirmação duplicada por reentrega do fato com outro identificador | Viola RN06 | Deduplicar por Pagamento + versão + Reserva, nunca pelo identificador do fato (SUB-06) |
| Efeito gravado sem marcação, ou o contrário | Efeito perdido ou reaplicado após falha | Uma única operação atômica em C4; teste de falha simulada |
| Fatos pendentes perdidos ao reiniciar (outbox em memória) | Pagamento `Aprovado` sem Reserva confirmada | Aceitável em memória; outbox durável é requisito da persistência |
| Retorno do provedor sem autenticação | Qualquer cliente HTTP poderia aprovar pagamentos | Segredo compartilhado já na SUB-07; documentar como limitação (SUB-08) |
| Pagamento `Pendente` para sempre (FE-04) | Reserva retida até o prazo de C4 vencer | Documentar; planejar consulta ativa ao provedor em épico futuro |
| Aprovação tardia sem política de compensação | Cliente cobrado sem horário | Registrar a divergência; definir a política antes de uso real (D-UC10-08) |

**Recomendação para o início:** começar por SUB-01, SUB-02 e SUB-05, que não dependem do UC09 e exercitam o contrato C02 do lado de C5. Especificar o UC09 em paralelo e pedir ao domínio a resposta de D-UC10-01.
