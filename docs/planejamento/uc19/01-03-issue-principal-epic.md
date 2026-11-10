# 01-03 — Issue principal (Epic)

**Título:** `[UC19] Reativar Perfil de Especialista`  
**Labels:** `usecase:uc19`, `domain:oferta`, `domain:governanca`, `type:epic`, `priority:medium`  
**Responsável:** @leohsm  
**Estado inicial no board:** `Backlog`

O corpo abaixo, entre os marcadores, é publicado no GitHub. Os marcadores `{{SUB-XX}}` são substituídos pelos números reais após a criação das issues.

<!-- BODY:START -->
## Objetivo

Permitir que o Administrador reative um Perfil de Especialista suspenso, com justificativa, devolvendo ao perfil a capacidade de publicar Serviços e receber Solicitações (RN01), de modo que uma suspensão errada não seja irreversível.

## Contexto e escopo

- **Contexto responsável:** C2 executa; C6 registra [T5 §5.3].
- **Arquitetura:** reutiliza o registro administrativo e a verificação do Administrador criados no UC18; módulos `oferta` e `governanca`.
- **Dentro do escopo:** operação `reativar` no perfil, novo tipo de ação administrativa, serviço de aplicação, endpoint HTTP e documentação.
- **Fora do escopo:** limite de suspensões e prazo mínimo (não documentados), efeitos sobre propostas e reservas, autenticação real (D1).

## Referências

- `docs/casos-de-uso.md` — especificação de UC19
- `docs/trabalhos/trabalho3.md` — §5, §8, §9, §10, §11
- `docs/trabalhos/trabalho5.md` — §3, §5, §8, §9
- `docs/planejamento/uc18/` — registro administrativo reutilizado
- `docs/planejamento/uc19/` — artefatos deste planejamento

## Requisitos contemplados

| ID | Requisito |
| --- | --- |
| RN01 | Perfil `ATIVO` volta a publicar Serviços e a receber Solicitações. |
| RN15 | Ações administrativas são rastreáveis: autor, justificativa e instante. |

**Fluxos:** passo 1 a 5 do fluxo principal; FE-01, FE-02, FE-03.

## Sub-Issues planejadas

- [ ] {{SUB-01}} — [C2] Implementar a transição de reativação no Perfil de Especialista
- [ ] {{SUB-02}} — [C2] Implementar o serviço de aplicação Reativar Perfil e o registro da ação
- [ ] {{SUB-03}} — [C2] Expor o endpoint de reativação e provar o efeito de RN01
- [ ] {{SUB-04}} — [C6] Garantir a rastreabilidade do ciclo suspensão-reativação
- [ ] {{SUB-05}} — [C2] Documentar o UC19 e o endpoint

## Critérios gerais de aceite

- [ ] O Administrador reativa um perfil `SUSPENSO`, informando justificativa, e o perfil volta a `ATIVO`.
- [ ] A ação fica registrada com autor, justificativa e instante (RN15).
- [ ] Justificativa ausente, perfil já `ATIVO` e ator que não é Administrador são recusados sem registro.
- [ ] Depois da reativação, o perfil volta a publicar Serviços e a receber Solicitações (RN01).
- [ ] Testes do caso de uso e dos casos de uso anteriores passam juntos; `lint` e `build` sem erros.

## Dependências externas e decisões pendentes

- **UC18 — Suspender Perfil:** fornece o registro administrativo, a verificação do Administrador e o perfil `SUSPENSO`; **bloqueia** este caso de uso.
- **UC02:** define as situações do perfil (já implementado).
- **D1:** mesma limitação de identidade do UC18.
- **D-UC19-01:** Há limite de suspensões e reativações ou prazo mínimo de suspensão? Não documentado; nenhuma regra é criada.

## Condições de conclusão

O épico é concluído quando todas as Sub-Issues estiverem em `Done`, os critérios gerais estiverem verificados por testes e as decisões D-UC19-01 e D-UC19-02 estiverem registradas.
<!-- BODY:END -->
