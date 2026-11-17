# 01-02 — Decomposição em unidades de trabalho

**Caso de uso:** UC10 — Pagar Reserva
**Base:** [01-01 — Análise técnica](01-01-analise-tecnica.md)

O caso de uso foi decomposto em **8 unidades de trabalho**. Cada uma entrega comportamento verificável com seus próprios testes. Os títulos no GitHub usam o prefixo `[UC10-SUB-XX]` e indicam o contexto (`C4` ou `C5`).

| ID | Atividade técnica | Objetivo | Escopo e responsabilidades | Componente / camada | Origem no caso de uso | Depende de | Critério geral de conclusão |
| --- | --- | --- | --- | --- | --- | --- | --- |
| SUB-01 | Modelar Pagamento e seu ciclo de vida com persistência em memória | Representar a tentativa financeira e suas transições exclusivas | Agregado `Pagamento`; `Dinheiro`; versão da transição; resultado repetido e contraditório; porta e adaptador com outbox; testes | C5 — domínio e repositório | Passos 2 e 5, CICLO-PAG, INV-PAG, RN06, FA-03 | — | Cada transição válida, repetida e contraditória verificada em teste |
| SUB-02 | Definir porta do Provedor de pagamento e adaptador simulado | Isolar o Provedor e traduzir seus resultados | Porta `ProvedorDePagamento`; tradução para Aprovado/Recusado/Expirado; ausência de resposta = desconhecido; adaptador simulado; testes | C5 — adaptador | Passos 3 e 4, FE-04 | SUB-01 (contrato) | Cada resultado do Provedor, inclusive o desconhecido, traduzido em teste |
| SUB-03 | Expor visão da Reserva retida e registrar a correlação do Pagamento | Permitir que C5 conheça a retenção e que C4 registre o Pagamento esperado | Interface pública de C4: consultar retenção; registrar Pagamento esperado; um pendente por Reserva; testes | C4 — aplicação e repositório | PRE-01, passo 2, D-UC10-03 | UC09 (Reserva) | Correlação registrada só para Reserva retida e no prazo |
| SUB-04 | Implementar serviço Solicitar Pagamento | Coordenar os passos 1 a 3 | Autoria; valor esperado; Pagamento `Pendente`; correlação; cobrança; resultado desconhecido; testes com dublês | C5 — aplicação | Passos 1 a 3, PRE-01, FA-03, FE-04 | SUB-01, SUB-02, SUB-03 | Sucesso e cada recusa verificados com dublês |
| SUB-05 | Processar o resultado do Provedor e publicar "Pagamento Decidido" | Decidir o estado financeiro e publicar o fato uma vez | Serviço `RegistrarResultadoDoProvedor`; transição + fato no mesmo registro; despachante interno com repetição; testes | C5 — aplicação | Passos 4 e 5, FA-01, FA-02, FE-01, RN06, C02 | SUB-01, SUB-02 | Resultado repetido não gera novo fato; fato não entregue é repetido |
| SUB-06 | Aplicar "Pagamento Decidido" na Reserva | Confirmar ou liberar a Reserva uma única vez | Consumidor em C4; correlação, valor, prazo, sobreposição; deduplicação; efeito e marcação juntos; pendências; aviso ao Cliente; testes | C4 — domínio e aplicação | Passos 6 e 7, RN02, RN03, RN07, RN08, FE-01 a FE-03, TC-C5-01, TC-C5-02 | SUB-03, SUB-05 (contrato); UC09 | Cada linha de C02 §8.2.3 verificada em teste |
| SUB-07 | Expor endpoints HTTP e integrar C4 e C5 de ponta a ponta | Disponibilizar o caso de uso pela API e comprovar a jornada | Três endpoints; schemas; tradução; ligação dos módulos; testes HTTP incluindo duplicidade e aprovação tardia | C5 e C4 — interface e integração | Passos 1, 4 e 7; FE-01 a FE-04 | SUB-02, SUB-04 a SUB-06; UC09; UC07-SUB-05; D1; D-UC10-02 | Jornada completa coberta por testes HTTP; `test`, `lint` e `build` sem erros |
| SUB-08 | Documentar o UC10 e os endpoints | Manter a documentação coerente | README, `requests.http`, limitações | Documentação | Rastreabilidade | SUB-07 | Exemplos executáveis; limitações descritas |

## Justificativa da decomposição

- **C4 e C5 em unidades separadas.** O `trabalho4.md` §8.2.4 divide a autoridade: C5 decide o estado financeiro, C4 decide a Reserva. Juntar SUB-05 e SUB-06 esconderia a fronteira que o TC-C5-02 quer proteger.
- **SUB-02 existe sozinha** porque a tradução do Provedor é a principal fonte de mudança externa (`trabalho4.md` §3.5) e porque o resultado desconhecido (FE-04) precisa ser testado isoladamente.
- **SUB-03 é separada da SUB-06.** A correlação é síncrona (R4) e acontece antes da cobrança; a aplicação do fato é assíncrona (R6). São momentos e contratos diferentes.
- **SUB-04 e SUB-05** separam o início do pagamento (ação do Cliente) do recebimento do resultado (ação do Provedor). Têm atores, gatilhos e falhas diferentes.
- **Não foi criada** uma unidade para estorno, cancelamento, expiração por tempo, política de reconciliação nem consulta ativa ao Provedor (D-UC10-05, D-UC10-07, D-UC10-08).
- **Não foi criada** uma unidade para reter o horário: isso pertence ao UC09 (contrato C01).
