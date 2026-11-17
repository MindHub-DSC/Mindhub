# 09-06 — Evidências da persistência real e durabilidade

**Caso de uso:** UC03 — Publicar Serviço (épico [#35](https://github.com/MindHub-DSC/Mindhub/issues/35))
**Sub-Issue:** [#37](https://github.com/MindHub-DSC/Mindhub/issues/37)
**Data:** 17/11/2026

## 1. Ambiente

| Item | Valor |
| --- | --- |
| Backend | `node dist/main.js`, build da branch `feature/37-uc03-persistir-servico` @ `be24806` (mesmo código de `src/` do commit final `e66b59e`, que só mudou testes) |
| Banco | PostgreSQL de **desenvolvimento** `mindhub` (`localhost:5433` → contêiner `mindhub-postgres-1`) |
| Cliente HTTP | Python `urllib`, corpo em UTF-8 (o `curl` do Git Bash troca acentos, ver `07-05`) |
| Cliente SQL | `docker compose exec postgres psql` (usuário do contêiner, sem senha na linha de comando) |
| Perfil usado | Perfil `ATIVO` `ece5a9cc-…` do usuário `3163a113-…`, criado no Material 07 e ainda no banco |

## 2. Cadastro via HTTP

```text
$ date: 17/11/2026 15:58:31 -0300
$ POST http://localhost:3000/servicos  (Python urllib, Content-Type: application/json; charset=utf-8)
  corpo: {"usuarioId": "3163a113-104e-43a1-bb2b-1c06611abc06", "titulo": "Mentoria de produto (persistida)", "descricao": "Sessões de discovery para times iniciantes", "modeloContratacao": "RESERVA_DIRETA", "condicoes": {"preco": 15000, "moeda": "BRL", "duracaoMinutos": 60, "modalidade": "ONLINE"}}
  HTTP 201 Created
  {"id":"49e6042b-2c6e-46f8-9cd5-2234860ce5c3","perfilId":"ece5a9cc-d4e4-40e9-98f9-518aaf546244","titulo":"Mentoria de produto (persistida)","descricao":"Sessões de discovery para times iniciantes","modeloContratacao":"RESERVA_DIRETA","condicoes":{"preco":15000,"moeda":"BRL","duracaoMinutos":60,"modalidade":"ONLINE"},"situacao":"PUBLICADO"}
```

Identificador gerado: **`49e6042b-2c6e-46f8-9cd5-2234860ce5c3`**.

## 3. Consulta direta no PostgreSQL (antes do reinício)

Sem endpoint `GET` (fora do escopo): consulta SQL pela chave retornada.

```text
$ SELECT id, perfil_id, titulo, descricao, modelo_contratacao, situacao, preco, moeda, duracao_minutos, modalidade, publicado_em, ordem
    FROM oferta.servicos WHERE id = '49e6042b-2c6e-46f8-9cd5-2234860ce5c3'      (banco mindhub)
                  id                  |              perfil_id               |              titulo              |                 descricao                  | modelo_contratacao | situacao  | preco | moeda | duracao_minutos | modalidade |        publicado_em        | ordem 
--------------------------------------+--------------------------------------+----------------------------------+--------------------------------------------+--------------------+-----------+-------+-------+-----------------+------------+----------------------------+-------
 49e6042b-2c6e-46f8-9cd5-2234860ce5c3 | ece5a9cc-d4e4-40e9-98f9-518aaf546244 | Mentoria de produto (persistida) | Sessões de discovery para times iniciantes | RESERVA_DIRETA     | PUBLICADO | 15000 | BRL   |              60 | ONLINE     | 2026-11-17 18:58:31.639+00 |     1
(1 row)

```

## 4. Roteiro de durabilidade

| Passo | Ação | Evidência |
| --- | --- | --- |
| 1 | Cadastro HTTP | Seção 2 |
| 2 | Consulta antes do reinício | Seção 3 |
| 3 | Identificador anotado | `49e6042b-2c6e-46f8-9cd5-2234860ce5c3` |
| 4 | Encerrar **só** o backend | Abaixo |
| 5 | Reiniciar o backend | Abaixo |
| 6 | Nova consulta SQL | Abaixo |
| 7 | Comparar | `diff` vazio |

```text
$ taskkill //PID 2716 //F
  PID 2716 foi finalizado.
$ curl http://localhost:3000/  (backend parado)
  000
  sem resposta (backend parado)
$ docker compose ps (PostgreSQL continua no ar)
mindhub-postgres-1 Up About an hour (healthy)
$ node dist/main.js
[Nest] 15676  - 17/11/2026, 15:58:44     LOG [RouterExplorer] Mapped {/servicos, POST} route +0ms
[Nest] 15676  - 17/11/2026, 15:58:44     LOG [NestApplication] Nest application successfully started +1ms

$ SELECT … WHERE id = '49e6042b-2c6e-46f8-9cd5-2234860ce5c3'   (banco mindhub, DEPOIS do reinício)
                  id                  |              perfil_id               |              titulo              |                 descricao                  | modelo_contratacao | situacao  | preco | moeda | duracao_minutos | modalidade |        publicado_em        | ordem 
--------------------------------------+--------------------------------------+----------------------------------+--------------------------------------------+--------------------+-----------+-------+-------+-----------------+------------+----------------------------+-------
 49e6042b-2c6e-46f8-9cd5-2234860ce5c3 | ece5a9cc-d4e4-40e9-98f9-518aaf546244 | Mentoria de produto (persistida) | Sessões de discovery para times iniciantes | RESERVA_DIRETA     | PUBLICADO | 15000 | BRL   |              60 | ONLINE     | 2026-11-17 18:58:31.639+00 |     1
(1 row)


$ diff antes depois
  idênticos
```

Observações sobre as evidências:

- O backend parado (PID 2716) foi o que gravou o registro; o novo processo (PID 15676) é outro processo Node, que nunca teve o Serviço em memória.
- As horas que o shell imprimiu nas linhas `$ date` ficaram cerca de 1 minuto atrasadas, porque o `tail -f` que espera o log só termina por timeout. A hora real de reinício é a do log do Nest (15:58:44); o encerramento foi às 15:58:41.
- `publicado_em = 2026-11-17 18:58:31.639+00` = 15:58:31 em Brasília (UTC−3), o mesmo instante do `date` do cadastro.
- `ordem = 1`: é o primeiro Serviço gravado na tabela de desenvolvimento.

## 5. Conclusão

**Durabilidade comprovada**: o Serviço criado via HTTP está no PostgreSQL antes e depois de encerrar e reiniciar o backend, com o contêiner do banco no ar o tempo todo, e as duas consultas são idênticas. No Material 08 (`08-04`), o mesmo roteiro perdia o Serviço, porque ele ficava em memória.
