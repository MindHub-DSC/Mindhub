# 11-05 — Testes automatizados do contrato

**Caso de uso:** UC03 — Publicar Serviço (épico [#35](https://github.com/MindHub-DSC/Mindhub/issues/35))
**Issue:** [#144](https://github.com/MindHub-DSC/Mindhub/issues/144) · **PR:** [#145](https://github.com/MindHub-DSC/Mindhub/pull/145) (Draft)
**Data:** 24/11/2026

## 1. Testes existentes (Material 07), preservados [CÓD]

`test/unit/oferta/servicos.http.spec.ts` (Vitest, Supertest, `@nestjs/testing`, `vi.fn()`): sucesso com `toEqual` fechado, 6 entradas inválidas (400, sem chamar o serviço) e 5 erros mapeados (404, 403, 422, 400, 503). O arquivo não foi substituído: os 2 testes novos entraram no mesmo `describe`, reaproveitando `app`, `publicarServico` (mock de `executar`, o método que o Controller realmente usa), `corpoValido`, `publicar()` e os hooks existentes.

## 2. Lacunas

1. Nenhum teste fazia o serviço simulado devolver **propriedades a mais**. O mock devolvia um `Servico` real, então um vazamento por `condicoes` (passado por referência) passava despercebido.
2. O caso Sob Proposta (`condicoes: null`) e o `Content-Type` não eram verificados no nível HTTP.

## 3. Código acrescentado

```typescript
// Contrato público (#144): a resposta é fechada, mesmo que o objeto devolvido
// pelo serviço de aplicação tenha propriedades a mais. As propriedades extras
// abaixo existem só neste objeto simulado (nada disso está no domínio real).
it('não expõe propriedades internas do Serviço nem das condições', async () => {
  const id = randomUUID();
  const perfilId = randomUUID();
  publicarServico.executar.mockResolvedValue({
    id, perfilId,
    titulo: 'Mentoria de produto',
    descricao: 'Sessões de discovery',
    modeloContratacao: 'RESERVA_DIRETA',
    situacao: 'PUBLICADO',
    publicadoEm: new Date(),
    notaInterna: 'informacao-interna-ilustrativa',
    condicoes: { ...corpoValido.condicoes, referenciaInterna: 'condicao-interna-ilustrativa' },
  });

  const resposta = await publicar(corpoValido).expect(201);

  expect(resposta.body).not.toHaveProperty('notaInterna');
  expect(resposta.body).not.toHaveProperty('publicadoEm');
  expect(resposta.body.condicoes).not.toHaveProperty('referenciaInterna');
  expect(resposta.body).toEqual({ id, perfilId, /* …campos públicos… */ situacao: 'PUBLICADO' });
});

it('Sob Proposta: devolve "condicoes" como null, sem omitir o campo', async () => { /* … */ });
```

`notaInterna` e `referenciaInterna` existem **só no objeto simulado**: não foram adicionadas ao domínio, ao DTO, ao repositório, ao ORM nem ao banco. A asserção é `toEqual` (contrato fechado), com `not.toHaveProperty` para nomear o vazamento.

## 4. Ciclo RED → GREEN [EXE]

```text
RED  (commit 7900d91, antes da correção)
$ vitest run test/unit/oferta/servicos.http.spec.ts
 FAIL  … > não expõe propriedades internas do Serviço nem das condições
AssertionError: expected { preco: 15000, moeda: 'BRL', …(3) } to not have property "referenciaInterna"
+ Received: "condicao-interna-ilustrativa"
Tests  1 failed | 13 passed (14)

GREEN (commit 472cdac, depois da correção em paraResposta)
$ pnpm test      Test Files 12 passed (12) · Tests 112 passed (112)
```

O teste falhou em `condicoes.referenciaInterna` (e não em `notaInterna`/`publicadoEm`, que o mapper já descartava), o que localiza o vazamento exatamente onde o diagnóstico (`11-01`, seção 6) previa.

## 5. Execução final [EXE]

Sem `node`/`pnpm` no host: contêiner `node:24.19.0-bookworm-slim` na rede `mindhub_default`.

| Comando | Arquivos | Testes | Resultado |
| --- | --- | --- | --- |
| `pnpm test` (linha de base, antes) | 12 | 110 | aprovados |
| `pnpm test` (depois) | 12 | **112** (+2) | aprovados |
| `pnpm test:e2e` (antes e depois) | 6 | 35 | aprovados (banco `mindhub_test`) |
| `pnpm lint` | 75 arquivos | — | 0 avisos, 0 erros |
| `pnpm build` | — | — | exit 0 |

A contagem final (112) **não** é igual à do Material 10 (110): 2 testes foram acrescentados. `test:e2e` roda no banco de testes (verificado pelo `global-setup` e pelo sufixo `_test`) e não foi executado contra o banco de desenvolvimento. `git status` ficou limpo depois dos testes (lockfile intacto).

## 6. Pendências

O 403 e o 503 continuam cobertos só com serviço simulado (`11-04`).
