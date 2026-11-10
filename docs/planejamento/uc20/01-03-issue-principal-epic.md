# 01-03 — Issue principal (Epic)

**Título:** `[UC20] Abrir Disputa`  
**Labels:** `usecase:uc20`, `domain:governanca`, `type:epic`, `priority:medium`  
**Responsável:** @leohsm  
**Estado inicial no board:** `Backlog`

O corpo abaixo, entre os marcadores, é publicado no GitHub. Os marcadores `{{SUB-XX}}` são substituídos pelos números reais após a criação das issues.

<!-- BODY:START -->
## Objetivo

Permitir que uma parte da Contratação abra uma Disputa `Aberta`, com o questionamento e as evidências preservados, sem alterar nem bloquear Reservas, Pagamentos ou a própria Contratação.

## Contexto e escopo

- **Contexto responsável:** C6 — Governança e Disputas [T4 §3.6].
- **Arquitetura:** módulo `governanca` do monólito modular; C6 consulta os outros contextos por visões públicas e nunca altera Reservas, Pagamentos ou condições (TC-C6-02).
- **Dentro do escopo:** Agregado Disputa com ciclo provisório, verificação das partes e do pertencimento, serviço de aplicação, aviso às partes, endpoint HTTP e documentação.
- **Fora do escopo:** decidir a Disputa (UC21), prazo para abrir, efeitos sobre repasse ou demais operações (abrir não bloqueia nada, TC-C6-02), recurso, autenticação.

## Referências

- `docs/casos-de-uso.md` — especificação de UC20
- `docs/trabalhos/trabalho3.md` — §5, §6, §8, §9, §10, §11
- `docs/trabalhos/trabalho4.md` — §3.1, §3.6, §6, §9
- `docs/trabalhos/trabalho5.md` — §3, §5, §8, §9
- `docs/planejamento/uc18/` — registro administrativo em C6
- `docs/planejamento/uc20/` — artefatos deste planejamento

## Requisitos contemplados

| ID | Requisito |
| --- | --- |
| RN11 | Agir em nome de organização exige vínculo compatível. |
| RN15 | Ações administrativas e de governança são rastreáveis: autor, instante e referência. |
| INV-01 | Contratação — Disputa `1 : 0..*`; abrir Disputa não bloqueia as demais operações (TC-C6-02). |

**Fluxos:** passo 1 a 4 do fluxo principal; FE-01, FE-02, FE-03.

## Sub-Issues planejadas

- [ ] {{SUB-01}} — [C6] Modelar a Disputa e seu ciclo provisório
- [ ] {{SUB-02}} — [C6] Definir as portas de verificação das partes e do pertencimento
- [ ] {{SUB-03}} — [C6] Implementar o serviço de aplicação Abrir Disputa
- [ ] {{SUB-04}} — [C6] Expor o endpoint de abertura de Disputa e verificar a jornada
- [ ] {{SUB-05}} — [C6] Documentar o UC20 e o endpoint

## Critérios gerais de aceite

- [ ] Uma parte da Contratação abre a Disputa `Aberta` com questionamento e evidências preservados.
- [ ] Ator que não é parte, Sessão ou Pagamento que não pertence à Contratação e Representante sem vínculo são recusados sem registro.
- [ ] Abrir a Disputa não altera nem bloqueia Reserva, Pagamento ou Contratação.
- [ ] Testes do caso de uso e dos casos de uso anteriores passam juntos; `lint` e `build` sem erros.

## Dependências externas e decisões pendentes

- **UC07 e UC08:** fornecem a Contratação; **UC13** e **UC10** fornecem a Sessão e o Pagamento verificados por visão pública.
- **UC15/UC17:** a visão de vínculos para o Representante (RN11).
- **UC21:** depende deste caso de uso.
- **Classificação Futuro:** o ciclo da Disputa é provisório [T3 §11.5].
- **D-UC20-01:** Prazo para abrir disputa depois da Sessão ou do Pagamento: não documentado; nenhuma regra criada.
- **D-UC20-02:** A abertura suspende algum efeito (por exemplo, repasse)? Não documentado; T4 TC-C6-02 recomenda não.
- **D-UC20-03:** Ciclo da Disputa (`Aberta`, `Em análise`, `Aguardando informações`, `Resolvida`, `Cancelada`, `Encerrada`) é provisório [T3 §11.5].
- **D-UC20-05:** Contratação — Disputa `1 : 0..*` (hipótese plausível de T3 §8): mais de uma Disputa por Contratação é aceita.
- **D-UC20-08:** Origem do identificador do ator (D1).

## Condições de conclusão

O épico é concluído quando todas as Sub-Issues estiverem em `Done`, os critérios gerais estiverem verificados por testes e as decisões D-UC20-01 a D-UC20-04 estiverem registradas.
<!-- BODY:END -->
