# 05-03 — Plano de implementação GREEN

**Caso de uso:** UC03 — Publicar Serviço (épico [#35](https://github.com/MindHub-DSC/Mindhub/issues/35))
**Sub-Issue:** [#36](https://github.com/MindHub-DSC/Mindhub/issues/36), critério 1
**Branch:** `feature/36-uc03-modelar-servico`
**Data:** 12/11/2026

## Objetivo técnico

Substituir o stub de `Servico.publicar` pela menor implementação real que faça o teste `servico.spec.ts` passar: criar um `Servico` com identidade própria, referência ao perfil, título, descrição, Modelo de Contratação e situação `PUBLICADO`. O arquivo de teste não será alterado.

## Análise do teste

| Elemento | Conteúdo |
| --- | --- |
| Entradas | `{ perfilId: randomUUID(), titulo: 'Mentoria de produto', descricao: 'Sessões de discovery...', modeloContratacao: 'SOB_PROPOSTA', agora: 2026-11-11T12:00Z }` |
| Operação | `Servico.publicar(dados)` (método estático de fábrica) |
| Resultado esperado | Uma instância de `Servico` com valores nos getters |
| Asserções | (1) `id` casa com regex de UUID; (2) `perfilId` igual ao de entrada; (3) `titulo` igual a `'Mentoria de produto'`; (4) `modeloContratacao` igual a `'SOB_PROPOSTA'`; (5) `situacao` igual a `'PUBLICADO'` |
| Camada | Domínio (`src/oferta/dominio`): agregado puro, sem Nest, repositório ou HTTP |
| Dependências | Nenhum mock. Só `randomUUID` de `node:crypto`, a mesma fonte de identidade do `PerfilEspecialista.cadastrar` |

## Tabela do plano de alteração

| Arquivo | Componente | Responsabilidade | Estado atual | Alteração mínima | Critério |
| --- | --- | --- | --- | --- | --- |
| `mindhub-backend/src/oferta/dominio/servico.ts` | `Servico` (agregado) | Representar o Serviço publicado em C2 | Propriedades só com `declare` (sem valor), sem construtor; `publicar` lança `NaoImplementado` | Construtor privado com os 6 campos, getters de leitura, e `publicar` passa a criar a instância com `randomUUID()` e `'PUBLICADO'` | CA-1 da #36 |
| `mindhub-backend/test/unit/oferta/servico.spec.ts` | Teste RED | Verificar o CA-1 | Falha com `NaoImplementado` | **Nenhuma** | CA-1 da #36 |

Só um arquivo de produção muda. Os tipos `ModeloContratacao` e `SituacaoServico` e a assinatura de `publicar` ficam como estão.

## Forma da implementação

Segue a convenção do agregado irmão `PerfilEspecialista`: construtor privado com campos `private readonly _x`, getters públicos sem setters, e criação só pela fábrica estática.

```ts
static publicar(dados: { perfilId; titulo; descricao; modeloContratacao; agora }): Servico {
  return new Servico(
    randomUUID(),
    dados.perfilId,
    dados.titulo,
    dados.descricao,
    dados.modeloContratacao,
    'PUBLICADO',
  );
}
```

## Contratos e injeção de dependências

- A assinatura de `publicar` continua igual, incluindo `agora`. Este teste não verifica nenhum dado temporal, então `agora` **não é guardado** neste ciclo. Se o Serviço precisar de `publicadoEm`, isso entra com um teste que o exija.
- Os getters `id`, `perfilId`, `titulo`, `descricao`, `modeloContratacao` e `situacao` continuam com os mesmos nomes e tipos.
- Não há injeção de dependências: é um agregado de domínio. A identidade vem de `randomUUID()`, como em `PerfilEspecialista`.

## Deliberadamente fora deste GREEN

| Item | Por quê | Onde entra |
| --- | --- | --- |
| Trim e mínimo de 1 caractere em título/descrição (D-UC03-01) | Nenhuma asserção deste teste exige isso | Teste RED de dados inválidos (critério 5) |
| Validar o Modelo de Contratação (ausente/inválido) | Critério 2 | Próximo ciclo RED |
| Condições vigentes de Reserva Direta (D-UC03-02) | Critérios 3 e 5 | Próximos ciclos RED |
| Guardar `agora` como `publicadoEm` | Nenhuma asserção | Quando um teste exigir |
| `reconstituir`, porta e adaptador em memória | Critério 6 | Próximos ciclos |
| Remover a classe `NaoImplementado`, que deixa de ser usada | É limpeza, não comportamento | REFACTOR (Material 06) |

## Riscos

| Risco | Mitigação |
| --- | --- |
| Falso positivo (o teste passar sem a implementação de fato) | As 5 asserções conferem valores vindos da entrada ou gerados (UUID), não um objeto vazio. Conferir na saída que o teste é executado e passa |
| Regressão em outros módulos | Rodar a suíte completa (`pnpm test`). A linha de base é 41 testes |
| Quebrar lint/build | Rodar `pnpm lint` e `pnpm build` |

## Critérios para considerar o GREEN atingido

1. `pnpm test` mostra `servico.spec.ts` com 1 teste **passando**, o mesmo teste do RED.
2. Suíte completa: `Tests 42 passed (42)`, sem falhas.
3. `servico.spec.ts` sem nenhuma alteração (`git diff` mostra só `servico.ts`).
4. `pnpm lint` e `pnpm build` sem erros.
