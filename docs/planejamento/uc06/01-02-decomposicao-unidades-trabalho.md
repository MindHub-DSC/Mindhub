# 01-02 — Decomposição em unidades de trabalho

**Caso de uso:** UC06 — Enviar Proposta  
**Base:** [01-01 — Análise técnica](01-01-analise-tecnica.md)

O caso de uso foi decomposto em **6 unidades de trabalho**. Cada uma entrega comportamento verificável com seus próprios testes (o teste faz parte da unidade, sem tarefas separadas de RED/GREEN). Os títulos no GitHub usam o prefixo `[UC06-SUB-XX]`.

| ID | Atividade técnica | Objetivo | Escopo e responsabilidades | Componente / camada | Origem no caso de uso | Depende de | Critério geral de conclusão |
| --- | --- | --- | --- | --- | --- | --- | --- |
| SUB-01 | Modelar as Condições Comerciais | Representar as condições de uma Proposta como objeto de valor imutável e validado. | Objeto de valor, `Dinheiro` (se ainda não existir), erros de domínio e testes. | C3 — domain | Fluxo principal, passo 2; FE-06; `trabalho3.md` §5.2 (Condições Comerciais, Dinheiro). | D-UC06-02 | Condições completas criam o objeto de valor com todos os campos; demais critérios na SUB-Issue |
| SUB-02 | Modelar a Proposta, suas Versões e o repositório em memória | Representar a Proposta com versões imutáveis, ciclo inicial e unicidade por Solicitação. | Agregado, Versão, erros de domínio, porta, adaptador em memória e testes de domínio e de contrato. | C3 — domain, repository | POS-01 a POS-04; FA-01; FE-02 a FE-05; RN05; `trabalho3.md` §6.2, §8, §11.1. | SUB-01, D-UC06-01, D-UC06-03, D-UC06-04 | O primeiro envio cria Proposta `ENVIADA` com versão 1 vigente, ligada à Solicitação; demais critérios na SUB-Issue |
| SUB-03 | Expor a Solicitação recebida ao Especialista destinatário | Permitir que o Especialista consulte a Solicitação que recebeu, sem revelá-la a terceiros. | Extensão da porta de Solicitação, serviço de consulta e testes. | C3 — application, repository | Fluxo principal, passo 1; PRE-01; `trabalho5.md` §6.2. | UC05 | O especialista destinatário consulta a Solicitação com Objetivo, Escopo, situação e cliente; demais critérios na SUB-Issue |
| SUB-04 | Implementar os serviços de aplicação Enviar Proposta e Enviar Nova Versão | Coordenar autoria, verificação da Solicitação, registro e aviso ao cliente. | Dois serviços de aplicação, erros de aplicação e testes com dublês. | C3 — application | Passos 3 a 5; PRE-01, PRE-01a; FA-01, FA-02; FE-01 a FE-04, FE-06. | SUB-02, SUB-03, UC05 | O especialista destinatário envia a Proposta e recebe a Proposta `ENVIADA` com versão 1; demais critérios na SUB-Issue |
| SUB-05 | Expor os endpoints de Proposta e verificar o envio de ponta a ponta | Disponibilizar o envio, a nova versão e a consulta da Solicitação pela API e comprovar a jornada. | DTOs, controllers, filtro de erros, ligação no módulo de C3 e testes HTTP. | C3 — api, integration | Passos 1, 2 e 5; FA-01; FE-01 a FE-06; D1. | SUB-04, D-UC06-08, D-UC06-09 | O envio responde 201 com a Proposta, a versão vigente e a situação; demais critérios na SUB-Issue |
| SUB-06 | Documentar o UC06 e os endpoints | Manter a documentação coerente com o comportamento entregue. | README, `requests.http` e registro de limitações. | C3 —  | Rastreabilidade do planejamento. | SUB-05 | Os exemplos do `requests.http` são executáveis e cobrem sucesso e as recusas principais; demais critérios na SUB-Issue |

## Justificativa da decomposição

- **Condições Comerciais em unidade própria (SUB-01).** São um objeto de valor com validações de entrada (FE-06) consumido também pela Contratação do UC07 (snapshot); isolá-lo permite que o UC07 o use sem depender do Agregado.
- **Proposta e Versão juntas (SUB-02).** A invariante 1 : 1..* e o ciclo inicial só fazem sentido no mesmo Agregado; o repositório em memória acompanha, como no UC05.
- **Consulta da Solicitação (SUB-03).** O passo 1 exige leitura que o UC05 não oferece; é uma unidade pequena com contrato próprio (visibilidade só ao destinatário).
- **Dois serviços na SUB-04.** Primeiro envio e nova versão compartilham portas e regras de autoria; separá-los duplicaria o teste de aviso.

**Não foram criadas unidades para:** recusar, expirar e pedir revisão da Proposta, rascunho (`Em elaboração`), mudança de situação da Solicitação (`Respondida`), aceite (UC07) e entrega real de notificações.
