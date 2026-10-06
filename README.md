# Mindhub

Backend básico da plataforma de mentorias e consultorias descrita em
[trabalho3.md](trabalho3.md).

O único caso de uso implementado é **cadastrar usuário**:
`POST /usuarios` recebe nome e email e retorna o usuário com um ID.
Os cadastros ficam em memória e são perdidos quando o servidor reinicia.

## Executar

Na pasta Mindhub:

```powershell
cd mindhub-backend
pnpm.cmd install --frozen-lockfile
pnpm.cmd run start:dev
```

O servidor usa a porta 3000. Para encerrá-lo, pressione `Ctrl+C`.

## Cadastrar um usuário

Em outro terminal:

```powershell
Invoke-RestMethod -Method Post -Uri http://localhost:3000/usuarios -ContentType 'application/json' -Body '{"nome":"Ana","email":"ana@example.com"}'
```

Veja a estrutura e os comandos de verificação no
[README do backend](mindhub-backend/README.md).

Ambiente: Node.js 24, NestJS 12, pnpm 12, ESM e Vitest, seguindo
`Primeiros-Passos-com-NestJS-12.pdf`. No Windows, os comandos `.cmd`
funcionam mesmo quando o PowerShell bloqueia os scripts `.ps1` das ferramentas.
