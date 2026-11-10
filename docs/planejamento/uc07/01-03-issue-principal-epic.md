# 01-03 — Issue principal (Epic)

**Título:** `[UC07] Aceitar Proposta`
**Labels:** `usecase:uc07`, `domain:negociacao`, `type:epic`, `priority:high`
**Responsável:** @leohsm
**Estado inicial no board:** `Backlog`

O corpo abaixo, entre os marcadores, é publicado no GitHub. Os marcadores `{{SUB-XX}}` são substituídos pelos números reais após a criação das Sub-Issues.

<!-- BODY:START -->
## Objetivo

Permitir que o Cliente aceite a versão vigente de uma Proposta, transformando a negociação em uma Contratação rastreável, com as condições aceitas preservadas e a versão aceita identificável.

## Contexto e escopo

- **Contexto responsável:** C3 — Negociação e Contratação. O aceite e a formação do acordo são resolvidos dentro de C3, sem depender de Agenda ou Pagamentos (TC-C3-01).
- **Arquitetura:** monólito modular (ADR-01), snapshots comerciais e interfaces por propósito (ADR-04).
- **Dentro do escopo:** consulta da versão vigente, aceite com conferência de versão e situação, formação de uma única Contratação com snapshot, gravação atômica, aviso às partes e interface HTTP.
- **Fora do escopo:** criar a Proposta e suas versões (UC06), recusar ou expirar proposta por tempo, Representante (RN11), agendamento (UC09), pagamento (UC10), autenticação e banco de dados.

## Referências

- `docs/trabalhos/trabalho5.md` — §6.3 (especificação do UC07), §7, §8, §26
- `docs/trabalhos/trabalho3.md` — §5.2 (Condições Comerciais, Versão da Proposta), §8, §9 (RN04, RN05), §10, §11.1
- `docs/trabalhos/trabalho4.md` — §3.3 (C3), §9.6 (TC-C3-01), §12.4 (ADR-04), §13.4.3
- `docs/planejamento/uc07/` — análise técnica e artefatos deste planejamento

## Requisitos contemplados

| ID | Requisito |
| --- | --- |
| RN04 | As condições comerciais aceitas permanecem preservadas na Contratação |
| RN05 | A versão aceita da Proposta é identificável |
| CARD-01 | Uma Proposta forma no máximo uma Contratação |
| CICLO | Só `Enviada` ou `Em revisão` aceitam; `Aceita` não volta a `Em revisão` |
| FE-01..03 | Versão não vigente, proposta recusada ou expirada, aceites simultâneos |

## Sub-Issues planejadas

- [ ] {{SUB-01}} — Implementar o aceite no Agregado Proposta
- [ ] {{SUB-02}} — Modelar Contratação Sob Proposta com snapshot imutável
- [ ] {{SUB-03}} — Registrar aceite e Contratação na mesma unidade de consistência
- [ ] {{SUB-04}} — Implementar serviço de aplicação Aceitar Proposta
- [ ] {{SUB-05}} — Expor endpoints HTTP e verificar o aceite de ponta a ponta
- [ ] {{SUB-06}} — Documentar o UC07 e os endpoints

## Critérios gerais de aceite

- [ ] O cliente da Solicitação aceita a versão vigente e recebe uma Contratação com o snapshot das condições e o número da versão aceita.
- [ ] Aceitar uma versão que não é a vigente é recusado e informa a versão atual.
- [ ] Aceitar proposta `Recusada`, `Expirada` ou com validade vencida é recusado.
- [ ] Dois aceites simultâneos formam no máximo uma Contratação.
- [ ] Depois do aceite, a Proposta não volta a `Em revisão` e nenhuma nova versão é aceita.
- [ ] Alterar a origem depois do aceite não altera as condições da Contratação.
- [ ] Testes do UC07 e dos casos de uso anteriores passam juntos; lint e build sem erros.

## Dependências externas e decisões pendentes

- **UC06 — Enviar Proposta:** ainda não especificado nem planejado. O Agregado Proposta, suas versões e as Condições Comerciais nascem nele. **Bloqueia {{SUB-01}}, {{SUB-02}}, {{SUB-03}} e {{SUB-05}}.** Recomendação: especificar e planejar o UC06 antes de mover qualquer issue deste épico para `Ready`.
- **UC05:** a Solicitação ({{UC05-SUB-02}}) identifica cliente e especialista; a porta de aviso ({{UC05-SUB-03}}) é reutilizada para informar as partes; `POST /solicitacoes` ({{UC05-SUB-05}}) é usado nos testes de ponta a ponta.
- **D1 — Origem da identidade do agente:** pendente (mesma decisão do UC02).
- **D-UC07-02:** dúvida aberta — especialista suspenso depois de enviar a Proposta impede o aceite? Nenhuma regra será implementada sem decisão.
- **D-UC07-04 e D-UC07-05:** validade vencida no aceite e repetição após resposta perdida — propostas a confirmar.

## Condições de conclusão

O épico é concluído quando todas as Sub-Issues estiverem em `Done`, os critérios gerais estiverem verificados por testes (incluindo concorrência) e as decisões D1, D-UC07-03, D-UC07-04 e D-UC07-05 estiverem registradas.
<!-- BODY:END -->
