# 01-02 — Decomposição em unidades de trabalho

**Caso de uso:** UC07 — Aceitar Proposta
**Base:** [01-01 — Análise técnica](01-01-analise-tecnica.md)

O caso de uso foi decomposto em **6 unidades de trabalho**. Cada uma entrega comportamento verificável com seus próprios testes. Os títulos no GitHub usam o prefixo `[UC07-SUB-XX]`.

| ID | Atividade técnica | Objetivo | Escopo e responsabilidades | Componente / camada | Origem no caso de uso | Depende de | Critério geral de conclusão |
| --- | --- | --- | --- | --- | --- | --- | --- |
| SUB-01 | Implementar o aceite no Agregado Proposta | Proteger o ciclo de vida da Proposta no aceite | `aceitar(versao, agora)`: versão vigente; situações `Enviada`/`Em revisão`; validade; `Aceita` final; erros de domínio; testes | C3 — domínio | Passos 2 e 3, FE-01, FE-02, POS-01, POS-03, ciclo [T3 §11.1] | UC06 (modelo da Proposta); D-UC07-03, D-UC07-04 | Cada transição válida e inválida do ciclo verificada em teste |
| SUB-02 | Modelar Contratação Sob Proposta com snapshot imutável | Preservar o acordo e a versão aceita | Entidade `Contratacao`; snapshot de Condições Comerciais; referências a proposta, versão, solicitação, cliente e especialista; testes | C3 — domínio | Passo 5, POS-02, RN04, RN05, INV-01, INV-02 | UC06 (Versão e Condições Comerciais) | Alterar a origem depois da formação não altera a Contratação |
| SUB-03 | Registrar aceite e Contratação na mesma unidade de consistência | Garantir no máximo uma Contratação por Proposta, mesmo sob concorrência | Porta de persistência com operação atômica; conferência da versão vigente; unicidade por Proposta; adaptador em memória; testes de contrato e de concorrência | C3 — repositório | Passo 5, FE-03, CARD-01, TC-C3-01 | SUB-01, SUB-02 | Dois aceites concorrentes resultam em uma Contratação e uma recusa |
| SUB-04 | Implementar serviço de aplicação Aceitar Proposta | Coordenar autoria, aceite, registro e aviso | Serviço dependente só de portas; erros de aplicação; aviso às partes após o registro; testes com dublês | C3 — aplicação | Passos 1 a 6, PRE-01, D-UC07-07 | SUB-01, SUB-02, SUB-03; UC05 SUB-02 (Solicitação, D-UC07-09) e SUB-03 (porta de aviso) | Sucesso e cada recusa verificados com dublês |
| SUB-05 | Expor endpoints HTTP e verificar o aceite de ponta a ponta | Disponibilizar consulta e aceite pela API e comprovar o fluxo | `GET /propostas/{id}`, `POST /propostas/{id}/aceite`; schema estrito; tradução de erros; testes HTTP incluindo concorrência; regressão | C3 — interface e integração | Passos 1, 2 e 6, FE-01 a FE-03 | SUB-04; UC06 (criar propostas pela API); D1 | Cada resposta coberta por teste HTTP; `test`, `lint` e `build` sem erros |
| SUB-06 | Documentar o UC07 e os endpoints | Manter a documentação coerente | README, `requests.http`, limitações | Documentação | Rastreabilidade | SUB-05 | Exemplos executáveis; limitações descritas |

## Justificativa da decomposição

- **SUB-01 e SUB-02 separam dois agregados** que o `trabalho4.md` §3.3 mantém distintos: a Proposta decide se o aceite é válido; a Contratação preserva o acordo. Cada um tem invariantes próprias.
- **SUB-03 existe sozinha** porque concentra o principal risco do caso de uso: aceite e Contratação precisam ser gravados juntos, e dois aceites concorrentes não podem formar duas Contratações (TC-C3-01). Juntá-la ao domínio esconderia esse risco.
- **SUB-04 e SUB-05** separam a coordenação do protocolo HTTP. Aqui endpoint e integração ficam juntos, como no UC02 (#6), porque C3 é o único contexto envolvido.
- **Não foi criada** uma unidade para o Representante (D-UC07-01) nem para a dúvida da suspensão (D-UC07-02).
- **Não foi criada** uma unidade para modelar a Proposta: isso pertence ao UC06. O UC07 depende desse modelo e adiciona só o comportamento de aceite.
