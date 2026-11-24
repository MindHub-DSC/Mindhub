# 11-03 — DTO de resposta e serialização

**Caso de uso:** UC03 — Publicar Serviço (épico [#35](https://github.com/MindHub-DSC/Mindhub/issues/35))
**Issue:** [#144](https://github.com/MindHub-DSC/Mindhub/issues/144) · **Branch:** `feature/144-uc03-contrato-http` · **PR:** [#145](https://github.com/MindHub-DSC/Mindhub/pull/145) (Draft)
**Data:** 24/11/2026

Legenda: **[CÓD]** confirmado no código · **[EXE]** executado nesta atividade.

## 1. Estado anterior [CÓD]

`ServicoResponse` (interface) e `paraResposta` já existiam em `src/oferta/http/publicar-servico.dto.ts`. O Controller já delegava a `PublicarServico.executar` e devolvia `paraResposta(servico)`. Os campos de topo eram copiados um a um, mas `condicoes: servico.condicoes` repassava o objeto do domínio.

## 2. Por que importa (tempo de execução)

Uma interface TypeScript só existe na compilação: `ServicoResponse` **não remove** propriedades de um objeto JavaScript em execução. Quem controla o que sai no JSON é o mapeamento explícito, e em `condicoes` ele não era explícito.

## 3. Alteração realizada (mínima), commit `472cdac`

```typescript
export function paraResposta(servico: Servico): ServicoResponse {
  const condicoes = servico.condicoes;
  return {
    id: servico.id,
    perfilId: servico.perfilId,
    titulo: servico.titulo,
    descricao: servico.descricao,
    modeloContratacao: servico.modeloContratacao,
    condicoes: condicoes && {
      preco: condicoes.preco,
      moeda: condicoes.moeda,
      duracaoMinutos: condicoes.duracaoMinutos,
      modalidade: condicoes.modalidade,
    },
    situacao: servico.situacao,
  };
}
```

## 4. Controller (inalterado)

```typescript
@Post()
async publicar(
  @Body({ schema: publicarServicoSchema }) dados: PublicarServicoRequest,
): Promise<ServicoResponse> {
  const servico = await this.publicarServico.executar(dados);
  return paraResposta(servico);
}
```

Delegação preservada (`executar`, mesma assinatura). O mapper não tem regras de negócio: só copia campos, e `condicoes && {…}` preserva o `null`.

## 5. Alternativas conceituais (não adotadas)

`ClassSerializerInterceptor`, `class-transformer`, `@Expose()` e `@Exclude()`: o mapper explícito é suficiente e já é o padrão do projeto.

## 6. Arquivos modificados

| Arquivo | Alteração |
| --- | --- |
| `src/oferta/http/publicar-servico.dto.ts` | `paraResposta` copia os 4 campos de `condicoes` |
| `test/unit/oferta/servicos.http.spec.ts` | + 2 testes (ver `11-05`) |

Não alterados: Controller, `PublicarServico`, `Servico`, repositórios, ORM, `ServicoMapper`, migrations, Dockerfile, Compose e o pipe/schema de validação.

## 7. Verificação [EXE]

```text
$ pnpm build   → exit 0
$ pnpm lint    → Found 0 warnings and 0 errors
$ pnpm test    → 12 arquivos, 112 testes passed
```

Contrato anterior preservado (o `toEqual` do teste do Material 07 segue passando). Nenhuma propriedade de persistência é exposta e nenhum requisito novo foi introduzido.
