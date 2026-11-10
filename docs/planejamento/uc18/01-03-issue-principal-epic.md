# 01-03 — Issue principal (Epic)

**Título:** `[UC18] Suspender Perfil de Especialista`  
**Labels:** `usecase:uc18`, `domain:oferta`, `domain:governanca`, `type:epic`, `priority:medium`  
**Responsável:** @leohsm  
**Estado inicial no board:** `Backlog`

O corpo abaixo, entre os marcadores, é publicado no GitHub. Os marcadores `{{SUB-XX}}` são substituídos pelos números reais após a criação das issues.

<!-- BODY:START -->
## Objetivo

Permitir que o Administrador suspenda um Perfil de Especialista, com justificativa, de modo que o perfil deixe de publicar Serviços e de receber novas Solicitações (RN01) e que a ação fique registrada com autor, justificativa e instante (RN15).

## Contexto e escopo

- **Contexto responsável:** C2 executa a mudança de situação; C6 registra e solicita a ação [T5 §5.3; T4 §3.6].
- **Arquitetura:** C6 chama o comando público de C2 e C2 nunca depende de C6 para decidir; módulos `oferta` e `governanca` no monólito modular.
- **Dentro do escopo:** operação `suspender` no perfil, registro administrativo em C6, serviço de aplicação, verificação do papel de Administrador (proposta), endpoint HTTP e documentação.
- **Fora do escopo:** efeito sobre propostas já enviadas e reservas futuras (dúvidas abertas), visibilidade dos Serviços, avisos ao especialista (serviço de notificações), autenticação e papel de Administrador real (D1).

## Referências

- `docs/casos-de-uso.md` — especificação de UC18
- `docs/trabalhos/trabalho3.md` — §5, §8, §9, §10, §11
- `docs/trabalhos/trabalho4.md` — §3.6, §9 (TC-C2-01)
- `docs/trabalhos/trabalho5.md` — §3, §5, §8, §9
- `docs/planejamento/uc18/` — artefatos deste planejamento

## Requisitos contemplados

| ID | Requisito |
| --- | --- |
| RN01 | Perfil suspenso não publica Serviços nem recebe novas Solicitações. |
| RN15 | Ações administrativas são rastreáveis: autor, justificativa e instante. |

**Fluxos:** passo 1 a 5 do fluxo principal; FE-01, FE-02, FE-03, FE-04, FE-05.

## Sub-Issues planejadas

- [ ] {{SUB-01}} — [C2] Implementar a transição de suspensão no Perfil de Especialista
- [ ] {{SUB-02}} — [C6] Registrar a ação administrativa em C6
- [ ] {{SUB-03}} — [C2] Implementar o serviço de aplicação Suspender Perfil
- [ ] {{SUB-04}} — [C2] Expor o endpoint de suspensão e provar a concorrência com publicação
- [ ] {{SUB-05}} — [C2] Documentar o UC18 e o endpoint

## Critérios gerais de aceite

- [ ] O Administrador suspende um perfil `ATIVO`, informando justificativa, e o perfil passa a `SUSPENSO`.
- [ ] A ação fica registrada com autor, justificativa e instante (RN15).
- [ ] Justificativa ausente, perfil já `SUSPENSO` e ator que não é Administrador são recusados sem registro.
- [ ] Operações posteriores à suspensão (publicar, nova Solicitação) são recusadas; as anteriores são preservadas.
- [ ] A falha do registro administrativo ou do aviso não deixa o perfil em estado inconsistente.
- [ ] Testes do caso de uso e dos casos de uso anteriores passam juntos; `lint` e `build` sem erros.

## Dependências externas e decisões pendentes

- **UC02 — Perfil de Especialista:** já implementado; define `ATIVO` e `SUSPENSO`.
- **UC19 — Reativar:** entra junto, para que uma suspensão errada não seja irreversível [T5 §9.3]; compartilha o registro administrativo de C6.
- **UC21 — Decidir Disputa:** pode solicitar a suspensão (FE-05); depende deste caso de uso.
- **D1:** não há autenticação nem papel de Administrador real; o ator é informado pelo cliente.
- **D-UC18-03:** A suspensão impede aceitar proposta já enviada? Aberta desde o UC07 (D-UC07-02).
- **D-UC18-04:** Reservas confirmadas futuras e visibilidade dos Serviços do especialista suspenso não são documentadas.

## Condições de conclusão

O épico é concluído quando todas as Sub-Issues estiverem em `Done`, os critérios gerais estiverem verificados por testes e as decisões D-UC18-01 a D-UC18-04 estiverem registradas.
<!-- BODY:END -->
