# 01-01 — Análise técnica do caso de uso

**Projeto:** Mindhub — Plataforma de Mentorias e Consultorias
**Caso de uso:** UC07 — Aceitar Proposta
**Etapa:** 01 — Do Caso de Uso ao Planejamento da Implementação
**Data:** 10/11/2026
**Responsável:** Leonardo Herrero S. Martins (@leohsm) — trabalho individual

## Legenda de fontes

| Marca | Significado |
| --- | --- |
| **[T3]** | `docs/trabalhos/trabalho3.md` — modelo conceitual (RN04, RN05, ciclo de vida da Proposta, invariantes) |
| **[T4]** | `docs/trabalhos/trabalho4.md` — C3, ADR-04 (snapshots), TC-C3-01 |
| **[T5]** | `docs/trabalhos/trabalho5.md` — especificação do UC07 (§6.3), dependências (§8), MVP (§9) |
| **[PROP]** | Proposta técnica deste planejamento; precisa de confirmação |

## 1. Identificação

- **Código:** UC07 **[T5 §3]**.
- **Nome:** Aceitar Proposta.
- **Contexto responsável:** C3 — Negociação e Contratação **[T5 §5.2; T4 §3.3]**.
- **Classificação no MVP:** Central. "Preserva o acordo (RN04/RN05), o diferencial do sistema" **[T5 §9.2]**.

## 2. Objetivo e escopo

**Objetivo:** transformar uma negociação em acordo rastreável **[T5 §6.3]**.

**Dentro do escopo:**

- permitir ao Cliente consultar a versão vigente da Proposta;
- aceitar uma versão indicada, somente se for a vigente e se a Proposta estiver `Enviada` ou `Em revisão`;
- formar uma única Contratação com o snapshot imutável das Condições Comerciais aceitas e a referência à versão aceita;
- registrar aceite e Contratação na mesma unidade de consistência, inclusive sob concorrência;
- informar as partes.

**Fora do escopo:**

- criar a Proposta e suas versões (UC06);
- recusar proposta, expirar proposta por tempo e renegociar;
- variação do Representante (FE-04, RN11) — ver D-UC07-01;
- agendar a sessão (UC09) e pagar (UC10);
- autenticação (D1) e persistência durável.

## 3. Atores

| Ator | Tipo | Papel | Fonte |
| --- | --- | --- | --- |
| Cliente | Principal | Autor da Solicitação; aceita uma versão da Proposta | [T5 §6.3] |
| Representante de organização | Principal (variação) | Aceita em nome da organização, com vínculo | [T5 §6.3] |
| Serviço de notificações | Secundário | Informa as partes; não decide regras | [T5 §6.3, §2.2] |

## 4. Pré-condições e pós-condições

**Pré-condições** **[T5 §6.3]**

- **PRE-01:** existe uma Proposta `Enviada` ou `Em revisão` para uma Solicitação do Cliente (UC05, UC06).

**Pós-condições (sucesso)**

- **POS-01:** a Proposta está `Aceita` e a **versão aceita** é identificável (**RN05**).
- **POS-02:** existe **uma** Contratação, com snapshot das Condições Comerciais aceitas (**RN04**).
- **POS-03:** a Proposta não pode voltar a `Em revisão` **[T3 §11.1]**.

**Garantia mínima [PROP]:** em qualquer recusa ou falha, a Proposta não muda de situação e nenhuma Contratação é formada; aceite e Contratação nunca ficam registrados um sem o outro.

## 5. Síntese dos fluxos

**Fluxo principal** **[T5 §6.3]**

1. O Cliente consulta a versão vigente da Proposta.
2. O Cliente aceita, indicando a versão que está aceitando.
3. O sistema verifica que essa é a versão vigente e que a Proposta está em situação que permite aceite.
4. Em contratação organizacional, o sistema verifica o vínculo (**RN11**).
5. O sistema registra o aceite e forma a Contratação com o snapshot das condições, na mesma unidade de consistência.
6. O sistema informa as partes; a jornada segue para UC09.

**Fluxos de exceção**

| Código | Condição | Comportamento documentado | Neste épico |
| --- | --- | --- | --- |
| FE-01 | Versão indicada não é a vigente | Recusa; o Cliente vê a versão atual | Dentro |
| FE-02 | Proposta `Recusada` ou `Expirada` | Recusa; exige nova negociação | Dentro |
| FE-03 | Dois aceites simultâneos | No máximo uma Contratação [T4 TC-C3-01] | Dentro |
| FE-04 | Representante sem vínculo | Recusa (RN11) | Fora (D-UC07-01) |

## 6. Regras de negócio e invariantes

| ID | Regra | Onde atua | Fonte |
| --- | --- | --- | --- |
| RN04 | As condições comerciais aceitas permanecem preservadas | Passo 5, POS-02 | [T3 §9] |
| RN05 | A Versão da Proposta aceita é identificável | Passos 2, 3 e 5, POS-01 | [T3 §9] |
| RN11 | Agir em nome de organização exige vínculo | Passo 4, FE-04 (fora) | [T3 §9] |
| RN13 | Serviço Sob Proposta depende de negociação | Contexto: a Contratação nasce Sob Proposta | [T3 §9] |
| INV-01 | Contratação sob proposta possui versão aceita identificável | Passo 5 | [T3 §10] |
| INV-02 | Condições aceitas não são alteradas retroativamente | Passo 5 | [T3 §10] |
| CARD-01 | Proposta — Contratação `1 : 0..1` | FE-03 | [T3 §8] |
| CICLO | `Enviada`/`Em revisão` → `Aceita`; `Aceita` não volta a `Em revisão`; `Recusada`/`Expirada` não vão para `Aceita` | Passo 3, FE-02, POS-03 | [T3 §11.1] |

## 7. Validações de entrada

| Dado | Regra | Situação |
| --- | --- | --- |
| Referência da Proposta | UUID na rota | [PROP] |
| Versão indicada | Identificador da versão definido pelo UC06 | D-UC07-03 |
| Referência do agente (cliente) | UUID; origem conforme D1 | [GH D1] |
| Outros campos | Proibidos | Padrão `z.strictObject` do projeto |

## 8. Componentes e camadas

| Camada | Componente proposto [PROP] | Contexto |
| --- | --- | --- |
| Domínio | Comportamento `aceitar(versao, agora)` no Agregado Proposta (modelo criado no UC06) | C3 |
| Domínio | `Contratacao` (origem Sob Proposta), com referência à versão aceita e snapshot de `CondicoesComerciais` | C3 |
| Repositório | Operação atômica que registra o aceite e a Contratação, conferindo a versão vigente; unicidade de Contratação por Proposta | C3 |
| Aplicação | `AceitarProposta` | C3 |
| Porta de aviso | `AvisoDeSolicitacao` do UC05 (SUB-03), estendida para avisar o aceite | C3 |
| Interface | `GET /propostas/{id}` (versão vigente) e `POST /propostas/{id}/aceite` | C3 |

## 9. Considerações arquiteturais

- **TC-C3-01:** a consistência do aceite é resolvida **dentro de C3**, sem chamar Agenda ou Pagamentos. Proposta e Contratação são agregados distintos, gravados juntos **[T4 §9.6; §3.3]**.
- **Atomicidade em memória [PROP]:** no adaptador em memória, verificação e gravação acontecem sem `await` entre elas, o que basta no Node.js (uma thread). A mesma suíte de contrato deverá valer para o adaptador durável, que usará transação.
- **Concorrência com nova versão:** o TC-C3-01 também prevê "uma nova revisão enviada" durante o aceite. A conferência da versão vigente precisa acontecer na mesma operação atômica do aceite, e a operação de nova versão do UC06 precisa respeitar o mesmo controle.
- **ADR-04 — snapshots:** a Contratação guarda uma cópia imutável das condições da versão aceita. Mudanças posteriores no Serviço não alteram o acordo **[T4 §12.4, §13.4.3]**.
- **Dependência forte do UC06:** o Agregado Proposta, suas versões e as Condições Comerciais nascem no UC06, que ainda não foi especificado nem planejado. O UC07 não deve definir esse modelo por conta própria.

## 10. Restrições, decisões e dúvidas

| ID | Tema | Situação | Proposta |
| --- | --- | --- | --- |
| D1 | Origem da identidade do agente | **Pendente** (herdada do UC02) | `clienteId` no corpo, como limitação temporária |
| D-UC07-01 | Representante (FE-04, RN11) | [PROP] | Fora do épico; UC16/UC17 estão fora do MVP [T5 §9.3] |
| D-UC07-02 | Especialista suspenso após enviar a Proposta | **Dúvida aberta** [T5 §6.3, §26] | Nenhuma regra implementada; RN01 fala de publicar e receber solicitações, não de aceite |
| D-UC07-03 | Como a versão é identificada | Depende do UC06 | Número sequencial por Proposta [PROP] |
| D-UC07-04 | Validade vencida no momento do aceite | [PROP] | Validade faz parte das Condições Comerciais [T3 §5.2]; o aceite com validade vencida é tratado como `Expirada` (FE-02), usando relógio injetado |
| D-UC07-05 | Repetição do aceite após resposta perdida | [PROP] | Recusa "proposta já aceita", informando a referência da Contratação existente ao mesmo cliente; nunca uma segunda Contratação |
| D-UC07-06 | Situação da Contratação | **Hipótese não retomada** | O `trabalho2.1.md` §13.4 propôs um ciclo de vida (`Formada → Aguardando Pagamento → Ativa → Concluída`, ou `Cancelada`) como "primeira hipótese conceitual", a refinar quando houvesse regras de cancelamento. O `trabalho3.md` §11 não manteve esse ciclo, e nenhum contrato do `trabalho4.md` muda a situação da Contratação. Proposta: a Contratação não recebe ciclo de vida neste épico, só origem, versão, snapshot e data; o ciclo deve ser revisto junto com UC10 e UC12 |
| D-UC07-07 | Agente que não é o cliente da Solicitação | [PROP] | Recusa (403); PRE-01 exige "Solicitação do Cliente" |
| D-UC07-08 | Tradução HTTP | [PROP] | Ver SUB-05 |
| D-UC07-09 | Origem do cliente e do especialista da Contratação | [PROP] | Lidos da Solicitação respondida pela Proposta; o repositório de Solicitações do UC05 ganha leitura por identificador (SUB-04). Se o UC06 guardar essas referências na Proposta, a leitura deixa de ser necessária |

**Dependências de outros casos de uso:** UC05 (Solicitação, porta de aviso), UC06 (Proposta e versões, **não planejado**).
