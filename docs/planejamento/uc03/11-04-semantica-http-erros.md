# 11-04 — Semântica HTTP e erros

**Caso de uso:** UC03 — Publicar Serviço (épico [#35](https://github.com/MindHub-DSC/Mindhub/issues/35))
**Issue:** [#144](https://github.com/MindHub-DSC/Mindhub/issues/144) · **PR:** [#145](https://github.com/MindHub-DSC/Mindhub/pull/145) (Draft)
**Data:** 24/11/2026

Matriz executada contra a **API containerizada** (porta 3000). Os casos 10 e 11 só foram verificados com serviço simulado: provocá-los na API real exigiria suspender um perfil ou derrubar o PostgreSQL, fora do escopo.

| # | Entrada | Esperado | Observado | Status | Estrutura JSON | Divergência |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Reserva Direta válida | 201 + Serviço | 7 campos + `condicoes` com 4 | 201 | `{id, perfilId, titulo, descricao, modeloContratacao, condicoes, situacao}` | — |
| 2 | Sob Proposta válida | 201, `condicoes: null` | `"condicoes":null` | 201 | idem | — |
| 3 | Corpo `{}` | 400 | 4 mensagens (`usuarioId`, `titulo`, `descricao`, `modeloContratacao`) | 400 | `{message: string[], error, statusCode}` | — |
| 4 | Campo extra `x` | 400 (schema estrito) | `Unrecognized key: "x"` | 400 | idem | Rejeita, não descarta |
| 5 | `titulo: 5` (tipo errado) | 400 | `titulo: Invalid input: expected string, received number` | 400 | idem | — |
| 6 | JSON malformado | 400 | `Expected property name or '}' in JSON…` | 400 | `{message: string, error, statusCode}` | `message` é string, não lista |
| 7 | `titulo: ""` (regra do domínio) | 400 | `O título: informe ao menos 1 caractere.` | 400 | `{statusCode, message}` | Sem campo `error` |
| 8 | Reserva Direta sem `condicoes` | 422 | `Reserva Direta exige condições vigentes: …` | 422 | `{statusCode, message}` | Sem campo `error` |
| 9 | `usuarioId` sem perfil | 404 | `O usuário não possui perfil de especialista.` | 404 | `{statusCode, message}` | Sem campo `error` |
| 10 | Perfil suspenso | 403 | teste com serviço simulado | 403 | `{statusCode, message}` | Não provocado na API real |
| 11 | Armazenamento indisponível | 503, mensagem genérica | teste com serviço simulado | 503 | `{statusCode, message}` | Não provocado na API real |
| 12 | `GET /servicos` | 404 (rota inexistente) | `Cannot GET /servicos` | 404 | `{message, error, statusCode}` | Fora do escopo (não há GET) |

## Análise das respostas de erro

- **Dois formatos de erro coexistem:** os do pipe e do Nest (`{message, error, statusCode}`, com `message` em lista ou texto) e os de domínio e aplicação (`{statusCode, message}`, sem `error`). Um cliente deve ler `statusCode` e `message`; `error` não é garantido. **Não foi alterado** (D-UC03-07 e regra de não criar contrato novo). Fica como ponto de atenção para a documentação do UC03 (#41).
- Nenhum detalhe interno foi exposto: o 503 usa mensagem genérica (`Serviço temporariamente indisponível. Tente novamente.`) e não há stack trace nas respostas observadas.
- Não existe `ValidationPipe` com `whitelist`: o projeto usa `StandardSchemaValidationPipe` com `z.strictObject`. Configuração preservada.
- Nenhum código de erro novo foi criado.

## Correções justificadas

Nenhuma nesta matriz. A única correção da atividade foi a cópia de `condicoes` (`11-03`).
