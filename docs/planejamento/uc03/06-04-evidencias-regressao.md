# 06-04 — Evidências de regressão

**Caso de uso:** UC03 — Publicar Serviço (épico [#35](https://github.com/MindHub-DSC/Mindhub/issues/35))
**Sub-Issue:** [#36](https://github.com/MindHub-DSC/Mindhub/issues/36)
**Branch:** `feature/36-uc03-modelar-servico` (base `db56884` + remoção de `NaoImplementado`, ainda não commitada)
**Data:** 17/11/2026

## 1. Comandos executados e saídas

### Suíte unitária completa, com o nome de cada teste

```text
$ pnpm exec vitest run --reporter=verbose

 RUN  v4.1.11 C:/Users/leonardo/Desktop/DSC/Mindhub/mindhub-backend

 ✓ test/unit/oferta/perfil-especialista.spec.ts > PerfilEspecialista.cadastrar > nasce ATIVO, com identidade própria e data de criação (D2) 4ms
 ✓ test/unit/oferta/perfil-especialista.spec.ts > PerfilEspecialista.cadastrar > gera identidades diferentes a cada cadastro 1ms
 ✓ test/unit/oferta/perfil-especialista.spec.ts > PerfilEspecialista.cadastrar > apara descrição e especialidades 1ms
 ✓ test/unit/oferta/perfil-especialista.spec.ts > PerfilEspecialista.cadastrar > guarda só a referência do usuário, sem nome nem email (RN-UC02-02) 1ms
 ✓ test/unit/oferta/perfil-especialista.spec.ts > PerfilEspecialista.cadastrar > não permite trocar situação nem dono por atribuição 1ms
 ✓ test/unit/oferta/perfil-especialista.spec.ts > PerfilEspecialista.cadastrar > devolve cópias: alterar o retorno não altera o perfil 0ms
 ✓ test/unit/oferta/perfil-especialista.spec.ts > PerfilEspecialista.cadastrar > recusa descrição vazia 0ms
 ✓ test/unit/oferta/perfil-especialista.spec.ts > PerfilEspecialista.cadastrar > recusa descrição só espaços 0ms
 ✓ test/unit/oferta/perfil-especialista.spec.ts > PerfilEspecialista.cadastrar > recusa descrição com 2001 caracteres 0ms
 ✓ test/unit/oferta/perfil-especialista.spec.ts > PerfilEspecialista.cadastrar > aceita descrição com exatamente 2000 caracteres 2ms
 ✓ test/unit/oferta/perfil-especialista.spec.ts > PerfilEspecialista.cadastrar > recusa especialidades: nenhuma 1ms
 ✓ test/unit/oferta/perfil-especialista.spec.ts > PerfilEspecialista.cadastrar > recusa especialidades: 21 itens 0ms
 ✓ test/unit/oferta/perfil-especialista.spec.ts > PerfilEspecialista.cadastrar > recusa especialidades: item vazio 0ms
 ✓ test/unit/oferta/perfil-especialista.spec.ts > PerfilEspecialista.cadastrar > recusa especialidades: item com 121 caracteres 0ms
 ✓ test/unit/oferta/perfil-especialista.spec.ts > PerfilEspecialista.cadastrar > recusa especialidades: repetidas, sem diferenciar maiúsculas (D3) 0ms
 ✓ test/unit/oferta/perfil-especialista.spec.ts > PerfilEspecialista.cadastrar > aceita 20 especialidades distintas 1ms
 ✓ test/unit/oferta/perfil-especialista.spec.ts > PerfilEspecialista.reconstituir > restaura identidade e situação sem repetir o cadastro 0ms
 ✓ test/unit/oferta/perfil-especialista.spec.ts > PerfilEspecialista.reconstituir > recusa situação desconhecida 0ms
 ✓ test/unit/oferta/perfil-especialista.spec.ts > PerfilEspecialista.reconstituir > recusa dados que violam as invariantes 0ms
 ✓ test/unit/oferta/servico.spec.ts > Servico.publicar > nasce publicado, com identidade própria, referência ao perfil e Modelo de Contratação 3ms
 ✓ test/unit/oferta/contrato-em-memoria.spec.ts > Contrato PerfisEspecialistaRepositorio — em memória > adiciona e recupera o mesmo perfil pelo usuário 6ms
 ✓ test/unit/oferta/contrato-em-memoria.spec.ts > Contrato PerfisEspecialistaRepositorio — em memória > devolve null para usuário sem perfil 1ms
 ✓ test/unit/oferta/contrato-em-memoria.spec.ts > Contrato PerfisEspecialistaRepositorio — em memória > recusa um segundo perfil do mesmo usuário e mantém o primeiro 2ms
 ✓ test/unit/oferta/contrato-em-memoria.spec.ts > Contrato PerfisEspecialistaRepositorio — em memória > recusa novo perfil quando o existente está SUSPENSO (não contorna RN01) 1ms
 ✓ test/unit/oferta/contrato-em-memoria.spec.ts > Contrato PerfisEspecialistaRepositorio — em memória > com duas inclusões simultâneas, exatamente uma vence 2ms
 ✓ test/unit/oferta/cadastrar-perfil-especialista.spec.ts > CadastrarPerfilEspecialista (aplicação, com dublês) > cadastra o perfil ATIVO de um usuário reconhecido e o registra 8ms
 ✓ test/unit/oferta/cadastrar-perfil-especialista.spec.ts > CadastrarPerfilEspecialista (aplicação, com dublês) > usuário não reconhecido: sinaliza e não aciona o repositório 1ms
 ✓ test/unit/oferta/cadastrar-perfil-especialista.spec.ts > CadastrarPerfilEspecialista (aplicação, com dublês) > perfil já existente: repassa PerfilJaExistente sem segundo registro 1ms
 ✓ test/unit/oferta/cadastrar-perfil-especialista.spec.ts > CadastrarPerfilEspecialista (aplicação, com dublês) > invariante violada: PerfilInvalido e repositório não acionado 0ms
 ✓ test/unit/oferta/cadastrar-perfil-especialista.spec.ts > CadastrarPerfilEspecialista (aplicação, com dublês) > falha técnica de C1 não vira "usuário não reconhecido" 0ms
 ✓ test/unit/compartilhado/erros-de-banco.spec.ts > classificação de erros do banco > reconhece violação da restrição única pelo código 23505 e pelo nome 3ms
 ✓ test/unit/compartilhado/erros-de-banco.spec.ts > classificação de erros do banco > trata ECONNREFUSED como falha de conexão 1ms
 ✓ test/unit/compartilhado/erros-de-banco.spec.ts > classificação de erros do banco > trata servidor desligando (57P01) como falha de conexão 0ms
 ✓ test/unit/compartilhado/erros-de-banco.spec.ts > classificação de erros do banco > trata classe 08 (08006) como falha de conexão 0ms
 ✓ test/unit/compartilhado/erros-de-banco.spec.ts > classificação de erros do banco > erro de SQL não é falha de conexão e segue igual (vira 500) 0ms
 ✓ test/unit/compartilhado/erros-de-banco.spec.ts > classificação de erros do banco > reconhece a mensagem de conexão encerrada sem código 0ms
 ✓ test/unit/oferta/perfil-especialista.mapper.spec.ts > PerfilEspecialistaMapper > paraOrm copia todos os campos persistidos 4ms
 ✓ test/unit/oferta/perfil-especialista.mapper.spec.ts > PerfilEspecialistaMapper > paraDominio preserva identidade e situação (não volta a ATIVO) 2ms
 ✓ test/unit/oferta/perfil-especialista.mapper.spec.ts > PerfilEspecialistaMapper > ida e volta mantém o perfil igual 1ms
 ✓ test/unit/oferta/perfil-especialista.mapper.spec.ts > PerfilEspecialistaMapper > registro inválido (situação desconhecida) vira RegistroDePerfilCorrompido, não erro do cliente 1ms
 ✓ test/unit/oferta/perfil-especialista.mapper.spec.ts > PerfilEspecialistaMapper > registro inválido (sem especialidades) vira RegistroDePerfilCorrompido, não erro do cliente 0ms
 ✓ test/unit/oferta/perfil-especialista.mapper.spec.ts > PerfilEspecialistaMapper > registro inválido (descrição vazia) vira RegistroDePerfilCorrompido, não erro do cliente 0ms

 Test Files  6 passed (6)
      Tests  42 passed (42)
   Start at  13:58:41
   Duration  1.06s (transform 380ms, setup 0ms, import 863ms, tests 67ms, environment 1ms)
```

### Lint e build

```text
$ pnpm lint
$ oxlint --type-aware src/ test/
lint exit=0

$ pnpm build
$ nest build
build exit=0
```

## 2. Matriz comparativa: linha de base × pós-refatoração

A linha de base é a execução da Fase 2 (`06-01`, 13:54:07: `6 passed (6)`, `42 passed (42)`). Com todos os 6 arquivos e os 42 testes aprovados, cada arquivo estava aprovado na linha de base.

| Teste / arquivo de teste | Comportamento verificado | Linha de base (Fase 2) | Pós-refatoração (Fase 5) | Situação |
| --- | --- | --- | --- | --- |
| `test/unit/oferta/servico.spec.ts` (1 teste) | Critério 1 da #36: Serviço nasce `PUBLICADO`, com UUID próprio, referência ao perfil, título e Modelo de Contratação | Aprovado (1/1) | Aprovado (1/1) | Preservado |
| `test/unit/oferta/perfil-especialista.spec.ts` (19 testes) | UC02: `cadastrar` e `reconstituir` do Perfil, invariantes de descrição e especialidades | Aprovado | Aprovado (19/19) | Preservado |
| `test/unit/oferta/contrato-em-memoria.spec.ts` (5 testes) | Contrato do repositório de perfis em memória, unicidade por usuário (RN01) | Aprovado | Aprovado (5/5) | Preservado |
| `test/unit/oferta/cadastrar-perfil-especialista.spec.ts` (5 testes) | Caso de uso de aplicação `CadastrarPerfilEspecialista` com dublês | Aprovado | Aprovado (5/5) | Preservado |
| `test/unit/compartilhado/erros-de-banco.spec.ts` (6 testes) | Classificação de erros do PostgreSQL | Aprovado | Aprovado (6/6) | Preservado |
| `test/unit/oferta/perfil-especialista.mapper.spec.ts` (6 testes) | Mapeamento domínio ↔ ORM do Perfil | Aprovado | Aprovado (6/6) | Preservado |
| **Total** | | **42/42** | **42/42** | **Nenhuma regressão** |

| Verificação de qualidade | Linha de base (Material 05) | Pós-refatoração |
| --- | --- | --- |
| `pnpm lint` | exit 0 | exit 0 |
| `pnpm build` | exit 0 | exit 0 |

## 3. Verificação dos contratos arquiteturais

| Contrato | Verificação | Resultado |
| --- | --- | --- |
| Assinatura de `Servico.publicar` | Fora do diff (`06-03`, seção 5) | Íntegra |
| Tipos `ModeloContratacao` e `SituacaoServico` | Fora do diff | Íntegros |
| Getters do `Servico` | Fora do diff; exercitados pelas 5 asserções do `servico.spec.ts` | Íntegros |
| Export removido (`NaoImplementado`) | `grep -rn "NaoImplementado" src test` sem ocorrências; `pnpm build` compila sem erro de import | Sem consumidores afetados |
| Consumidores de `servico.ts` | `grep -rln "dominio/servico" src test` → só `test/unit/oferta/servico.spec.ts` | Nenhum outro módulo depende do arquivo |
| Camadas | `servico.ts` continua importando só `node:crypto` | Domínio puro preservado |
| Injeção de dependências e DTOs | `Servico` ainda não está ligado a módulo Nest, controller ou DTO | Não aplicável |

## 4. Limites das verificações

- **O que foi comprovado:** a suíte unitária (`vitest.config.ts`, `include: ['test/unit/**/*.spec.ts']`) passa inteira, e o código compila e passa no lint. Para o escopo testado, a remoção de `NaoImplementado` não mudou nenhum comportamento.
- **O que não foi executado:** os testes de integração e E2E (`pnpm test:e2e`, `test/integracao/` e `test/e2e/`), que exigem PostgreSQL. Como nenhum arquivo fora do `servico.spec.ts` importa `servico.ts`, essas suítes não exercitam o código alterado. Mesmo assim, este documento não afirma nada sobre elas.
- **O que os testes não cobrem:** o `Servico` só tem teste do critério 1. Os critérios 2 a 6 da #36 (Modelo de Contratação inválido, condições vigentes da Reserva Direta, dados inválidos, reconstituição) não têm teste, e o código não os implementa. Os testes verdes **não** indicam que essas regras funcionam.
- Testes unitários isolados não garantem que o fluxo completo de publicação (API → aplicação → persistência) esteja implementado. Esse fluxo depende das Sub-Issues #37 e #40.

## 5. Parecer

**Nenhuma regressão no escopo testado.** Os 42 testes unitários, o lint e o build têm o mesmo resultado antes e depois da refatoração, e nenhum contrato público em uso foi alterado. A alteração está pronta para ser versionada (Fase 6).
