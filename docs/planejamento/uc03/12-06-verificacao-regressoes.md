# 12-06 — Verificação de regressões

**Caso de uso:** UC03 — Publicar Serviço (épico [#35](https://github.com/MindHub-DSC/Mindhub/issues/35))
**Issue:** [#147](https://github.com/MindHub-DSC/Mindhub/issues/147) · **Código:** `feature/144-uc03-contrato-http` @ `472cdac`
**Data:** 24/11/2026

Como nenhum código foi alterado (`12-05`), a verificação confirma que o estado auditado está íntegro. Os números do Material 11 (112 e 35) são históricos; os abaixo foram obtidos agora.

## 1. Linha de base e suítes

| Script real (`package.json`) | Conteúdo | Banco |
| --- | --- | --- |
| `pnpm build` | `nest build` | — |
| `pnpm lint` | `oxlint --type-aware src/ test/` | — |
| `pnpm test` | `test/unit/**`: domínio, aplicação, contratos em memória, HTTP com serviço simulado, composição, adaptador com falha de conexão | Nenhum |
| `pnpm test:e2e` | `test/integracao/**` (TypeORM) e `test/e2e/**` (HTTP completo) | `mindhub_test` |

Não existe `test:integration` separado: no projeto, `test:e2e` cobre integração e E2E.

## 2. Segurança do PostgreSQL (antes de executar) [CÓD]

O `test:e2e` **não** foi presumido seguro; foi inspecionado:

- `vitest.config.e2e.ts`: `globalSetup` e `setupFiles` apontam para `test/setup/`; o comentário do arquivo e o código impõem o banco de testes.
- `test/setup/banco-de-teste.ts`: exige `DB_TEST_NAME` terminando em `_test` (regex `^[a-z0-9_]+_test$`), recusa o mesmo nome de `DB_NAME`, guarda o banco da aplicação em `DB_NAME_APLICACAO` e só então troca `DB_NAME`.
- `test/setup/global-setup.ts`: cria o banco de testes se não existir e aplica as migrations versionadas.
- `test/support/limpeza.ts`: apenas `DELETE … WHERE` filtrado por ids gerados no teste; sem `TRUNCATE`, sem `DELETE` livre, sem `DROP`.
- Os testes não são suítes legadas do scaffold e não sobem o banco de desenvolvimento.

Confirmação após a execução [EXE]: o banco de desenvolvimento (`mindhub`) continuou com as mesmas 7 linhas em `oferta.servicos` (as criadas manualmente nas verificações dos Materiais 10 e 11).

## 3. Comandos e resultados [EXE]

Sem `node`/`pnpm` no host: contêiner `node:24.19.0-bookworm-slim`, rede `mindhub_default`, `DB_HOST=postgres`, `DB_PORT=5432`, `node_modules` em volume anônimo.

```text
$ pnpm build      → exit 0
$ pnpm lint       → Found 0 warnings and 0 errors (75 arquivos, 111 regras)
$ pnpm test       → Test Files 12 passed (12) · Tests 112 passed (112)
$ pnpm test:e2e   → Test Files  6 passed (6)  · Tests  35 passed (35)
$ git status --short            (limpo; pnpm-lock.yaml intacto)
$ docker compose ps             mindhub-api-1 Up · mindhub-postgres-1 Up (healthy)
$ SELECT current_database(), count(*) FROM oferta.servicos → mindhub | 7
```

## 4. Comparação

| Item | Material 11 (histórico) | Agora | Regressão |
| --- | --- | --- | --- |
| `pnpm test` | 12 arq / 112 | 12 arq / 112 | Nenhuma |
| `pnpm test:e2e` | 6 arq / 35 | 6 arq / 35 | Nenhuma |
| Build / lint | 0 / 0 erros | 0 / 0 erros | Nenhuma |

## 5. Áreas cobertas

| Área | Verificação |
| --- | --- |
| Service | `publicar-servico.spec.ts`, `servico.spec.ts` |
| Controller / DTO de resposta | `servicos.http.spec.ts` (contrato fechado e não exposição) |
| Repository | Contrato nas duas implementações; `servicos.typeorm.spec.ts` no PostgreSQL de testes |
| Providers | `servicos.composicao.spec.ts`, `servicos.integracao.spec.ts` e inicialização do contêiner |
| ORM e migrations | `servicos.typeorm.spec.ts` (CHECKs, FK, registro corrompido); migrations aplicadas pelo `global-setup` |
| Docker Compose | Contêineres `Up`/`healthy`; API respondeu no Material 11 |

## 6. Falhas, regressões e não executados

Nenhuma falha nem regressão. **Não executados:** a API real com perfil suspenso (403) e com PostgreSQL fora do ar (503), por exigirem suspender perfil ou derrubar o banco; ficam cobertos só por serviço simulado. Concorrência (#39) fora do escopo.

## 7. Limitações e conclusão

A aprovação das suítes reduz determinados riscos, mas não demonstra ausência de defeitos. O resultado vale para `472cdac`. **Conclusão:** sem regressões; a decisão de preservar (`12-05`) segue sustentada pelas verificações.
