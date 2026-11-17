# 01-03 — Issue principal (Epic)

**Título:** `[UC17] Vincular Membro à Organização`  
**Labels:** `usecase:uc17`, `domain:identidade`, `type:epic`, `priority:medium`  
**Responsável:** @leohsm  
**Estado inicial no board:** `Backlog`

O corpo abaixo, entre os marcadores, é publicado no GitHub. Os marcadores `{{SUB-XX}}` são substituídos pelos números reais após a criação das issues.

<!-- BODY:START -->
## Objetivo

Permitir que o Representante, com vínculo compatível verificado no instante da operação, vincule um Usuário cadastrado à sua Organização com um papel, de modo que a falha do aviso ao membro não invalide o vínculo.

## Contexto e escopo

- **Contexto responsável:** C1 — Identidade e Organizações.
- **Arquitetura:** módulo `identidade`; reutiliza o Vínculo e o repositório do UC16; o reconhecimento do Usuário usa a interface existente.
- **Dentro do escopo:** papéis do vínculo, verificação do vínculo do Representante, serviço de aplicação, aviso ao membro, endpoint HTTP e documentação.
- **Fora do escopo:** revogar vínculo (sem Caso de Uso), aceite do vínculo pelo membro, lista fechada de papéis (não documentados), autenticação.

## Referências

- `docs/casos-de-uso.md` — especificação de UC17
- `docs/trabalhos/trabalho3.md` — §5, §6, §8, §9, §10, §11
- `docs/trabalhos/trabalho4.md` — §3.1, §3.6, §6, §9
- `docs/trabalhos/trabalho5.md` — §3, §5, §8, §9
- `docs/planejamento/uc16/` — Organização e Vínculo
- `docs/planejamento/uc17/` — artefatos deste planejamento

## Requisitos contemplados

| ID | Requisito |
| --- | --- |
| RN11 | Agir em nome de organização exige vínculo compatível. |
| INV-01 | Todo Vínculo relaciona exatamente um Usuário e uma Organização; Usuário — Vínculo `1 : 0..*` e Organização — Vínculo `1 : 0..*`. |

**Fluxos:** passo 1 a 5 do fluxo principal; FE-01, FE-02, FE-03, FE-04.

## Sub-Issues planejadas

- [ ] {{SUB-01}} — [C1] Estender o Vínculo Organizacional com papéis de membro
- [ ] {{SUB-02}} — [C1] Verificar o vínculo do Representante no instante da operação
- [ ] {{SUB-03}} — [C1] Implementar o serviço de aplicação Vincular Membro
- [ ] {{SUB-04}} — [C1] Expor o endpoint de vínculo e verificar a jornada
- [ ] {{SUB-05}} — [C1] Documentar o UC17 e o endpoint

## Critérios gerais de aceite

- [ ] O Representante com vínculo compatível vincula um Usuário cadastrado com um papel e recebe o vínculo.
- [ ] Representante sem vínculo compatível, Usuário não reconhecido e vínculo do Representante revogado antes da operação são recusados sem registro.
- [ ] Falha do aviso ao membro não invalida o vínculo.
- [ ] Testes do caso de uso e dos casos de uso anteriores passam juntos; `lint` e `build` sem erros.

## Dependências externas e decisões pendentes

- **UC16 — Registrar Organização:** fornece a Organização, o Vínculo e o repositório; **bloqueia** este caso de uso.
- **UC15:** consome os vínculos criados aqui.
- **Revogar vínculo:** aparece em TC-C1-01, mas não é Caso de Uso; a revogação concorrente só é simulada em teste.
- **D-UC17-01:** Quais papéis existem? T3 §6.1 cita representante, colaborador e participante autorizado, sem lista fechada.
- **D-UC17-02:** O membro precisa aceitar o vínculo? Não documentado; o vínculo é registrado diretamente.
- **D-UC17-03:** Um Usuário pode ter dois vínculos com a mesma Organização (papéis diferentes)? Não documentado.
- **D-UC17-04:** Revogar vínculo é usado em TC-C1-01 sem Caso de Uso; a revogação é simulada em teste e não implementada.
- **D-UC17-07:** Origem do identificador do Representante (D1).

## Condições de conclusão

O épico é concluído quando todas as Sub-Issues estiverem em `Done`, os critérios gerais estiverem verificados por testes e as decisões D-UC17-01 a D-UC17-03 estiverem registradas.
<!-- BODY:END -->
