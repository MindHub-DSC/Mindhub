# 01-01 — Análise técnica do caso de uso

**Projeto:** Mindhub — Plataforma de Mentorias e Consultorias
**Caso de uso:** UC10 — Pagar Reserva
**Etapa:** 01 — Do Caso de Uso ao Planejamento da Implementação
**Data:** 10/11/2026
**Responsável:** Leonardo Herrero S. Martins (@leohsm) — trabalho individual

## Legenda de fontes

| Marca | Significado |
| --- | --- |
| **[T3]** | `docs/trabalhos/trabalho3.md` — modelo conceitual (RN02, RN03, RN06 a RN08, ciclos da Reserva e do Pagamento, invariantes) |
| **[T4]** | `docs/trabalhos/trabalho4.md` — C4, C5, R4, R6, contratos C01 e C02, TC-C5-01, TC-C5-02, ADR-03 |
| **[T5]** | `docs/trabalhos/trabalho5.md` — especificação do UC10 (§6.4), atores (§2.2), dependências (§8), MVP (§9) |
| **[PROP]** | Proposta técnica deste planejamento; precisa de confirmação |

## 1. Identificação

- **Código:** UC10 **[T5 §3]**.
- **Nome:** Pagar Reserva.
- **Contexto responsável:** C5 — Pagamentos. O efeito na Reserva é aplicado por C4 — Agenda e Atendimento **[T5 §5.3, §6.4]**.
- **Classificação no MVP:** Central. "Fecha o acordo financeiramente"; risco alto por integração externa assíncrona **[T5 §9.2]**.

## 2. Objetivo e escopo

**Objetivo:** garantir o horário retido mediante pagamento **[T5 §6.4]**.

**Dentro do escopo:**

- registrar um Pagamento `Pendente` correlacionado à Contratação e à Reserva, com o valor esperado;
- registrar a correlação do Pagamento na Reserva antes de solicitar a cobrança **[T4 §8.2.1]**;
- solicitar a cobrança ao Provedor por uma porta, com adaptador simulado;
- receber o resultado do Provedor, traduzi-lo e decidir o estado financeiro em C5;
- publicar o fato "Pagamento Decidido" e aplicá-lo uma única vez na Reserva em C4;
- tratar repetição, atraso, tentativa antiga, valor divergente e resultado desconhecido;
- informar o Cliente.

**Fora do escopo:**

- reter o horário (UC09/UC08, contrato C01);
- expiração da retenção por tempo (C4, UC09);
- estorno, cancelamento (UC12), parcelamento e pagamento de várias reservas **[T4 §8.1.2, §8.2.4]**;
- escolha do provedor real e política de compensação de divergências;
- autenticação (D1) e persistência durável.

## 3. Atores

| Ator | Tipo | Papel | Fonte |
| --- | --- | --- | --- |
| Cliente | Principal | Solicita o pagamento da Reserva retida | [T5 §6.4] |
| Provedor de pagamento | Secundário | Processa a cobrança e informa aprovação, recusa ou expiração | [T5 §2.2] |
| Serviço de notificações | Secundário | Informa o Cliente; não decide regras | [T5 §2.2] |

C4 e C5 são módulos internos e não são atores **[T5 §2.3]**.

## 4. Pré-condições e pós-condições

**Pré-condições** **[T5 §6.4]**

- **PRE-01:** existe uma Reserva `Retida`, dentro do prazo, ligada a uma Contratação (UC08 ou UC09).

**Pós-condições (sucesso)**

- **POS-01:** o Pagamento está `Aprovado`.
- **POS-02:** a Reserva está `Confirmada` (**RN07**), uma única vez (**RN06**).

**Pós-condições alternativas:** Pagamento `Recusado` ou `Expirado` e Reserva `Liberada` (**RN08**).

**Garantia mínima [PROP]:** o estado financeiro decidido em C5 nunca é perdido, mesmo quando não pode ser aplicado na Reserva; nenhuma Reserva é confirmada sem correlação, valor e prazo conferidos.

## 5. Síntese dos fluxos

**Fluxo principal** **[T5 §6.4]**

1. O Cliente solicita o pagamento da reserva.
2. O sistema registra um Pagamento `Pendente`, correlacionado à Contratação e à Reserva, com o valor esperado das condições aceitas.
3. O sistema solicita a cobrança ao Provedor.
4. O Provedor informa a aprovação (de forma assíncrona).
5. O sistema registra o Pagamento como `Aprovado`.
6. A Agenda confirma a Reserva, verificando correlação, valor e validade da retenção (**RN02**, **RN07**).
7. O Cliente é informado.

**Fluxos alternativos e de exceção**

| Código | Condição | Comportamento documentado | Neste épico |
| --- | --- | --- | --- |
| FA-01 | Pagamento recusado | `Recusado`; Reserva `Liberada` (RN08) | Dentro (ver D-UC10-01) |
| FA-02 | Pagamento expira | `Expirado`; Reserva `Liberada` (RN08) | Dentro, como resultado do Provedor (D-UC10-05) |
| FA-03 | Nova tentativa após recusa, ainda no prazo | Novo Pagamento, com identidade própria | Dentro, condicionado a D-UC10-01 |
| FE-01 | Confirmação repetida do Provedor | Nenhum efeito adicional (RN06) | Dentro |
| FE-02 | Aprovação depois da liberação | Reserva não é reconfirmada; divergência para reconciliação | Dentro (registro; política em D-UC10-08) |
| FE-03 | Valor ou moeda divergente | Reserva não é confirmada; pendência rastreável | Dentro |
| FE-04 | Provedor não responde | Resultado desconhecido; não presume recusa nem aprovação | Dentro (recuperação em D-UC10-07) |

## 6. Regras de negócio e invariantes

| ID | Regra | Onde atua | Fonte |
| --- | --- | --- | --- |
| RN02 | Reserva só é confirmada se o intervalo continuar disponível | Passo 6 | [T3 §9] |
| RN03 | Sem Reservas confirmadas sobrepostas para o especialista | Passo 6, FE-02 | [T3 §9] |
| RN06 | A mesma confirmação financeira não produz múltiplas confirmações | Passo 5, passo 6, FE-01 | [T3 §9] |
| RN07 | Aprovação permite confirmar a Reserva retida | Passo 6 | [T3 §9] |
| RN08 | Recusa ou expiração libera a retenção | FA-01, FA-02 | [T3 §9] |
| INV-PAG | Pagamento não está em estados mutuamente exclusivos | Passos 2 e 5 | [T3 §10] |
| INV-RES | Reservas confirmadas do mesmo especialista não se sobrepõem | Passo 6 | [T3 §10] |
| CARD | Contratação — Pagamento `1 : 0..*`; nova tentativa é outro Pagamento | FA-03 | [T3 §8; T4 §3.5] |
| CICLO-PAG | `Pendente` → `Aprovado` / `Recusado` / `Expirado`; `Aprovado` → `Estornado` (fora) | Passos 2 e 5 | [T3 §11.3] |
| CICLO-RES | `Retida` → `Confirmada` / `Liberada` | Passo 6, FA-01, FA-02 | [T3 §11.2] |

## 7. Validações de entrada

| Dado | Regra | Situação |
| --- | --- | --- |
| Referência da Reserva | UUID na rota | [PROP] |
| Referência do agente (cliente) | UUID; origem conforme D1 | [GH D1] |
| Valor do Pagamento | **Não** é informado pelo Cliente; vem do valor esperado registrado na Reserva | [T4 §8.1.2] |
| Retorno do Provedor | Formato do adaptador; autenticidade conforme D-UC10-02 | [PROP] |
| Outros campos | Proibidos | Padrão `z.strictObject` do projeto |

## 8. Componentes e camadas

| Camada | Componente proposto [PROP] | Contexto |
| --- | --- | --- |
| Domínio | Agregado `Pagamento` com ciclo de vida e versão da transição; objeto de valor `Dinheiro` (valor em unidade mínima e moeda) | C5 |
| Repositório | `PagamentosRepositorio` com registro atômico da transição e do fato a publicar | C5 |
| Adaptador | Porta `ProvedorDePagamento` (solicitar cobrança; traduzir retorno) e adaptador simulado | C5 |
| Aplicação | `SolicitarPagamento`, `RegistrarResultadoDoProvedor`, `ConsultarPagamento` | C5 |
| Interface pública | Visão da Reserva retida e registro da correlação (`consultarRetencao`, `registrarPagamentoEsperado`) | C4 |
| Domínio / aplicação | Aplicação idempotente do fato "Pagamento Decidido" na Reserva; registro de pendências | C4 |
| Interface | `POST /reservas/{id}/pagamentos`, `POST /pagamentos/retorno-provedor`, `GET /pagamentos/{id}` | C5 |

## 9. Considerações arquiteturais

- **ADR-03:** a correlação com C4 é síncrona (R4); o resultado financeiro é consumido de forma assíncrona (R6). No monólito, as duas são chamadas internas entre módulos **[T4 §12.3]**.
- **Autoridade dividida (C02):** C5 decide o estado financeiro; C4 decide a situação da Reserva. C5 nunca confirma a Reserva diretamente **[T4 §3.5, §8.2.4]**.
- **Ordem da jornada:** consultar a retenção → criar o Pagamento → registrar a correlação em C4 → solicitar a cobrança **[T4 §8.2.1]**. Sem correlação, C4 não escolhe Reserva por aproximação.
- **Idempotência em duas camadas:** C5 não cria nova transição para resultado repetido; C4 deduplica pela combinação Pagamento + versão da transição + Reserva, e não pelo identificador do fato (TC-C5-01).
- **Atomicidade local em C4:** efeito na Reserva e marcação do fato processado são gravados juntos **[T4 §8.2.4]**.
- **Entrega dentro do processo [PROP]:** C5 grava a transição e o fato a publicar juntos (outbox em memória); um despachante interno entrega a C4 e repete em caso de falha. O outbox durável vem com a persistência **[T4 §7]**.
- **Dependência forte do UC09:** o Agregado Reserva, o prazo da retenção e o valor esperado nascem no UC09 (contrato C01), que ainda não foi especificado nem planejado.

## 10. Restrições, decisões e dúvidas

| ID | Tema | Situação | Proposta |
| --- | --- | --- | --- |
| D1 | Origem da identidade do agente | **Pendente** (herdada do UC02) | `clienteId` no corpo, como limitação temporária |
| D-UC10-01 | FA-01 × FA-03: a recusa libera a Reserva (RN08), mas FA-03 prevê nova tentativa "ainda no prazo" | **Dúvida aberta** | Opção A [PROP]: manter RN08 (regra confirmada); nova tentativa exige nova retenção. Opção B: a recusa não libera enquanto o prazo não vence. A diferença fica só na SUB-06 |
| D-UC10-02 | Provedor real e autenticação do retorno | **Pendente** | Adaptador simulado neste épico; retorno protegido por segredo compartilhado em cabeçalho, configurado por variável de ambiente |
| D-UC10-03 | No máximo um Pagamento `Pendente` por Reserva | Hipótese [PROP] | C4 recusa nova correlação enquanto a atual não tiver resultado aplicado |
| D-UC10-04 | Entrega do fato | [PROP] | Outbox em memória e despachante interno; outbox durável com a persistência |
| D-UC10-05 | Origem da expiração do Pagamento | [PROP] | Só por resultado do Provedor; expiração por tempo em C5 fica fora |
| D-UC10-06 | Validade da retenção | [PROP] | Conferida pelo relógio de C4 no momento do processamento; o instante financeiro não estende o prazo [T4 §8.1.4] |
| D-UC10-07 | Recuperar resultado desconhecido (FE-04) | [PROP] | Pagamento fica `Pendente` e consultável; consulta ativa ao Provedor fica para épico futuro (alternativa citada no ADR-03) |
| D-UC10-08 | Política de reconciliação e compensação | **Não definida** [T4 TC-C5-02] | Só registrar pendências rastreáveis; nenhum estorno automático |
| D-UC10-09 | Tradução HTTP | [PROP] | Ver SUB-07 |
| D-UC10-10 | Aviso ao Cliente (passo 7) | [PROP] | Porta de aviso em C4, falha tolerada, sem reentrega, mesmo padrão do UC05 |

**Dependências de outros casos de uso:** UC09 (Reserva retida, prazo, valor esperado — **não planejado**); UC07 (Contratação, usada na jornada de ponta a ponta).
