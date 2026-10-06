# Mindhub

Primeiro backend da Plataforma de Mentorias e Consultorias descrita em
[trabalho3.md](trabalho3.md). A preparação das ferramentas segue
`Primeiros-Passos-com-NestJS-12.pdf`.

A API fica em `mindhub-backend/` e usa NestJS 12, ES Modules (ESM),
pnpm 12 e Vitest. Implementa cadastro e consulta de usuários, perfis de
especialista, serviços e solicitações direcionadas, com dados em memória.

As rotas, exemplos e regras implementadas estão no
[README do backend](mindhub-backend/README.md).

## Ferramentas

| Ferramenta | Versão instalada |
| --- | --- |
| Node.js | 24.19.0 |
| npm | 11.17.0 |
| pnpm | 12.9.1 |
| Nest CLI | 12.0.8 |
| Nest Schematics | 12.0.6 |
| NestJS (`@nestjs/core`) | 12.1.2 |
| Vitest | 4.1.11 |

O Node.js foi atualizado de 24.14.1 para 24.19.0 porque o
`@nestjs/schematics` 12.0.6 exige Node.js 24.15.0 ou superior na linha 24.
Referência: [documentação oficial do Nest CLI](https://docs.nestjs.com/cli/overview).

Para conferir o ambiente no PowerShell:

```powershell
node --version
npm.cmd --version
pnpm.cmd --version
nest.cmd --version
```

Os comandos com extensão `.cmd` também funcionam quando a política do
PowerShell bloqueia os scripts `.ps1` fornecidos pelas ferramentas.

## Executar o backend

Abra um terminal na pasta `Mindhub` e execute:

```powershell
cd mindhub-backend
pnpm.cmd install --frozen-lockfile
pnpm.cmd run start:dev
```

Acesse <http://localhost:3000> para consultar a identificação da plataforma
e <http://localhost:3000/health> para conferir o estado do servidor.
Para encerrar o servidor, pressione `Ctrl+C` no terminal.

## Verificações

Dentro de `mindhub-backend/`:

```powershell
pnpm.cmd run build
pnpm.cmd run test
pnpm.cmd run test:e2e
pnpm.cmd run lint
pnpm.cmd list @nestjs/core
```

Validação realizada: instalação com `--frozen-lockfile`, compilação,
1 teste unitário, 14 testes HTTP de integração e lint concluídos com sucesso.
As dependências também passaram em `pnpm.cmd peers check`.

O projeto foi criado com `pnpm`, ESM e Vitest, sem configurar
`@nestjs/observe`. O repositório Git existente na pasta `Mindhub` é
utilizado também pelo backend.
