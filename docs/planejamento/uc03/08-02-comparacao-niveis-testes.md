# 08-02 — Comparação dos níveis de teste

**Caso de uso:** UC03 — Publicar Serviço (épico [#35](https://github.com/MindHub-DSC/Mindhub/issues/35))
**Data:** 17/11/2026
**Branch analisada:** `feature/40-uc03-endpoint-publicar-servico` @ `2545027`

## 1. Testes existentes, por nível

| Nível | Arquivo | Testes | Origem |
| --- | --- | --- | --- |
| A — unitário do serviço | `test/unit/oferta/publicar-servico.spec.ts` | 6 | #38 (Material 07, antes do endpoint) |
| A' — unitário de domínio | `test/unit/oferta/servico.spec.ts` | 27 | #36 (Materiais 04 a 07) |
| A'' — contrato da porta | `test/unit/oferta/contrato-servicos-em-memoria.spec.ts` | 6 | #36 |
| B — HTTP com serviço simulado | `test/unit/oferta/servicos.http.spec.ts` | 12 | #40 (Material 07) |
| C+ — E2E com PostgreSQL | `test/e2e/servicos.e2e-spec.ts` | 2 | #40 (Material 07) |
| **C — integrado do backend** | **a criar** (Fase 7) | — | Material 08 |

Observação sobre o Nível A deste projeto: o `PublicarServico` não é testado com `vi.fn()`. Os dublês são as **implementações em memória** das portas (`PerfisEspecialistaEmMemoria`, `ServicosEmMemoria`), que cumprem o mesmo contrato. São dublês do tipo *fake*, não *mocks*: não verificam chamadas, guardam estado.

Observação sobre o "C+": o E2E do Material 07 já usa o `AppModule` real (portanto `OfertaModule`, controller, serviço, porta e `ServicosEmMemoria` reais). Ele vai **além** do Nível C, porque o repositório de perfis é o TypeORM com PostgreSQL. Ele não inspeciona o repositório de Serviços e depende do banco no ar.

## 2. Matriz comparativa

| Critério | Nível A — Unitário do serviço | Nível B — HTTP com serviço simulado | Nível C — Integrado do backend (Material 08) |
| --- | --- | --- | --- |
| **Componentes reais** | `PublicarServico`, `Servico` (domínio), `PerfilEspecialista`, `ServicosEmMemoria`, `PerfisEspecialistaEmMemoria` | `ServicosController`, `publicarServicoSchema`, `StandardSchemaValidationPipe`, `ErrosDePublicacaoFilter`, `ArmazenamentoIndisponivelFilter`, roteamento e serialização do Nest | `OfertaModule` real (controller, schema, pipe, filtros, `PublicarServico`, `SERVICOS_REPOSITORIO` → `ServicosEmMemoria`), domínio |
| **Componentes simulados** | Nenhum `vi.fn()`; as portas são *fakes* em memória injetados à mão | `PublicarServico` (`{ executar: vi.fn() }`) | **Nenhum mock.** Só o provider de perfis precisa ser decidido (ver seção 3) |
| **Dependências exercitadas** | Construtor do serviço com as duas portas | Container do Nest só para o controller; o serviço é `useValue` | Container do Nest resolvendo a cadeia controller → serviço → `SERVICOS_REPOSITORIO` → `ServicosEmMemoria` pelo **módulo real** |
| **Comportamento verificado** | RN01 (perfil `ATIVO`), ator sem perfil, recusas de domínio, nada registrado em recusa, dois Serviços por perfil | Rota, status, validação do corpo (400 sem chamar o serviço), delegação com os argumentos, tradução dos erros (404/403/422/400/503) | Requisição atravessando tudo: 201 com o Serviço criado pelo serviço real; 400 na fronteira; e o **estado do repositório em memória** depois da requisição |
| **Evidência produzida** | Retorno do serviço e estado dos *fakes* (`chamadasDeAdicionar`, `listarPorPerfil`) | Status e corpo HTTP; chamadas registradas no `vi.fn()` | Status e corpo HTTP + leitura do provider resolvido pelo container |
| **Limitações** | Sem HTTP, sem pipe, sem filtros, sem módulo, sem DI do Nest | Não executa o serviço real nem resolve o repositório; um erro de composição do `OfertaModule` passaria despercebido | Sem banco para Serviços (memória); não prova transações, constraints, durabilidade (#37) |
| **CAs não cobertos** | #40 inteira (é HTTP) | Critério 5 da #40 (jornada real) e qualquer critério que dependa do serviço real | #37 (persistência), #39 (concorrência), 403 com perfil realmente suspenso (não há UC18) |

## 3. Questão específica deste projeto: o repositório de perfis

O `PublicarServico` consulta o perfil do ator pela porta `PERFIS_ESPECIALISTA_REPOSITORIO`, que no `OfertaModule` é o adaptador TypeORM. Para o Nível C há duas formas legítimas:

| Opção | Como | Prós | Contras |
| --- | --- | --- | --- |
| C1 — módulo real + PostgreSQL de teste | `imports: [AppModule]` ou `OfertaModule` com a conexão de teste, como o E2E existente | Nada é trocado | Igual ao E2E do Material 07; depende do banco; não é o "fluxo em memória" que o material pede |
| C2 — módulo real + troca explícita do provider de **perfis** | `Test.createTestingModule({ imports: [OfertaModule] })` com `overrideProvider(PERFIS_ESPECIALISTA_REPOSITORIO).useValue(new PerfisEspecialistaEmMemoria())` e substituição da conexão TypeORM que o módulo exige | Roda sem banco; **controller, serviço e repositório de Serviços continuam reais** e resolvidos pelo módulo | A porta de perfis passa a ser o *fake* em memória (não é mock de `vi.fn()`; é a implementação que já cumpre a suíte de contrato do UC02) |

Nenhuma das duas substitui o **serviço** ou o **repositório de Serviços**, que são os componentes que o Material 08 proíbe trocar. A viabilidade técnica da C2 (substituir a conexão TypeORM do módulo sem tocar no código de produção) é verificada na Fase 5.

## 4. Conclusão

> **O teste HTTP com serviço simulado do Material 07 (`servicos.http.spec.ts`) não substitui o teste integrado com serviço e repositório reais.**

O Nível B prova que a fronteira **delegaria** corretamente, mas o serviço é um `vi.fn()`: se o `OfertaModule` registrasse o token errado, ou se o `PublicarServico` não gravasse no repositório, o Nível B continuaria verde. O Nível A prova as regras sem HTTP. Só o Nível C junta os dois com a composição real do módulo.

No projeto, o E2E existente já cobre a jornada com banco. O teste do Material 08 acrescenta:

1. o fluxo com o **módulo da funcionalidade** e o repositório de Serviços resolvido pelo container;
2. a **inspeção do repositório em memória** pelo token, depois da requisição (Fase 8);
3. a verificação de que uma requisição **recusada não registra** nada no repositório real.
