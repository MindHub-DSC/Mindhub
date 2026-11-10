# 01-05 — Matriz de rastreabilidade

**Caso de uso:** UC05 — Enviar Solicitação de Atendimento

| Requisito / regra / fluxo | Sub-Issue | Atividade técnica | Critério de aceite vinculado | Comportamento a verificar |
| --- | --- | --- | --- | --- |
| PRE-01 — cliente cadastrado | SUB-04, SUB-05 | Reconhecer o cliente pela porta de C1 | `ClienteNaoReconhecido`; 422 | Cliente inexistente não registra solicitação |
| PRE-02 — especialista com perfil | SUB-01, SUB-04 | Visão de habilitação devolve `NAO_ENCONTRADO` | `EspecialistaNaoEncontrado`; 422 | Perfil inexistente não registra solicitação |
| Passo 1 — escolher especialista | SUB-05 | Schema com `perfilEspecialistaId` | 400 para formato inválido | Referência malformada é recusada na fronteira |
| Passo 1 — Serviço opcional | SUB-06 | Campo `servicoId` opcional | Sem `servicoId`, comportamento inalterado | Serviço é opcional |
| Passo 2 — Objetivo e Escopo | SUB-02, SUB-05 | Objetos de valor e schema | Vazio recusado | Objetivo e Escopo obrigatórios |
| Passo 3 — RN01 | SUB-01, SUB-04 | C2 interpreta `ATIVO`; C3 consome | `HABILITADO` / `NAO_HABILITADO` | Só perfil ativo recebe solicitação |
| Passo 4 — RN13 | SUB-06 | Visão do Serviço em C2; regra em C3 | Sob Proposta aceito; Reserva Direta recusado | Caminho correto por modelo de contratação |
| Passo 5 — registrar `Enviada` | SUB-02, SUB-04 | Entidade e repositório | Nasce `ENVIADA` | Solicitação registrada com um destinatário |
| Passo 6 — informar e avisar | SUB-03, SUB-04, SUB-05 | Porta de aviso; resposta 201 | Aviso registrado após o registro | Especialista é avisado |
| POS-01 | SUB-02, SUB-05 | Resposta 201 com situação | Resposta contém `situacao: ENVIADA` | Pós-condição observável |
| POS-02 | SUB-03 | Aviso ao especialista | Aviso registrado | Especialista toma conhecimento (D-UC05-06) |
| FA-01 — Representante | — | **Sem cobertura neste épico** | — | D-UC05-01 (depende de UC16/UC17) |
| FA-02 — falha no aviso | SUB-03, SUB-04 | Falha tolerada e registrada | Solicitação continua registrada | Falha de notificação não desfaz o resultado |
| FA-02 — "aviso repetido depois" | — | **Cobertura parcial** | Pendência registrada | Reentrega depende de persistência (D-UC05-02) |
| FE-01 — especialista suspenso | SUB-01, SUB-04, SUB-05 | `NAO_HABILITADO` → `EspecialistaNaoHabilitado` → 409 | Nada é registrado | RN01 aplicada |
| FE-02 — especialista inexistente | SUB-01, SUB-04, SUB-05 | `NAO_ENCONTRADO` → 422 | Nada é registrado | Falha de aplicação |
| FE-02 — serviço inexistente | SUB-06 | Visão do Serviço | Recusa | Falha de aplicação |
| FE-03 — Reserva Direta | SUB-06 | Regra de C3 sobre o modelo | Recusa com orientação ao UC08 | RN13 aplicada |
| FE-04 — Representante sem vínculo | — | **Sem cobertura neste épico** | — | D-UC05-01 |
| RN11 | — | **Sem cobertura neste épico** | — | D-UC05-01 |
| CARD-01 — `1 : 0..*` por cliente | SUB-02 | Repositório sem unicidade | Duas solicitações aceitas | Não há restrição indevida |
| ADR-04 — interfaces por propósito | SUB-01, SUB-04, SUB-06 | Tokens públicos; sem importar internos | C3 não importa C1/C2 | Fronteiras preservadas |
| Documentação | SUB-07 | README e `requests.http` | Exemplos executáveis | Documentação coerente |

## Lacunas apontadas

- **Sem cobertura:** FA-01, FE-04 e RN11, por decisão D-UC05-01. Precisam de um épico futuro junto com UC16/UC17.
- **Cobertura parcial:** a reentrega do aviso (FA-02), por decisão D-UC05-02.
- **Atividades sem origem direta na especificação:** nenhuma. A leitura por identificador na SUB-01 decorre do passo 3, e a SUB-07 decorre da convenção de governança do `trabalho5.md` §24.
- **Dúvida sem regra:** autossolicitação (D-UC05-04). Nenhuma atividade foi criada para ela.
