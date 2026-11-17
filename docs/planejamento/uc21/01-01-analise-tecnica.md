# 01-01 — Análise técnica do caso de uso

**Caso de uso:** UC21 — Decidir Disputa  
**Contexto:** C6 — Governança e Disputas  
**Classificação no MVP:** Futuro  
**Situação da especificação:** Derivado — a validar  
**Fonte:** `docs/casos-de-uso.md` §6 (UC21) (UC21)  
**Data do planejamento:** 10/11/2026

> **Atenção:** este caso de uso está classificado como *Derivado — a validar* em `docs/casos-de-uso.md`. Os passos marcados **[PROP]** na especificação são hipóteses; este planejamento os trata como **propostas técnicas** e exige a confirmação do responsável antes de qualquer Sub-Issue ir para `Ready` (`docs/casos-de-uso.md` §9). Além disso, o caso de uso é classificado como **Futuro** no MVP: o planejamento existe para completar o catálogo, mas a implementação só deve começar depois que as dúvidas impeditivas citadas abaixo forem respondidas.

## 1. Identificação

- **Código e título:** UC21 — Decidir Disputa
- **Objetivo:** Resolver a controvérsia: o Administrador registra a decisão da Disputa e solicita as ações decorrentes aos contextos proprietários [T5 §3].
- **Escopo no projeto:** Decisão rastreável (RN15), solicitação das ações aos contextos por comandos públicos, registro separado da solicitação e do resultado de cada ação, e os fluxos `Aguardando informações` e `Cancelada`.
- **Fora do escopo:** ações dependentes de política inexistente (estorno, compensação), recurso contra a decisão, estados intermediários além dos provisórios, autenticação.

## 2. Atores e papéis

| Ator | Papel no caso de uso |
| --- | --- |
| Administrador | Ator principal; analisa e decide |
| Contextos proprietários (C2 a C5) | Executam as ações solicitadas por comandos públicos |
| Partes | Informadas da decisão |

## 3. Pré-condições e pós-condições

**Pré-condições**

- **PRE-01:** Existe uma Disputa aberta (UC20).

**Pós-condições**

- **POS-01:** A decisão está registrada com autor, fundamento e referência à Disputa (RN15).
- **POS-02:** As ações decorrentes foram solicitadas; solicitação e resultado ficam registrados separadamente da decisão.
- **POS-03:** A Disputa está `Resolvida`.

## 4. Fluxos

**Fluxo principal**

1. O Administrador analisa a Disputa e as evidências por visões dos outros contextos.
2. O Administrador registra a decisão e sua justificativa (RN15).
3. O sistema solicita as ações decorrentes aos contextos proprietários por comandos públicos.
4. O sistema registra a resposta de cada contexto.
5. O sistema informa as partes.

**Fluxos alternativos e de exceção**

| Código | Tipo | Condição e comportamento |
| --- | --- | --- |
| FA-01 | Fluxo alternativo | Faltam informações: Disputa `Aguardando informações`; volta a `Em análise` quando recebidas. |
| FA-02 | Fluxo alternativo | Disputa retirada ou inválida: `Cancelada`. |
| FE-01 | Fluxo de exceção | Contexto proprietário recusa a ação porque o estado mudou: a decisão continua registrada; a ação fica registrada como recusada. |
| FE-02 | Fluxo de exceção | Comando repetido para a mesma decisão: não é reaplicado. |
| FE-03 | Fluxo de exceção | Ator não é Administrador: recusa. [PROP] |

## 5. Regras de negócio e invariantes

| ID | Regra | Origem |
| --- | --- | --- |
| RN15 | Ações administrativas são rastreáveis: autor, fundamento e referência. | Documentado |
| INV-01 | C6 não altera diretamente Reservas, Pagamentos nem condições contratadas. | Documentado |

## 6. Validações de entrada e de processamento

- **Documentado:** decisão com fundamento obrigatório (RN15); o ator é Administrador [PROP]; comando repetido para a mesma decisão não é reaplicado.
- **Proposta técnica:** a identificação da ação decorrente é a decisão mais o tipo da ação; campos extras proibidos.

## 7. Componentes e camadas envolvidas

| Componente / camada | Responsabilidade |
| --- | --- |
| C6 — domínio | Decisão, ciclo da Disputa, Ação decorrente |
| C6 — repositório | Registro de decisão e de ações |
| C6 — adaptadores | Portas de comandos públicos dos contextos |
| C6 — aplicação | Serviço Decidir Disputa |
| C6 — HTTP | Endpoints |

## 8. Considerações arquiteturais preliminares

Estas considerações são **propostas técnicas** e exigem confirmação, salvo onde indicado o contrário.

- A decisão e as ações são registros distintos: a decisão não depende do resultado das ações (TC-C6-01).
- A idempotência das ações usa decisão e tipo de ação como identificação do comando.
- O único comando documentado é a suspensão de perfil (UC18); ações financeiras ficam fora até existir política.
- **Documentado:** monólito modular em contextos C1 a C6 (ADR-01) e módulos NestJS organizados em `dominio`, `aplicacao`, `infra` e `http`, como em `identidade/` e `oferta/` [CÓD].

## 9. Restrições, dúvidas e decisões pendentes

Itens "Dúvida documentada" constam em `docs/casos-de-uso.md`; itens "Proposta técnica" são decisões deste planejamento que dependem de confirmação.

| ID | Item | Natureza | Quem decide | Quando |
| --- | --- | --- | --- | --- |
| D-UC21-01 | Os estados intermediários (`Em análise`, `Aguardando informações`) e `Resolvida → Encerrada` são provisórios [T3 §11.5]; T2.1 §13.8 incluía `Em triagem`. | Dúvida documentada | @leohsm (domínio) | Antes da SUB-01 |
| D-UC21-02 | Quais ações uma decisão pode solicitar? Estorno e compensação dependem de política inexistente. Este planejamento trata só a suspensão de perfil. | Dúvida documentada | @leohsm (domínio) | Antes da SUB-03 |
| D-UC21-03 | Há recurso contra a decisão? Não documentado; nenhuma etapa criada. | Dúvida documentada | @leohsm (domínio) | Antes de uso real |
| D-UC21-04 | Reconhecimento do Administrador sem autenticação (mesma decisão do UC18, D-UC18-01). | Proposta técnica | @leohsm | Antes da SUB-04 |
| D-UC21-05 | Evidências analisadas por visões dos outros contextos (TC-C6-02); nenhum acesso direto. | Proposta técnica | @leohsm | Antes da SUB-04 |
| D-UC21-06 | Rota e códigos HTTP: `POST /disputas/{id}/decisao`, `POST /disputas/{id}/pedido-de-informacoes`, `POST /disputas/{id}/cancelamento`; 403, 404 e 409. | Proposta técnica | @leohsm | Antes da SUB-05 |
