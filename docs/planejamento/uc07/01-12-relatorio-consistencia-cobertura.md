# 01-12 — Relatório de consistência e cobertura

**Caso de uso:** UC07 — Aceitar Proposta

## Quantidades

- **Issue principal:** 1 (`[UC07] Aceitar Proposta`).
- **Sub-Issues:** 6 (SUB-01 a SUB-06).
- **Labels novas:** 1 (`usecase:uc07`); `domain:negociacao` vem do UC05 e as demais são reutilizadas do UC02.

## Cobertura

| Elemento da especificação | Total | Cobertos | Parcial | Sem cobertura |
| --- | --- | --- | --- | --- |
| Pré-condições | 1 | 1 | 0 | 0 |
| Pós-condições (incluindo a de `trabalho3.md` §11.1) | 3 | 3 | 0 | 0 |
| Passos do fluxo principal | 6 | 5 | 0 | 1 (passo 4) |
| Fluxos de exceção | 4 | 3 (FE-01, FE-02, FE-03) | 0 | 1 (FE-04) |
| Regras de negócio | 4 | 3 (RN04, RN05, RN13) | 0 | 1 (RN11) |
| Invariantes e cardinalidade | 3 | 3 | 0 | 0 |

As lacunas vêm todas da decisão D-UC07-01 (Representante fora do MVP), não de esquecimento.

## Dependências críticas

1. **UC06 — Enviar Proposta.** Não foi especificado nem planejado. Bloqueia SUB-01, SUB-02, SUB-03 e SUB-05. É o maior impedimento do épico.
2. **Concorrência entre aceite e nova versão (TC-C3-01).** A SUB-03 resolve o lado do aceite; o UC06 precisa respeitar o mesmo controle ao gravar nova versão.
3. **UC05.** A SUB-04 usa a Solicitação (UC05-SUB-02) e a porta de aviso (UC05-SUB-03); a SUB-05 usa `POST /solicitacoes` (UC05-SUB-05).

## Decisões que dependem de validação

| ID | Decisão | Quem decide | Quando |
| --- | --- | --- | --- |
| D1 | Origem do `clienteId` | @leohsm | Antes da SUB-05 |
| D-UC07-01 | Representante fora do épico | @leohsm | Antes de mover o épico para `Ready` |
| D-UC07-02 | Especialista suspenso e aceite | Domínio | Antes da SUB-04 |
| D-UC07-03 | Identificação da versão | @leohsm, junto com o UC06 | Antes da SUB-01 |
| D-UC07-04 | Validade vencida no aceite | @leohsm (domínio) | Antes da SUB-01 |
| D-UC07-05 | Repetição do aceite após resposta perdida | @leohsm | Antes da SUB-04 |
| D-UC07-06 | Contratação sem ciclo de vida | @leohsm | Antes do UC09 |
| D-UC07-07 | Agente diferente do cliente → 403 | @leohsm | Antes da SUB-04 |
| D-UC07-08 | Tradução HTTP | @leohsm | Antes da SUB-05 |
| D-UC07-09 | Cliente e especialista lidos da Solicitação | @leohsm, junto com o UC06 | Antes da SUB-04 |

## Riscos e recomendações

| Risco | Impacto | Recomendação |
| --- | --- | --- |
| UC06 definir a Proposta de forma incompatível com este planejamento | Retrabalho em SUB-01 a SUB-03 | Especificar o UC06 usando os critérios deste épico como requisitos |
| Duas Contratações para a mesma Proposta | Viola RN04/CARD-01; dois acordos para uma negociação | Teste de concorrência na SUB-03 e na SUB-05; mesma suíte de contrato no adaptador durável |
| Aceite gravado sem Contratação (ou o contrário) | Acordo sem origem ou proposta aceita sem acordo | Uma única operação de gravação; nunca duas chamadas separadas |
| Snapshot que referencia objetos mutáveis | Mudança no Serviço altera o acordo | Cópia profunda e teste de imutabilidade (SUB-02) |
| `clienteId` no corpo (D1) | Qualquer cliente HTTP pode aceitar em nome de outro | Limitação documentada (SUB-06); issue futura de autenticação |

**Recomendação para o início:** especificar e planejar o UC06 antes de qualquer issue do UC07. Depois, começar por SUB-01 e SUB-02 em paralelo e dar atenção especial à SUB-03.
