# Mindhub Backend

API básica da **Plataforma de Mentorias e Consultorias**, baseada no modelo
conceitual de [trabalho3.md](../trabalho3.md). O ambiente segue o PDF de primeiros
passos: Node.js 24, NestJS 12, pnpm 12, ESM e Vitest.

## Executar

Na pasta `Mindhub`:

```powershell
cd mindhub-backend
pnpm.cmd install --frozen-lockfile
pnpm.cmd run start:dev
```

O servidor utiliza a porta 3000. `GET /` identifica a plataforma e
`GET /health` retorna `{"status":"ok","aplicacao":"Mindhub"}`.
Use `Ctrl+C` para encerrar. Para outra porta no PowerShell:

```powershell
$env:PORT = '3001'
pnpm.cmd run start:dev
```

Os exemplos usam `.cmd` para funcionar mesmo quando o PowerShell bloqueia
os scripts `.ps1` das ferramentas. No Linux/macOS, utilize `pnpm`.

## Recorte inicial do domínio

| Conceito do trabalho | Implementação inicial |
| --- | --- |
| Usuário | Identidade única, nome, contato e situação |
| Perfil de Especialista | Vinculado a um usuário, descrição, especialidades e situação |
| Serviço | Oferta de mentoria ou consultoria vinculada a um especialista |
| Modelo de Contratação | `RESERVA_DIRETA` ou `SOB_PROPOSTA` |
| Dinheiro | `valorCentavos` inteiro e `moeda` com três letras maiúsculas |
| Condições Comerciais | Preço, quantidade de sessões e duração para Reserva Direta |
| Solicitação | Necessidade de um cliente direcionada a um especialista, com objetivo e escopo |

Os módulos ficam em `src/usuarios`, `src/especialistas`, `src/servicos` e
`src/solicitacoes`. Controllers recebem HTTP; services aplicam regras e
armazenam os registros; arquivos `*.dto.ts` definem os dados e sua validação.
A validação usa Zod com o
[StandardSchemaValidationPipe nativo do NestJS 12](https://docs.nestjs.com/application/validation#schema-based-validation).

## Rotas

Base: `http://localhost:3000`. Envie JSON com `Content-Type: application/json`.
Os IDs retornados são UUIDs e devem ser reutilizados nas operações seguintes.

| Método | Rota | Finalidade |
| --- | --- | --- |
| GET | `/` | Identificação e recursos da plataforma |
| GET | `/health` | Estado do servidor |
| POST | `/api/usuarios` | Cadastrar usuário |
| GET | `/api/usuarios` | Listar usuários |
| GET | `/api/usuarios/:id` | Consultar usuário |
| POST | `/api/especialistas` | Criar perfil profissional para um usuário |
| GET | `/api/especialistas` | Listar perfis |
| GET | `/api/especialistas/:id` | Consultar perfil |
| PATCH | `/api/especialistas/:id/situacao` | Definir `ATIVO` ou `SUSPENSO` |
| POST | `/api/servicos` | Publicar serviço |
| GET | `/api/servicos` | Listar catálogo; filtros `especialistaId` e `modeloContratacao` |
| GET | `/api/servicos/:id` | Consultar serviço |
| POST | `/api/solicitacoes` | Registrar necessidade direcionada |
| GET | `/api/solicitacoes` | Listar solicitações; filtros `clienteId` e `especialistaId` |
| GET | `/api/solicitacoes/:id` | Consultar solicitação |

Criações retornam HTTP 201; consultas e alteração de situação retornam 200.
Dados inválidos ou campos desconhecidos retornam 400; referências inexistentes,
404; duplicidade ou conflito com uma regra de domínio, 409.

## Exemplos de dados

Cadastrar usuário:

```json
{ "nome": "Ana", "email": "ana@example.com" }
```

Criar perfil de especialista usando o ID retornado pelo cadastro:

```json
{
  "usuarioId": "UUID_DO_USUARIO",
  "descricao": "Mentoria em desenvolvimento backend",
  "especialidades": ["NestJS", "TypeScript"]
}
```

Publicar um serviço de Reserva Direta:

```json
{
  "especialistaId": "UUID_DO_PERFIL",
  "titulo": "Mentoria inicial de NestJS",
  "descricao": "Orientação para começar um backend",
  "tipo": "MENTORIA",
  "modeloContratacao": "RESERVA_DIRETA",
  "condicoesComerciais": {
    "preco": { "valorCentavos": 15000, "moeda": "BRL" },
    "quantidadeSessoes": 1,
    "duracaoMinutos": 60
  }
}
```

Para Sob Proposta, envie `modeloContratacao: "SOB_PROPOSTA"` e omita
`condicoesComerciais`: as condições dependem da negociação posterior.
`tipo` aceita `MENTORIA` ou `CONSULTORIA`.

Criar uma solicitação:

```json
{
  "clienteId": "UUID_DO_USUARIO_CLIENTE",
  "especialistaId": "UUID_DO_PERFIL",
  "servicoId": "UUID_DO_SERVICO_SOB_PROPOSTA",
  "objetivo": "Estruturar o backend da Mindhub",
  "escopo": "Cadastro de usuários e catálogo de mentorias"
}
```

`servicoId` é opcional: o cliente também pode enviar sua necessidade diretamente
ao especialista. Se informado, o serviço deve pertencer ao especialista
escolhido e ser do modelo Sob Proposta.

## Demonstrar o fluxo completo

Com o servidor em execução, abra outro terminal em `mindhub-backend`:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\demo.ps1
```

O script cria dados fictícios: dois usuários, um perfil, um serviço de cada
modelo e uma solicitação. Em seguida consulta os dados e imprime os IDs.
Cada execução usa emails diferentes. Para outra porta, acrescente
`-BaseUrl http://localhost:3001`.

## Regras rastreáveis ao trabalho

- **Seções 1.2 e 5.1:** cliente e especialista são papéis de um mesmo usuário.
  Criar um perfil não duplica sua identidade.
- **Seção 8:** um usuário possui no máximo um perfil de especialista, e o
  especialista pode oferecer vários serviços.
- **RN01:** um perfil suspenso não pode publicar serviços nem receber novas
  solicitações. A API preserva os registros anteriores à suspensão.
- **RN13:** o catálogo distingue Reserva Direta e Sob Proposta. Uma solicitação
  vinculada a serviço utiliza o caminho Sob Proposta.
- **Seções 5.2 e 7:** objetivo, escopo, dinheiro e condições comerciais têm
  dados próprios, e referências a usuários e perfis são verificadas.

## Decisões desta implementação básica

Os dados ficam **em memória** e são perdidos quando o processo reinicia,
inclusive quando o modo de desenvolvimento recarrega o servidor.
Usuários e perfis novos começam ativos para permitir a demonstração local.
Email único, UUIDs, limites de tamanho e valores monetários em centavos são
escolhas técnicas desta etapa.

Esta versão é uma API de estudo sem autenticação ou autorização. Os IDs
informados no corpo não comprovam a identidade de quem envia a requisição,
e a rota de situação ainda não possui controle administrativo.

Propostas e suas versões, contratações, reservas, pagamentos, sessões,
avaliações, organizações, vínculos, participação e disputas ficam para as
próximas etapas. Publicar um serviço de Reserva Direta cadastra sua oferta;
a contratação e a reserva ainda precisam ser implementadas. RN02–RN12,
RN14 e RN15 dependem desses próximos módulos. Parcelamento, políticas de
cancelamento e solicitações abertas continuam como questões do trabalho.

## Verificar

```powershell
pnpm.cmd install --frozen-lockfile
pnpm.cmd run build
pnpm.cmd run test
pnpm.cmd run test:e2e
pnpm.cmd run lint
pnpm.cmd peers check
```

A suíte possui um teste unitário e 14 testes de integração HTTP que verificam
os fluxos, validação, cardinalidade do perfil, RN01, filtros e referências.
Os testes iniciam uma aplicação isolada, com armazenamento vazio, por caso.

Para executar o código compilado:

```powershell
pnpm.cmd run build
pnpm.cmd run start:prod
```

