# 01-02 — Decomposição em unidades de trabalho

**Caso de uso:** UC15 — Indicar Participantes da Sessão  
**Base:** [01-01 — Análise técnica](01-01-analise-tecnica.md)

O caso de uso foi decomposto em **5 unidades de trabalho**. Cada uma entrega comportamento verificável com seus próprios testes (o teste faz parte da unidade, sem tarefas separadas de RED/GREEN). Os títulos no GitHub usam o prefixo `[UC15-SUB-XX]`.

| ID | Atividade técnica | Objetivo | Escopo e responsabilidades | Componente / camada | Origem no caso de uso | Depende de | Critério geral de conclusão |
| --- | --- | --- | --- | --- | --- | --- | --- |
| SUB-01 | Expor a visão pública de vínculos organizacionais em C1 | Permitir que C4 verifique representante e membros sem interpretar o Agregado de Organização. | Interface pública, implementação em C1 e testes. | C1 — application | Passos 2 e 3; PRE-02; FE-01, FE-02; RN11; `trabalho4.md` TC-C1-01, TC-C1-02. | UC17 | Membro vinculado à Organização é reconhecido como vinculado; demais critérios na SUB-Issue |
| SUB-02 | Modelar a indicação de Participações na Sessão | Permitir registrar Participações de membros diferentes do contratante, em Sessão em aberto. | Operação de domínio, persistência em memória e testes. | C4 — domain, repository | POS-01, POS-02; FE-04; RN12; `trabalho3.md` §6.3, §8. | UC13, D-UC15-01, D-UC15-02, D-UC15-03 | A indicação registra as Participações dos membros com seu papel; demais critérios na SUB-Issue |
| SUB-03 | Implementar o serviço de aplicação Indicar Participantes | Coordenar a verificação de vínculos em C1, o registro e o aviso. | Serviço de aplicação, erros de aplicação e testes com dublês. | C4 — application | Passos 2 a 5; FE-01 a FE-04; RN11, RN12. | SUB-01, SUB-02, D-UC15-04, D-UC15-05 | O Representante com vínculo compatível indica membros vinculados e a Sessão passa a ter as Participações; demais critérios na SUB-Issue |
| SUB-04 | Expor o endpoint de indicação e verificar a jornada | Disponibilizar a indicação pela API e comprovar a jornada organizacional. | DTO, controller, filtro de erros e testes HTTP. | C4 — api, integration | Passo 1; FE-01 a FE-04. | SUB-03, D-UC15-06 | A indicação válida responde 200 com as Participações registradas; demais critérios na SUB-Issue |
| SUB-05 | Documentar o UC15 e o endpoint | Manter a documentação coerente com o comportamento entregue. | README, `requests.http` e registro de limitações. | C4 —  | Rastreabilidade do planejamento. | SUB-04 | Os exemplos do `requests.http` são executáveis e cobrem sucesso e as recusas principais; demais critérios na SUB-Issue |

## Justificativa da decomposição

- **Visão de vínculos em C1 (SUB-01).** A fronteira C1–C4 é pública (TC-C1-02); isolá-la evita que C4 interprete o Agregado de Organização.
- **Modelo e serviço separados (SUB-02 e SUB-03).** A operação de domínio na Sessão é independente de C1; o serviço coordena as verificações e o aviso.

**Não foram criadas unidades para:** limite de participantes, revogação de vínculos, atualização automática de Participações e avisos reais.
