# 01-01 — Análise técnica do caso de uso

**Projeto:** Mindhub — Plataforma de Mentorias e Consultorias
**Caso de uso:** UC05 — Enviar Solicitação de Atendimento
**Etapa:** 01 — Do Caso de Uso ao Planejamento da Implementação
**Data:** 10/11/2026
**Responsável:** Leonardo Herrero S. Martins (@leohsm) — trabalho individual

## Legenda de fontes

| Marca | Significado |
| --- | --- |
| **[T3]** | `docs/trabalhos/trabalho3.md` — modelo conceitual (RN01–RN15, cardinalidades, estados) |
| **[T4]** | `docs/trabalhos/trabalho4.md` — contextos C1–C6, relações R2/R3, ADR-01 a ADR-04 |
| **[T5]** | `docs/trabalhos/trabalho5.md` — especificação do UC05 (§6.2), dependências (§8) e MVP (§9) |
| **[GH]** | Planejamento do UC02 no GitHub (épico #1, sub-issues #2 a #8) |
| **[PROP]** | Proposta técnica deste planejamento; precisa de confirmação |

## 1. Identificação

- **Código:** UC05 **[T5 §3]**.
- **Nome:** Enviar Solicitação de Atendimento.
- **Contexto responsável:** C3 — Negociação e Contratação **[T5 §5.2; T4 §3.3]**.
- **Classificação no MVP:** Central **[T5 §9.3]**. É o início do caminho Sob Proposta.

## 2. Objetivo e escopo

**Objetivo:** levar a necessidade do cliente a um especialista escolhido, para que ele possa propor condições **[T5 §6.2]**.

**Dentro do escopo:**

- receber o especialista escolhido, o Objetivo e o Escopo da necessidade;
- reconhecer o cliente solicitante (C1);
- verificar, por C2, que o perfil do especialista está habilitado a receber solicitações (RN01);
- registrar a Solicitação como `Enviada`, direcionada a um único especialista;
- avisar o especialista sem que a falha do aviso invalide a Solicitação (FA-02);
- quando um Serviço for indicado, verificar que ele é Sob Proposta (RN13) — **condicionado ao UC03** (ver §9).

**Fora do escopo:**

- variação do Representante de organização (FA-01, FE-04, RN11) — ver D-UC05-01;
- reentrega automática do aviso que falhou — ver D-UC05-02;
- consulta ou listagem de solicitações recebidas pelo especialista — ver D-UC05-06;
- resposta à solicitação (Proposta — UC06);
- autenticação do agente (D1, herdada do UC02);
- persistência durável (mesmo critério do UC02: primeiro em memória atrás de uma porta) **[T5 §10.4]**.

## 3. Atores

| Ator | Tipo | Papel | Fonte |
| --- | --- | --- | --- |
| Cliente | Principal | Usuário que escolhe o especialista e descreve a necessidade | [T5 §6.2] |
| Representante de organização | Principal (variação) | Envia em nome da organização, com vínculo compatível | [T5 §6.2, FA-01] |
| Serviço de notificações | Secundário | Entrega o aviso ao especialista; não decide regras | [T5 §2.2] |

C1 e C2 **não são atores**: são módulos internos consultados por portas **[T5 §2.3]**.

## 4. Pré-condições e pós-condições

**Pré-condições** **[T5 §6.2]**

- **PRE-01:** o Cliente é um Usuário cadastrado (UC01).
- **PRE-02:** o especialista destinatário possui Perfil de Especialista (UC02).

**Pós-condições (sucesso)**

- **POS-01:** existe uma Solicitação na situação `Enviada`, com Objetivo e Escopo, direcionada a **um** especialista.
- **POS-02:** o especialista consegue conhecer a solicitação.

**Garantia mínima [PROP]:** em qualquer recusa ou falha antes do passo 5, nenhuma Solicitação é registrada. Falha posterior ao registro (aviso) não desfaz a Solicitação (FA-02).

## 5. Síntese dos fluxos

**Fluxo principal** **[T5 §6.2]**

1. O Cliente escolhe um especialista e, opcionalmente, um Serviço desse especialista.
2. O Cliente descreve o Objetivo e o Escopo da necessidade.
3. O sistema verifica que o perfil do especialista está `ATIVO` (**RN01**, decisão de C2).
4. Se um Serviço foi indicado, o sistema verifica que ele é **Sob Proposta** (**RN13**).
5. O sistema registra a Solicitação como `Enviada`.
6. O sistema informa o Cliente; o especialista é avisado.

**Fluxos alternativos e de exceção**

| Código | Condição | Comportamento documentado | Neste épico |
| --- | --- | --- | --- |
| FA-01 | Representante envia em nome da organização | Verifica vínculo compatível (RN11) antes do passo 5 | Fora (D-UC05-01) |
| FA-02 | Falha na notificação ao especialista | A Solicitação continua `Enviada`; o aviso é repetido depois | Parcial: falha tolerada; reentrega fora (D-UC05-02) |
| FE-01 | Especialista `SUSPENSO` | Recusa (RN01); nada é registrado | Dentro |
| FE-02 | Especialista ou Serviço inexistente | Falha de aplicação; nada é registrado | Especialista: dentro. Serviço: SUB-06 |
| FE-03 | Serviço de Reserva Direta | Recusa com orientação para UC08 (RN13) | SUB-06 (depende do UC03) |
| FE-04 | Representante sem vínculo compatível | Recusa (RN11) | Fora (D-UC05-01) |

## 6. Regras de negócio

| ID | Regra | Onde atua | Fonte |
| --- | --- | --- | --- |
| RN01 | Somente Perfil de Especialista ativo recebe novas Solicitações | Passo 3, FE-01 | [T3 §9] |
| RN11 | Agir em nome de organização exige vínculo compatível | FA-01, FE-04 (fora) | [T3 §9] |
| RN13 | Serviço Sob Proposta depende de negociação; Reserva Direta dispensa Proposta | Passo 4, FE-03 | [T3 §9] |
| CARD-01 | Usuário — Solicitação `1 : 0..*` | Sem unicidade por cliente | [T3 §8] |
| CARD-02 | Perfil de Especialista — Solicitação `1 : 0..*`; Solicitação direcionada a um especialista | POS-01 | [T3 §8] |
| CARD-03 | Solicitação — Proposta `1 : 0..1` (hipótese forte) | Consumida pelo UC06 | [T3 §8.1] |

## 7. Validações de entrada

| Dado | Regra | Situação |
| --- | --- | --- |
| Referência do cliente | UUID; origem conforme D1 (corpo, temporariamente) | [GH D1] |
| Referência do especialista | UUID do Perfil de Especialista | [PROP] — o [T3 §8] relaciona Solicitação ao **Perfil**, não ao Usuário |
| Objetivo | Texto obrigatório, não vazio após `trim` | Obrigatoriedade: [T5 POS-01]. Limite máximo: D-UC05-03 |
| Escopo | Texto obrigatório, não vazio após `trim` | Obrigatoriedade: [T5 POS-01]. Limite máximo: D-UC05-03 |
| Referência do Serviço | UUID, opcional | Aceita somente após SUB-06 |
| Outros campos (ex.: `situacao`) | Proibidos | Padrão `z.strictObject` do projeto |

A fronteira valida **formato**. O domínio de C3 **também** protege Objetivo e Escopo, como no UC02 **[T5 §6.1]**.

## 8. Componentes e camadas

| Camada | Componente proposto [PROP] | Contexto |
| --- | --- | --- |
| Domínio | `Solicitacao`, objetos de valor `Objetivo` e `Escopo`, situação `ENVIADA` | C3 |
| Repositório | `SolicitacoesRepositorio` com `adicionar(solicitacao)`; adaptador em memória | C3 |
| Aplicação | `EnviarSolicitacao` (coordena C1, C2, registro e aviso) | C3 |
| Porta de C1 | `ReconhecimentoDeUsuario` — **já planejada no UC02 (#2)** | C1 |
| Porta de C2 | `HabilitacaoDeEspecialista` — "este perfil existe e pode receber solicitações?" | C2 |
| Porta de C2 | `ModeloDeContratacaoDoServico` — "este serviço é deste especialista e é Sob Proposta?" | C2 (após UC03) |
| Porta de aviso | `AvisoDeSolicitacao` com adaptador em memória | Transversal, consumida por C3 |
| Interface | `POST /solicitacoes` | C3 |

## 9. Considerações arquiteturais

- **R2 síncrona (C3 → C2):** a habilitação é consultada no momento da solicitação. A interpretação de `ATIVO` fica em C2; C3 não replica a regra **[T4 §6.1, §7]**.
- **ADR-04:** C3 não importa `PerfilEspecialista` nem o repositório de C2. Usa uma visão pública mínima **[T4 §12.4, §13.4.1]**.
- **Reuso do UC02:** a porta `ReconhecimentoDeUsuario` (#2) serve para reconhecer o cliente (PRE-01). A visão de habilitação precisa ler um perfil por identificador, operação que o UC02 retirou do slice e adiou para UC03/UC05 **[T5 §15.1]**.
- **Concorrência com suspensão (TC-C2-01):** ainda não existe operação de suspensão (UC18). A verificação lê a situação atual; a garantia de ordenação entre suspensão e nova solicitação fica registrada como risco **[T4 §9.5]**.
- **Notificação:** falha não invalida o resultado principal **[T5 §2.2; T4 §7]**. A reentrega durável depende de persistência (registro do fato a entregar) **[T4 §7]**.
- **Serviço indicado:** o UC03 (Publicar Serviço) ainda não foi especificado nem planejado. Por isso o passo 4 vira uma extensão própria (SUB-06), e o fluxo sem Serviço pode ser entregue antes.

## 10. Restrições, decisões e dúvidas

| ID | Tema | Situação | Proposta |
| --- | --- | --- | --- |
| D1 | Origem da identidade do agente (`clienteId`) | **Pendente** (herdada do UC02, #6) | Mesmo tratamento do UC02: corpo, como limitação temporária documentada |
| D-UC05-01 | Variação do Representante (FA-01, FE-04, RN11) | [PROP] | Fora deste épico: depende de UC16/UC17, classificados como **Futuros** no MVP [T5 §9.3] |
| D-UC05-02 | Repetição do aviso que falhou (FA-02) | [PROP] | Registrar a falha como pendência em memória; reentrega entra com a persistência durável [T4 §7] |
| D-UC05-03 | Limite máximo de Objetivo e Escopo | **Não documentado** | Definir antes da SUB-02; nada é presumido no código até lá |
| D-UC05-04 | Cliente pode enviar solicitação ao próprio perfil? | **Dúvida aberta** [T5 §6.2, §26] | Nenhuma regra implementada até decisão do domínio |
| D-UC05-05 | Tradução HTTP das recusas | [PROP] | Ver SUB-05: 422 para referência não reconhecida (padrão D5 do UC02); 409 para especialista não habilitado |
| D-UC05-06 | POS-02 "o especialista consegue conhecer" | [PROP] | Atendida pelo aviso; consulta de solicitações recebidas não está especificada e fica para caso de uso futuro |
| D-UC05-07 | Revelar ao cliente que o especialista está suspenso? | [PROP] | Mensagem genérica ("especialista não habilitado"), como o 409 do UC02 não revela suspensão [T5 §20.2] |

**Dependências de outros casos de uso:** UC01 (implementado), UC02 (épico #1, em `Backlog`), UC03 (não planejado; afeta só a SUB-06).
