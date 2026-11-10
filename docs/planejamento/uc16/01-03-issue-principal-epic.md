# 01-03 — Issue principal (Epic)

**Título:** `[UC16] Registrar Organização`  
**Labels:** `usecase:uc16`, `domain:identidade`, `type:epic`, `priority:medium`  
**Responsável:** @leohsm  
**Estado inicial no board:** `Backlog`

O corpo abaixo, entre os marcadores, é publicado no GitHub. Os marcadores `{{SUB-XX}}` são substituídos pelos números reais após a criação das issues.

<!-- BODY:START -->
## Objetivo

Permitir que um Usuário cadastrado registre uma Organização, de modo que existam, juntos e nunca separados, a Organização e o Vínculo Organizacional do Usuário como representante (RN11).

## Contexto e escopo

- **Contexto responsável:** C1 — Identidade e Organizações.
- **Arquitetura:** módulo `identidade` do monólito modular, com TypeORM e migration como no UC01 [CÓD]; o reconhecimento do Usuário usa a interface existente `reconhecimento-de-usuario`.
- **Dentro do escopo:** Agregados Organização e Vínculo Organizacional, persistência atômica, serviço de aplicação, endpoint HTTP e documentação.
- **Fora do escopo:** verificação de que a pessoa representa de fato a organização, unicidade da Organização, edição e exclusão de Organização, autenticação.

## Referências

- `docs/casos-de-uso.md` — especificação de UC16
- `docs/trabalhos/trabalho3.md` — §5, §6, §8, §9, §10, §11
- `docs/trabalhos/trabalho4.md` — §3.1, §3.6, §6, §9
- `docs/trabalhos/trabalho5.md` — §3, §5, §8, §9
- `docs/planejamento/uc16/` — artefatos deste planejamento

## Requisitos contemplados

| ID | Requisito |
| --- | --- |
| RN11 | O vínculo criado é o que permitirá agir em nome da organização. |
| INV-01 | Todo Vínculo Organizacional relaciona exatamente um Usuário e uma Organização. |

**Fluxos:** passo 1 a 4 do fluxo principal; FE-01, FE-02, FE-03.

## Sub-Issues planejadas

- [ ] {{SUB-01}} — [C1] Modelar a Organização e o Vínculo Organizacional
- [ ] {{SUB-02}} — [C1] Persistir Organização e Vínculo na mesma transação
- [ ] {{SUB-03}} — [C1] Implementar o serviço de aplicação Registrar Organização
- [ ] {{SUB-04}} — [C1] Expor o endpoint de registro de Organização
- [ ] {{SUB-05}} — [C1] Documentar o UC16 e o endpoint

## Critérios gerais de aceite

- [ ] Usuário cadastrado registra a Organização e recebe a Organização; existe o vínculo de representante.
- [ ] Usuário não reconhecido e dados fora do formato são recusados sem registrar nada.
- [ ] Falha técnica não deixa Organização sem representante nem vínculo sem Organização.
- [ ] Testes do caso de uso e dos casos de uso anteriores passam juntos; `lint` e `build` sem erros.

## Dependências externas e decisões pendentes

- **UC01 — Cadastrar Usuário:** já implementado; fornece o Usuário e o reconhecimento.
- **UC17 e UC15:** usam o vínculo criado aqui.
- **Classificação Futuro:** só depois das dúvidas D-UC16-01 a D-UC16-03.
- **D-UC16-01:** Quais dados identificam uma Organização (nome, documento fiscal)? Não documentado. Proposta: apenas o nome.
- **D-UC16-02:** Pode existir mais de uma Organização com os mesmos dados? Não documentado; nenhuma unicidade assumida.
- **D-UC16-03:** Há verificação de que a pessoa realmente representa a organização? Não documentado; nenhuma verificação criada.
- **D-UC16-04:** Papel do vínculo do criador: representante (documentado); a lista de papéis é indefinida (T3 §6.1).
- **D-UC16-05:** Origem do identificador do Usuário (D1).

## Condições de conclusão

O épico é concluído quando todas as Sub-Issues estiverem em `Done`, os critérios gerais estiverem verificados por testes e as decisões D-UC16-01, D-UC16-02 e D-UC16-04 estiverem registradas.
<!-- BODY:END -->
