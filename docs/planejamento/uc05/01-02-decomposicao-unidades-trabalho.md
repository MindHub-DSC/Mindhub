# 01-02 — Decomposição em unidades de trabalho

**Caso de uso:** UC05 — Enviar Solicitação de Atendimento
**Base:** [01-01 — Análise técnica](01-01-analise-tecnica.md)

O caso de uso foi decomposto em **7 unidades de trabalho**. Cada unidade entrega um comportamento verificável com seus próprios testes. Não há unidades separadas para fases de TDD, reuniões ou revisões.

**Identificadores:** o repositório já tem `[SUB-01]` a `[SUB-07]` do UC02. Para evitar ambiguidade, os títulos no GitHub usam o prefixo do caso de uso: `[UC05-SUB-01]`. Nos documentos, `SUB-01` se refere sempre a este caso de uso.

| ID | Atividade técnica | Objetivo | Escopo e responsabilidades | Componente / camada | Origem no caso de uso | Depende de | Critério geral de conclusão |
| --- | --- | --- | --- | --- | --- | --- | --- |
| SUB-01 | Expor visão pública de habilitação do especialista (C2) | Permitir que C3 saiba se um perfil existe e pode receber solicitações, sem interpretar `ATIVO` | Interface e token; leitura do perfil por identificador no repositório de C2; implementação; testes | C2 — aplicação (contrato público) | Passo 3, FE-01, FE-02, RN01 | UC02 #3 (perfil e repositório) | Perfil ativo → habilitado; suspenso → não habilitado; inexistente → não encontrado |
| SUB-02 | Modelar Solicitação e implementar persistência em memória | Representar a necessidade do cliente no domínio de C3 e guardá-la | Entidade, objetos de valor Objetivo e Escopo, situação `ENVIADA`; porta `SolicitacoesRepositorio` com `adicionar`; adaptador em memória; testes | C3 — domínio e repositório | Passos 2 e 5, POS-01, CARD-01/02 | D-UC05-03 (limites) | Solicitação válida nasce `ENVIADA`; Objetivo ou Escopo vazio é recusado; adição preserva cópia defensiva |
| SUB-03 | Definir porta de aviso ao especialista com falha tolerada | Avisar o especialista sem que falha de entrega invalide a Solicitação | Porta `AvisoDeSolicitacao`; adaptador em memória que registra avisos; registro de falha como pendência; testes | C3 — porta transversal / adaptador | Passo 6, FA-02, POS-02 | — | Falha simulada no aviso não lança para o chamador e fica registrada como pendente |
| SUB-04 | Implementar serviço de aplicação Enviar Solicitação | Coordenar reconhecimento, habilitação, registro e aviso | Serviço dependente só de portas; erros `ClienteNaoReconhecido`, `EspecialistaNaoEncontrado`, `EspecialistaNaoHabilitado`; testes com dublês | C3 — aplicação | Passos 1 a 6, PRE-01, FE-01, FE-02, FA-02 | SUB-01, SUB-02, SUB-03 (contratos); UC02 #2 (contrato de C1) | Sucesso e cada recusa verificados com dublês; aviso só após registro |
| SUB-05 | Expor endpoint HTTP e integrar C1, C2 e C3 com testes de ponta a ponta | Disponibilizar o caso de uso pela API e comprovar o fluxo completo | Schema estrito; `POST /solicitacoes`; tradução 201/400/409/422/503; registro do módulo de C3; testes HTTP; regressão de UC01/UC02 | C3 — interface e integração | Passos 1, 2 e 6, FE-01, FE-02, entrada inválida | SUB-04; SUB-01, SUB-02, SUB-03 (implementações); D1; UC02 #6 | Cada resposta coberta por teste HTTP; `pnpm test`, `lint` e `build` sem erros |
| SUB-06 | Estender o envio para Serviço indicado (RN13) | Aplicar o passo 4 quando o cliente indicar um Serviço | Visão pública de C2 sobre o Serviço (pertence ao especialista, modelo de contratação); campo opcional no schema; recusa de Reserva Direta com orientação ao UC08; testes | C2 — contrato público; C3 — aplicação e API | Passo 4, FE-02 (Serviço), FE-03, RN13 | SUB-05; **UC03 — Publicar Serviço** (não planejado) | Serviço Sob Proposta aceito; Reserva Direta recusado; Serviço de outro especialista ou inexistente recusado |
| SUB-07 | Documentar o UC05 e o endpoint | Manter a documentação coerente com o comportamento | README do backend, exemplo em `requests.http`, limitações (D1, D-UC05-01, D-UC05-02) | Documentação | Rastreabilidade | SUB-05 (contrato HTTP) | Exemplos executáveis localmente; limitações descritas |

## Justificativa da decomposição

- **SUB-01 e SUB-03 produzem contratos** usados pela aplicação de C3. SUB-01 mantém a interpretação de RN01 dentro de C2 **[T4 §6.1]**. A SUB-03 será reaproveitada pelo UC07 ("o sistema informa as partes").
- **SUB-02 junta domínio e persistência**, seguindo a fusão feita no UC02 (#3). A Solicitação não tem regra de unicidade (`1 : 0..*`), então separar o repositório criaria uma unidade sem risco próprio.
- **SUB-04 e SUB-05** separam a coordenação do protocolo HTTP. A decisão D1 afeta só a SUB-05.
- **SUB-06 é uma extensão vertical** porque depende do UC03, que ainda não existe. Separá-la permite entregar o fluxo sem Serviço antes, sem deixar o passo 4 pela metade.
- **SUB-07** pode avançar em paralelo.
- **Não foram criadas** unidades para FA-01/FE-04 (RN11), porque UC16/UC17 estão fora do MVP **[T5 §9.3]**, nem para a autossolicitação, porque não há regra documentada (D-UC05-04).
