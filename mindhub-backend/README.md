# Mindhub — backend básico

Um único caso de uso: **cadastrar um usuário** da plataforma.
O usuário fornece nome e email; o servidor valida os dados, impede email
duplicado e armazena o cadastro em memória.

## Executar

Na pasta `mindhub-backend`:

```powershell
pnpm.cmd install --frozen-lockfile
pnpm.cmd run start:dev
```

## Única rota: POST /usuarios

Envie JSON para `http://localhost:3000/usuarios`:

```json
{ "nome": "Ana", "email": "ana@example.com" }
```

Exemplo no PowerShell:

```powershell
Invoke-RestMethod -Method Post -Uri http://localhost:3000/usuarios -ContentType 'application/json' -Body '{"nome":"Ana","email":"ana@example.com"}'
```

A resposta contém `id`, `nome` e `email`:

```json
{ "id": "UUID_GERADO", "nome": "Ana", "email": "ana@example.com" }
```

- **201:** cadastro realizado.
- **400:** nome vazio, email inválido ou campo não aceito.
- **409:** email já cadastrado.

O nome é aparado e o email é aparado e convertido para minúsculas.
Cadastros ficam em um array e são perdidos quando o processo reinicia,
inclusive ao recarregar o servidor no modo de desenvolvimento.
Esta etapa não inclui autenticação.

## Estrutura mínima

| Arquivo | Responsabilidade |
| --- | --- |
| `src/main.ts` | Iniciar o servidor |
| `src/app.module.ts` | Registrar controller, service e validação |
| `src/criar-usuario.dto.ts` | Definir os dados aceitos e sua validação |
| `src/usuarios.controller.ts` | Receber o POST e chamar o service |
| `src/usuarios.service.ts` | Impedir duplicidade e guardar o usuário |

O fluxo é: requisição → validação → controller → service → resposta.
O projeto mantém NestJS 12, ESM e Vitest. Zod valida nome e email pelo pipe
nativo do NestJS. Os cinco testes HTTP ficam em `test/usuarios.spec.ts`.

## Verificar

```powershell
pnpm.cmd run build
pnpm.cmd run test
pnpm.cmd run lint
```

Para executar o código compilado, após o build:

```powershell
pnpm.cmd run start:prod
```
