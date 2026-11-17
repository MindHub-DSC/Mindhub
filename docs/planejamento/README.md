# Planejamentos dos casos de uso

Cada pasta contém os 12 artefatos do prompt `docs/prompts/01-planejamento-de-Implementação-a-partir-de-casos-de-uso.md` (`01-01` a `01-12`). A fonte é `docs/casos-de-uso.md`.

| Caso de uso | Nome | Contexto | MVP | Pasta | Sub-Issues | Situação |
| --- | --- | --- | --- | --- | --- | --- |
| UC01 | Cadastrar Usuário | C1 | Central | — | — | Implementado; anterior ao processo |
| UC02 | Cadastrar Perfil de Especialista | C2 | Central | [../apoio/etapa-01](../apoio/etapa-01/) | 7 | Implementado (PR #34); épico #1 |
| UC03 | Publicar Serviço | C2 | Central | [uc03](uc03/) | 6 | Planejamento gerado em 10/11/2026; não publicado no GitHub |
| UC04 | Buscar Especialistas e Serviços | C2 | Secundário | [uc04](uc04/) | 5 | Planejamento gerado em 10/11/2026; não publicado no GitHub |
| UC05 | Enviar Solicitação de Atendimento | C3 | Central | [uc05](uc05/) | 7 | Planejado; épico #10 |
| UC06 | Enviar Proposta | C3 | Central | [uc06](uc06/) | 6 | Planejamento gerado em 10/11/2026; não publicado no GitHub |
| UC07 | Aceitar Proposta | C3 | Central | [uc07](uc07/) | 6 | Planejado; épico #18 |
| UC08 | Contratar Serviço de Reserva Direta | C3 | Secundário | [uc08](uc08/) | 5 | Planejamento gerado em 10/11/2026; não publicado no GitHub |
| UC09 | Agendar Sessão Contratada | C4 | Central | [uc09](uc09/) | 7 | Planejamento gerado em 10/11/2026; não publicado no GitHub |
| UC10 | Pagar Reserva | C5 | Central | [uc10](uc10/) | 8 | Planejado; épico #25 |
| UC11 | Reagendar Sessão | C4 | Secundário | [uc11](uc11/) | 5 | Planejamento gerado em 10/11/2026; não publicado no GitHub |
| UC12 | Cancelar Reserva | C4 | Futuro | — | — | Não planejado: Política de Cancelamento indefinida (`casos-de-uso.md` UC12) |
| UC13 | Realizar Sessão | C4 | Central | [uc13](uc13/) | 6 | Planejamento gerado em 10/11/2026; não publicado no GitHub |
| UC14 | Avaliar Sessão | C4 | Secundário | [uc14](uc14/) | 5 | Planejamento gerado em 10/11/2026; não publicado no GitHub |
| UC15 | Indicar Participantes da Sessão | C4 | Futuro | [uc15](uc15/) | 5 | Planejamento gerado em 10/11/2026; não publicado no GitHub |
| UC16 | Registrar Organização | C1 | Futuro | [uc16](uc16/) | 5 | Planejamento gerado em 10/11/2026; não publicado no GitHub |
| UC17 | Vincular Membro à Organização | C1 | Futuro | [uc17](uc17/) | 5 | Planejamento gerado em 10/11/2026; não publicado no GitHub |
| UC18 | Suspender Perfil de Especialista | C2 | Secundário | [uc18](uc18/) | 5 | Planejamento gerado em 10/11/2026; não publicado no GitHub |
| UC19 | Reativar Perfil de Especialista | C2 | Secundário | [uc19](uc19/) | 5 | Planejamento gerado em 10/11/2026; não publicado no GitHub |
| UC20 | Abrir Disputa | C6 | Futuro | [uc20](uc20/) | 5 | Planejamento gerado em 10/11/2026; não publicado no GitHub |
| UC21 | Decidir Disputa | C6 | Futuro | [uc21](uc21/) | 6 | Planejamento gerado em 10/11/2026; não publicado no GitHub |

## Observações

- Os planejamentos de UC03, UC04, UC06, UC08, UC09, UC11, UC13 a UC21 (exceto UC12) vêm de casos de uso *Derivado — a validar*. As marcas **[PROP]** do documento de casos de uso foram tratadas como hipóteses: cada pasta lista, em `01-01` §9, o que é dúvida documentada e o que é proposta técnica, e nenhuma Sub-Issue deve ir para `Ready` antes da confirmação (`docs/casos-de-uso.md` §9).
- UC15, UC16, UC17, UC20 e UC21 são classificados como **Futuro**; o planejamento existe para completar o catálogo, não para iniciar a implementação.
- O 01-13 (evidências de execução no GitHub) não existe nas pastas geradas: o roteiro `01-10` ainda não foi executado.

## Ordem de dependência sugerida

`UC01 → UC02 → UC03 → UC04 → UC05 → UC06 → UC07 → UC09 → UC08 → UC10 → UC11 → UC13 → UC14`; em paralelo, `UC18 → UC19` depois do UC02; `UC16 → UC17 → UC15` depois do UC13; `UC20 → UC21` depois do UC07 e do UC18. UC09 antecede UC08 e UC10 porque implementa o contrato C01.
