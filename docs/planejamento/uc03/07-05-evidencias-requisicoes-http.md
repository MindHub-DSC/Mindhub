# 07-05 — Evidências das requisições HTTP

**Caso de uso:** UC03 — Publicar Serviço (épico [#35](https://github.com/MindHub-DSC/Mindhub/issues/35))
**Sub-Issue:** [#40](https://github.com/MindHub-DSC/Mindhub/issues/40)
**Data:** 17/11/2026

## 1. Ambiente

| Item | Valor |
| --- | --- |
| Aplicação | `node dist/main.js` (build da branch `feature/40-uc03-endpoint-publicar-servico`, código ainda não commitado), processo 6040 |
| Endereço | `http://localhost:3000` (sem prefixo global de rota) |
| Banco | PostgreSQL local do `compose.yaml` (`mindhub-postgres-1`, healthy) para usuários e perfis; Serviços em memória (`ServicosEmMemoria`) |
| Ferramentas | `curl` no Git Bash (Windows); `urllib` do Python para a verificação de acentuação |
| Endpoint | `POST /servicos` |

## 2. Preparação: usuário (UC01) e perfil ATIVO (UC02)

```text
$ curl -s -X POST http://localhost:3000/usuarios -d '{"nome":"Ana Mentora","email":"servico-1794937254@exemplo.test"}'
{"id":"3163a113-104e-43a1-bb2b-1c06611abc06","nome":"Ana Mentora","email":"servico-1794937254@exemplo.test"}

$ curl -s -X POST http://localhost:3000/especialistas -d '{"usuarioId":"3163a113-104e-43a1-bb2b-1c06611abc06",...}'
{"id":"ece5a9cc-d4e4-40e9-98f9-518aaf546244","usuarioId":"3163a113-104e-43a1-bb2b-1c06611abc06","descricao":"Consultora de produto","especialidades":["Discovery"],"situacao":"ATIVO","criadoEm":"2026-11-17T17:40:54.935Z"}
```

## 3. Cenário 1 — dados válidos

### 1a. Reserva Direta com condições

```text
$ curl -s -i -X POST http://localhost:3000/servicos -H 'Content-Type: application/json' -d '{"usuarioId":"3163a113-104e-43a1-bb2b-1c06611abc06","titulo":"Mentoria de produto","descricao":"Sessões de discovery","modeloContratacao":"RESERVA_DIRETA","condicoes":{"preco":15000,"moeda":"BRL","duracaoMinutos":60,"modalidade":"ONLINE"}}'
HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8
{"id":"2bec4ad6-0cf8-4b5e-a32a-4e0fe066a2fa","perfilId":"ece5a9cc-d4e4-40e9-98f9-518aaf546244","titulo":"Mentoria de produto","descricao":"Sess�es de discovery","modeloContratacao":"RESERVA_DIRETA","condicoes":{"preco":15000,"moeda":"BRL","duracaoMinutos":60,"modalidade":"ONLINE"},"situacao":"PUBLICADO"}
```

### 1b. Sob Proposta sem condições

```text
$ curl -s -i -X POST http://localhost:3000/servicos -H 'Content-Type: application/json' -d '{"usuarioId":"3163a113-104e-43a1-bb2b-1c06611abc06","titulo":"Consultoria","descricao":"Escopo combinado na proposta","modeloContratacao":"SOB_PROPOSTA"}'
HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8
{"id":"7aa78fd5-9af2-4c63-8d1e-11744d73b6b7","perfilId":"ece5a9cc-d4e4-40e9-98f9-518aaf546244","titulo":"Consultoria","descricao":"Escopo combinado na proposta","modeloContratacao":"SOB_PROPOSTA","condicoes":null,"situacao":"PUBLICADO"}
```

### Observação sobre o `�` em "Sess�es"

O `curl` do Git Bash enviou o corpo na codificação do terminal do Windows, não em UTF-8. Repetindo com o corpo codificado em UTF-8 (Python), a acentuação volta correta, então o servidor não tem problema:

```text
$ python  (urllib, corpo json.dumps(...).encode("utf-8"), Content-Type: application/json; charset=utf-8)
HTTP 201
{"id":"0c60e147-48dd-49ff-8e87-0ee41e88e361","perfilId":"ece5a9cc-d4e4-40e9-98f9-518aaf546244","titulo":"Sessões","descricao":"Sessões de discovery","modeloContratacao":"SOB_PROPOSTA","condicoes":null,"situacao":"PUBLICADO"}
```

## 4. Cenário 2 — dados inválidos (fronteira HTTP)

### 2a. Campo não previsto (FE-01)

```text
$ curl -s -i -X POST http://localhost:3000/servicos -H 'Content-Type: application/json' -d '{"usuarioId":"3163a113-104e-43a1-bb2b-1c06611abc06","titulo":"Mentoria","descricao":"Discovery","modeloContratacao":"SOB_PROPOSTA","situacao":"PUBLICADO"}'
HTTP/1.1 400 Bad Request
Content-Type: application/json; charset=utf-8
{"message":["Unrecognized key: \"situacao\""],"error":"Bad Request","statusCode":400}
```

### 2b. Tipos e valores fora do formato

```text
$ curl -s -i -X POST http://localhost:3000/servicos -H 'Content-Type: application/json' -d '{"usuarioId":"nao-e-uuid","titulo":123,"descricao":"Discovery","modeloContratacao":"LEILAO"}'
HTTP/1.1 400 Bad Request
Content-Type: application/json; charset=utf-8
{"message":["usuarioId: Invalid UUID","titulo: Invalid input: expected string, received number","modeloContratacao: Invalid option: expected one of \"RESERVA_DIRETA\"|\"SOB_PROPOSTA\""],"error":"Bad Request","statusCode":400}
```

Relação com o DTO: `Unrecognized key` vem do `z.strictObject`; `Invalid UUID` do `z.uuid()`; `expected string` do `z.string()`; `Invalid option` do `z.enum([...])`. A resposta tem o formato do pipe do Nest (`message` em lista, `error: "Bad Request"`), diferente das respostas dos filtros de domínio (`message` em texto).

## 5. Cenários extras — recusas do domínio e da aplicação (D-UC03-07)

```text
## Título só espaços (passa no DTO, recusado pelo domínio: D-UC03-01)
HTTP/1.1 400 Bad Request
{"statusCode":400,"message":"O título: informe ao menos 1 caractere."}

## Reserva Direta sem condições (passa no DTO: condicoes é opcional; recusada pelo domínio)
HTTP/1.1 422 Unprocessable Entity
{"statusCode":422,"message":"Reserva Direta exige condições vigentes: preço, moeda, duração e modalidade."}

## Ator sem perfil (usuarioId UUID aleatório)
HTTP/1.1 404 Not Found
{"statusCode":404,"message":"O usuário não possui perfil de especialista."}
```

*(Comandos completos: mesma forma do Cenário 1, com os corpos `{"titulo":"   ",...}`, `{"modeloContratacao":"RESERVA_DIRETA"}` sem `condicoes`, e `{"usuarioId":"0e660179-1c28-4d04-a04a-79e82ab4f4b8",...}`.)*

## 6. Esperado × observado

| Cenário | Esperado | Observado | OK? |
| --- | --- | --- | --- |
| 1a Reserva Direta válida | 201, id, perfilId, modelo, condições, `PUBLICADO` | 201 com todos os campos | Sim |
| 1b Sob Proposta válida | 201, `condicoes: null` | 201, `condicoes: null` | Sim |
| 2a Campo extra | 400 na fronteira | 400 `Unrecognized key: "situacao"` | Sim |
| 2b Tipos/valores | 400 na fronteira | 400 com 3 mensagens | Sim |
| Título só espaços | 400 (domínio) | 400 | Sim |
| Reserva Direta sem condições | 422 | 422 | Sim |
| Ator sem perfil | 404 | 404 | Sim |
| Perfil suspenso | 403 | **Não executado**: não existe operação de suspender perfil (UC18). Coberto no teste HTTP com serviço simulado (Fase 9) e no teste unitário da #38 | — |
| Falha de armazenamento | 503 | **Não executado** manualmente (exigiria derrubar o banco). Coberto no teste HTTP (Fase 9) | — |

## 7. Limites desta verificação

- O 400 da fronteira comprova o funcionamento da **validação HTTP** (schema + pipe). Não substitui os testes das regras de negócio, que estão em `servico.spec.ts` e `publicar-servico.spec.ts`.
- A requisição manual não prova que o serviço **não foi chamado** nos casos 2a/2b (não há endpoint para listar Serviços). Isso é verificado no teste automatizado com `expect(...).not.toHaveBeenCalled()` (Fase 9).
- Os Serviços criados aqui estão só em memória e se perdem ao reiniciar. O usuário e o perfil de preparação ficaram no banco de desenvolvimento (não no de teste).
