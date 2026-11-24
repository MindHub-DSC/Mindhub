# 11-07 — Verificação da API containerizada

**Caso de uso:** UC03 — Publicar Serviço (épico [#35](https://github.com/MindHub-DSC/Mindhub/issues/35))
**Issue:** [#144](https://github.com/MindHub-DSC/Mindhub/issues/144) · **PR:** [#145](https://github.com/MindHub-DSC/Mindhub/pull/145) (Draft)
**Data:** 24/11/2026

Dockerfile e Compose do Material 10 não foram recriados nem alterados.

## 1. Ambiente [EXE]

```text
$ docker compose ps
mindhub-api-1        mindhub-api:dev      Up        0.0.0.0:3000->3000/tcp
mindhub-postgres-1   postgres:18-alpine   Up (healthy)   0.0.0.0:5433->5432/tcp
```

Logs: `OfertaModule dependencies initialized`, `Mapped {/servicos, POST} route`, `Nest application successfully started`, sem erros. `DB_HOST=postgres`, banco `mindhub` (nunca `mindhub_test`).

## 2. Imagem reconstruída

O código de `src/` mudou (`472cdac`), então a imagem foi reconstruída: `docker compose up -d --build api` → imagem `mindhub-api:dev`, id `f97246f7e3cc` (criada na hora; a anterior era `f6317dc9df42`). A imagem anterior **não** foi usada como evidência do código novo. `postgres` não foi recriado.

## 3. Requisição de sucesso (após o rebuild) [EXE]

```text
POST /servicos
{"usuarioId":"<uuid do especialista>","titulo":"Pos-fix","descricao":"D","modeloContratacao":"RESERVA_DIRETA",
 "condicoes":{"preco":250,"moeda":"BRL","duracaoMinutos":45,"modalidade":"PRESENCIAL"}}

HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8
{"id":"bedc3742-bf8c-4d9d-bd67-4b37d714e1e7","perfilId":"eeb8450f-0fd4-48a2-9bf0-295b55935c59","titulo":"Pos-fix",
 "descricao":"D","modeloContratacao":"RESERVA_DIRETA",
 "condicoes":{"preco":250,"moeda":"BRL","duracaoMinutos":45,"modalidade":"PRESENCIAL"},"situacao":"PUBLICADO"}
```

Sob Proposta: 201 com `"condicoes":null`.

## 4. Contrato esperado × observado

| Campo | Esperado (`11-02`) | Observado | Confere |
| --- | --- | --- | --- |
| `id` | string UUID | `bedc3742-…` (string) | Sim |
| `perfilId` | string UUID | `eeb8450f-…` | Sim |
| `titulo`, `descricao` | string | `"Pos-fix"`, `"D"` | Sim |
| `modeloContratacao` | enum | `"RESERVA_DIRETA"` | Sim |
| `condicoes` | objeto com 4 campos ou `null` | 4 campos (`preco` number, `moeda`, `duracaoMinutos` number, `modalidade`) | Sim |
| `situacao` | `"PUBLICADO"` | `"PUBLICADO"` | Sim |
| Campos extras | nenhum | chaves de topo: `id, perfilId, titulo, descricao, modeloContratacao, condicoes, situacao`; `publicadoEm` ausente | Sim |
| Status e `Content-Type` | 201, `application/json; charset=utf-8` | idem | Sim |

## 5. Cenários inválidos contra o contêiner

`{}` → 400; campo extra → 400; título vazio → 400; Reserva Direta sem condições → 422 (mensagens completas na matriz do `11-04`).

## 6. Persistência no banco de desenvolvimento [EXE]

```text
$ docker compose exec -T postgres psql … -x  (SELECT … FROM oferta.servicos WHERE id='bedc3742-…')
id                 | bedc3742-bf8c-4d9d-bd67-4b37d714e1e7
titulo             | Pos-fix
modelo_contratacao | RESERVA_DIRETA
situacao           | PUBLICADO
```

Sem endpoint GET e sem operação destrutiva.

## 7. Distinção entre evidências

| Evidência | O que comprova |
| --- | --- |
| Teste com serviço simulado (`11-05`) | A fronteira HTTP fecha a resposta mesmo se o serviço devolver campos a mais |
| Teste integrado/E2E (35) | Interação dos componentes reais com o banco de testes |
| Requisição à API containerizada (esta seção) | O contrato no ambiente de execução, com a imagem nova |
| Consulta SQL | O registro persistido |

São complementares, não intercambiáveis.

## 8. Divergências e conclusão

Nenhuma divergência entre o contrato definido e o observado. Contrato verificado na API containerizada reconstruída, sem campos internos.
