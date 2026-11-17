# 01-03 — Issue principal (Epic)

**Título:** `[UC10] Pagar Reserva`
**Labels:** `usecase:uc10`, `domain:pagamentos`, `domain:agenda`, `type:epic`, `priority:high`
**Responsável:** @leohsm
**Estado inicial no board:** `Backlog`

O corpo abaixo, entre os marcadores, é publicado no GitHub. Os marcadores `{{SUB-XX}}` e `{{UC07-SUB-XX}}` são substituídos pelos números reais após a criação das issues.

<!-- BODY:START -->
## Objetivo

Permitir que o Cliente pague uma Reserva retida e que a aprovação do pagamento confirme a Reserva uma única vez. A recusa ou a expiração liberam o horário, e repetições, atrasos e divergências nunca produzem efeito indevido.

## Contexto e escopo

- **Contexto responsável:** C5 — Pagamentos decide o estado financeiro. C4 — Agenda e Atendimento decide e aplica o efeito na Reserva (contrato C02).
- **Arquitetura:** monólito modular (ADR-01); correlação síncrona e resultado financeiro assíncrono (ADR-03); provedor isolado por adaptador.
- **Dentro do escopo:** Pagamento `Pendente` correlacionado à Reserva, cobrança pelo provedor (adaptador simulado), tradução do resultado, fato "Pagamento Decidido", confirmação ou liberação idempotente da Reserva, pendências de reconciliação, aviso ao Cliente e interface HTTP.
- **Fora do escopo:** reter horário (UC09), expiração da retenção por tempo, estorno, cancelamento (UC12), parcelamento, provedor real, política de compensação, autenticação e banco de dados.

## Referências

- `docs/trabalhos/trabalho5.md` — §2.2, §6.4 (especificação do UC10), §7, §8
- `docs/trabalhos/trabalho3.md` — §5.2 (Dinheiro), §8, §9 (RN02, RN03, RN06 a RN08), §10, §11.2, §11.3
- `docs/trabalhos/trabalho4.md` — §3.4, §3.5, §6.4 (R6), §7, §8.1 (C01), §8.2 (C02), §9.8 (TC-C5-01, TC-C5-02), §12.3 (ADR-03)
- `docs/planejamento/uc10/` — análise técnica e artefatos deste planejamento

## Requisitos contemplados

| ID | Requisito |
| --- | --- |
| RN02 / RN03 | Confirmação só com intervalo disponível; sem Reservas confirmadas sobrepostas |
| RN06 | A mesma confirmação financeira não produz efeito duplicado |
| RN07 | Aprovação confirma a Reserva retida |
| RN08 | Recusa ou expiração libera a retenção |
| INV-PAG | Pagamento sem estados mutuamente exclusivos |
| FA-01..03, FE-01..04 | Recusa, expiração, nova tentativa, repetição, aprovação tardia, valor divergente, provedor sem resposta |

## Sub-Issues planejadas

- [ ] {{SUB-01}} — [C5] Modelar Pagamento e seu ciclo de vida com persistência em memória
- [ ] {{SUB-02}} — [C5] Definir porta do Provedor de pagamento e adaptador simulado
- [ ] {{SUB-03}} — [C4] Expor visão da Reserva retida e registrar a correlação do Pagamento
- [ ] {{SUB-04}} — [C5] Implementar serviço Solicitar Pagamento
- [ ] {{SUB-05}} — [C5] Processar o resultado do Provedor e publicar "Pagamento Decidido"
- [ ] {{SUB-06}} — [C4] Aplicar "Pagamento Decidido" na Reserva
- [ ] {{SUB-07}} — Expor endpoints HTTP e integrar C4 e C5 de ponta a ponta
- [ ] {{SUB-08}} — Documentar o UC10 e os endpoints

## Critérios gerais de aceite

- [ ] O Cliente da Reserva retida solicita o pagamento e recebe um Pagamento `Pendente` com o valor esperado, sem informar valor.
- [ ] A aprovação do provedor deixa o Pagamento `Aprovado` e a Reserva `Confirmada`.
- [ ] Recusa ou expiração deixam o Pagamento `Recusado`/`Expirado` e a Reserva `Liberada`, conforme D-UC10-01.
- [ ] A mesma aprovação recebida várias vezes, inclusive com outro identificador de fato, confirma a Reserva uma única vez.
- [ ] Aprovação depois da liberação, valor ou moeda divergente e resultado de tentativa antiga não alteram a Reserva e ficam registrados como pendência.
- [ ] Sem resposta do provedor, o Pagamento continua `Pendente` e nenhum resultado é presumido.
- [ ] C5 nunca altera a Reserva diretamente; C4 nunca decide o estado financeiro.
- [ ] Testes do UC10 e dos casos de uso anteriores passam juntos; lint e build sem erros.

## Dependências externas e decisões pendentes

- **UC09 — Agendar sessão / reter horário:** ainda não especificado nem planejado. O Agregado Reserva, o prazo da retenção e o valor esperado (contrato C01) nascem nele. **Bloqueia {{SUB-03}}, {{SUB-06}} e {{SUB-07}}.** Recomendação: especificar e planejar o UC09 antes de mover essas issues para `Ready`.
- **UC07:** a Contratação formada por {{UC07-SUB-05}} é usada na jornada de ponta a ponta.
- **D1 — Origem da identidade do agente:** pendente (mesma decisão do UC02).
- **D-UC10-01:** dúvida aberta — conflito entre FA-01 (recusa libera a Reserva) e FA-03 (nova tentativa ainda no prazo). Precisa de decisão do domínio antes da {{SUB-06}}.
- **D-UC10-02:** provedor real e autenticação do retorno ainda não escolhidos.
- **D-UC10-08:** política de reconciliação não definida; divergências só são registradas.

## Condições de conclusão

O épico é concluído quando todas as Sub-Issues estiverem em `Done`, os critérios gerais estiverem verificados por testes (incluindo repetição, aprovação tardia e valor divergente) e as decisões D1, D-UC10-01, D-UC10-02 e D-UC10-03 estiverem registradas.
<!-- BODY:END -->
