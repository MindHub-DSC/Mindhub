# 01-02 — Decomposição em unidades de trabalho

**Caso de uso:** UC08 — Contratar Serviço de Reserva Direta  
**Base:** [01-01 — Análise técnica](01-01-analise-tecnica.md)

O caso de uso foi decomposto em **5 unidades de trabalho**. Cada uma entrega comportamento verificável com seus próprios testes (o teste faz parte da unidade, sem tarefas separadas de RED/GREEN). Os títulos no GitHub usam o prefixo `[UC08-SUB-XX]`.

| ID | Atividade técnica | Objetivo | Escopo e responsabilidades | Componente / camada | Origem no caso de uso | Depende de | Critério geral de conclusão |
| --- | --- | --- | --- | --- | --- | --- | --- |
| SUB-01 | Expor a visão pública do Serviço e suas condições vigentes | Permitir que C3 conheça o Serviço, o especialista, o Modelo de Contratação e as condições vigentes sem interpretar o Agregado de C2. | Interface pública, implementação em C2 e testes. | C2 — application | Passo 2; PRE-01; `trabalho4.md` §6.1. | UC03 | Serviço publicado devolve a visão com especialista, Modelo de Contratação e condições vigentes; demais critérios na SUB-Issue |
| SUB-02 | Estender a Contratação com origem Reserva Direta e snapshot das condições | Formar a Contratação sem Proposta, preservando as condições vigentes no instante da contratação (RN04). | Extensão do domínio, do repositório em memória e testes. | C3 — domain, repository | Passo 4; POS-01, POS-02; FE-05; RN04, RN13; `trabalho3.md` §7; `trabalho4.md` TC-C2-02. | UC07 | Contratação de origem Reserva Direta é criada sem referência a Proposta, com cliente, especialista e Serviço; demais critérios na SUB-Issue |
| SUB-03 | Implementar o serviço de aplicação Contratar Reserva Direta | Coordenar a visão do Serviço, a formação da Contratação e a retenção do horário pelo contrato C01. | Serviço de aplicação, uso da porta pública `RetencaoDeHorario` definida no UC09 (SUB-03), erros de aplicação e testes com dublês. | C3 — application | Passos 3 a 7; FE-01 a FE-04, FE-06; RN02, RN03, RN13; contrato C01. | SUB-01, SUB-02, UC09, D-UC08-06, D-UC08-07 | O Cliente contrata um Serviço de Reserva Direta com horário válido e recebe a Contratação e a Reserva `Retida` com prazo; demais critérios na SUB-Issue |
| SUB-04 | Expor o endpoint de contratação e verificar a jornada de ponta a ponta | Disponibilizar o caso de uso pela API e comprovar a jornada com Serviço e Agenda reais. | DTO, controller, filtro de erros, ligação dos módulos e testes HTTP. | C3 — api, integration | Passos 1 e 7; FE-01 a FE-04; D1. | SUB-03, UC09, D-UC08-08, D-UC08-09 | A requisição válida responde 201 com a Contratação, a Reserva `Retida` e o prazo; demais critérios na SUB-Issue |
| SUB-05 | Documentar o UC08 e o endpoint | Manter a documentação coerente com o comportamento entregue. | README, `requests.http` e registro de limitações. | C3 —  | Rastreabilidade do planejamento. | SUB-04 | Os exemplos do `requests.http` são executáveis e cobrem sucesso e as recusas principais; demais critérios na SUB-Issue |

## Justificativa da decomposição

- **Visão do Serviço em C2 (SUB-01).** A fronteira entre C2 e C3 é pública e restrita (`trabalho4.md` §6.1); implementá-la separada evita que C3 leia o Agregado de C2.
- **Contratação à parte (SUB-02).** O snapshot das condições (RN04) é um invariante do Agregado, estende o modelo do UC07 e tem testes próprios.
- **Serviço de aplicação (SUB-03) com a retenção.** Concentra a coordenação entre C2, C3 e C4 e a repetição segura (FE-04), que são o risco do caso de uso.
- **Endpoint e integração juntos (SUB-04):** os contextos envolvidos já têm contratos; a unidade comprova a jornada completa.

**Não foram criadas unidades para:** Reserva e disponibilidade (UC09), pagamento (UC10), contratação organizacional, edição de Serviço, definição de disponibilidade e prazo de retenção.
