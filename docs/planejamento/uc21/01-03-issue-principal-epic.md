# 01-03 — Issue principal (Epic)

**Título:** `[UC21] Decidir Disputa`  
**Labels:** `usecase:uc21`, `domain:governanca`, `type:epic`, `priority:medium`  
**Responsável:** @leohsm  
**Estado inicial no board:** `Backlog`

O corpo abaixo, entre os marcadores, é publicado no GitHub. Os marcadores `{{SUB-XX}}` são substituídos pelos números reais após a criação das issues.

<!-- BODY:START -->
## Objetivo

Permitir que o Administrador decida uma Disputa aberta, com decisão registrada (autor, fundamento, referência), solicite as ações decorrentes aos contextos proprietários sem alterá-los diretamente e registre separadamente a solicitação e o resultado de cada ação, inclusive recusas.

## Contexto e escopo

- **Contexto responsável:** C6 — Governança e Disputas.
- **Arquitetura:** C6 solicita ações por comandos públicos (por exemplo, a suspensão de perfil do UC18) e registra a resposta; a decisão permanece registrada ainda que a ação seja recusada (TC-C6-01).
- **Dentro do escopo:** ciclo de decisão, registro de ações, portas de comandos, serviço de aplicação, endpoint HTTP e documentação.
- **Fora do escopo:** ações dependentes de política inexistente (estorno, compensação), recurso contra a decisão, estados intermediários além dos provisórios, autenticação.

## Referências

- `docs/casos-de-uso.md` — especificação de UC21
- `docs/trabalhos/trabalho3.md` — §5, §6, §8, §9, §10, §11
- `docs/trabalhos/trabalho4.md` — §3.1, §3.6, §6, §9
- `docs/trabalhos/trabalho5.md` — §3, §5, §8, §9
- `docs/planejamento/uc18/` — suspensão de perfil e registro administrativo
- `docs/planejamento/uc20/` — Disputa
- `docs/planejamento/uc21/` — artefatos deste planejamento

## Requisitos contemplados

| ID | Requisito |
| --- | --- |
| RN15 | Ações administrativas são rastreáveis: autor, fundamento e referência. |
| INV-01 | C6 não altera diretamente Reservas, Pagamentos nem condições contratadas. |

**Fluxos:** passo 1 a 5 do fluxo principal; FA-01, FA-02, FE-01, FE-02, FE-03.

## Sub-Issues planejadas

- [ ] {{SUB-01}} — [C6] Estender a Disputa com o ciclo de decisão
- [ ] {{SUB-02}} — [C6] Registrar as ações decorrentes separadamente da decisão
- [ ] {{SUB-03}} — [C6] Definir as portas de comandos dos contextos e o adaptador da suspensão
- [ ] {{SUB-04}} — [C6] Implementar o serviço de aplicação Decidir Disputa
- [ ] {{SUB-05}} — [C6] Expor os endpoints de decisão e verificar a jornada
- [ ] {{SUB-06}} — [C6] Documentar o UC21 e o endpoint

## Critérios gerais de aceite

- [ ] O Administrador decide uma Disputa aberta e a decisão fica registrada com autor, fundamento e referência à Disputa; a Disputa fica `Resolvida`.
- [ ] Cada ação decorrente é solicitada ao contexto proprietário e a solicitação e o resultado ficam registrados separadamente da decisão.
- [ ] A recusa de uma ação não desfaz a decisão; o comando repetido para a mesma decisão não é reaplicado.
- [ ] Disputa sem informações vai para `Aguardando informações` e pode ser `Cancelada`; ator que não é Administrador é recusado.
- [ ] Testes do caso de uso e dos casos de uso anteriores passam juntos; `lint` e `build` sem erros.

## Dependências externas e decisões pendentes

- **UC20 — Abrir Disputa:** fornece a Disputa aberta; **bloqueia** este caso de uso.
- **UC18 — Suspender Perfil:** única ação documentada que pode ser solicitada (FE-05 do UC18); fornece também o registro administrativo.
- **Política de estorno e compensação:** inexistente [T4 §8.2.4, TC-C5-02]; ações financeiras não são planejadas.
- **Classificação Futuro:** estados intermediários provisórios [T3 §11.5].
- **D-UC21-01:** Os estados intermediários (`Em análise`, `Aguardando informações`) e `Resolvida → Encerrada` são provisórios [T3 §11.5]; T2.1 §13.8 incluía `Em triagem`.
- **D-UC21-02:** Quais ações uma decisão pode solicitar? Estorno e compensação dependem de política inexistente. Este planejamento trata só a suspensão de perfil.
- **D-UC21-03:** Há recurso contra a decisão? Não documentado; nenhuma etapa criada.

## Condições de conclusão

O épico é concluído quando todas as Sub-Issues estiverem em `Done`, os critérios gerais estiverem verificados por testes e as decisões D-UC21-01 a D-UC21-03 estiverem registradas.
<!-- BODY:END -->
