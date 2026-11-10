# Mindhub — backend

Backend NestJS 12 da Mindhub. Hoje ele tem duas rotas:

- `GET /`: o **Hello World** do template do NestJS. Serve só para comprovar que
  a aplicação está no ar; não é comportamento do sistema.
- `POST /usuarios`: o caso de uso **UC01 — Cadastrar Usuário**, com dados em memória.

O primeiro slice de negócio (UC02 — Cadastrar Perfil de Especialista) ainda
**não está implementado**. Veja a [issue #1](https://github.com/MindHub-DSC/Mindhub/issues/1).

## Requisitos

| Ferramenta | Versão |
| --- | --- |
| Node.js | 24 (veja `.node-version`) |
| pnpm | 12 (fixado em `packageManager` no `package.json`) |
| Nest CLI | 12 (já vem como dependência de desenvolvimento; a instalação global é opcional) |

Use só o **pnpm** neste projeto: o `pnpm-lock.yaml` é o registro das versões instaladas.

## Instalar e executar

Na pasta `mindhub-backend`:

```powershell
pnpm.cmd install --frozen-lockfile
pnpm.cmd run start:dev
```

A aplicação está pronta quando o log mostra
`Nest application successfully started`. Ela usa a porta 3000, ou a variável
`PORT` (veja [.env.example](.env.example)). Para encerrar, pressione `Ctrl+C`.

## Verificar se está no ar: GET /

Com o servidor rodando, use um destes três clientes. O resultado esperado é
`200 OK` com o corpo `Hello World!`.

- **Navegador:** abra <http://localhost:3000/>.
- **REST Client (VS Code):** abra [requests.http](requests.http) e clique em *Send Request*.
- **cURL:** em outro terminal:

```powershell
curl.exe -i http://localhost:3000/
```

No Windows PowerShell 5.1, use `curl.exe`: o comando `curl` sozinho é um apelido
de `Invoke-WebRequest`, que mostra a resposta em outro formato.

## UC01: POST /usuarios

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

## Estrutura

| Arquivo | Responsabilidade |
| --- | --- |
| `src/main.ts` | Criar a aplicação a partir do `AppModule` e escutar a porta |
| `src/app.module.ts` | Registrar controllers, providers e o pipe de validação |
| `src/app.controller.ts` | Template: recebe `GET /` e chama o `AppService` |
| `src/app.service.ts` | Template: devolve `Hello World!` |
| `src/criar-usuario.dto.ts` | UC01: dados aceitos e validação (zod) |
| `src/usuarios.controller.ts` | UC01: recebe `POST /usuarios` e chama o service |
| `src/usuarios.service.ts` | UC01: impede email duplicado e guarda o usuário |
| `test/usuarios.spec.ts` | Cinco testes HTTP do UC01 |
| `requests.http` | Requisição `GET /` para o REST Client |

## Verificar build, testes e lint

```powershell
pnpm.cmd run build
pnpm.cmd run test
pnpm.cmd run lint
```

Para executar o código compilado, após o build:

```powershell
pnpm.cmd run start:prod
```
