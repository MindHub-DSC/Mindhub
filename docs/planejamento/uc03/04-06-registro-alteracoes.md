# 04-06 — Registro de alterações

**Caso de uso:** UC03 — Publicar Serviço (épico [#35](https://github.com/MindHub-DSC/Mindhub/issues/35))
**Sub-Issue:** [#36](https://github.com/MindHub-DSC/Mindhub/issues/36)
**Data:** 11/11/2026

## Arquivos alterados

Adicionados com `git add` por caminho (sem `git add .`):

| Arquivo | Alteração |
| --- | --- |
| `mindhub-backend/test/unit/oferta/servico.spec.ts` | +31 linhas: teste RED |
| `mindhub-backend/src/oferta/dominio/servico.ts` | +34 linhas: stub de contrato (tipos e `Servico.publicar` lançando `NaoImplementado`) |

Os arquivos de `docs/` (planejamento e prompts) continuaram fora do commit.

## Commit

- **Hash:** `c1a8af00d6c19fe7c64d4f94c0a0924b9fa2811e` (`c1a8af0`)
- **Mensagem:**

```text
test(oferta): add failing test for Servico.publicar (ref #36)

Primeiro teste (TDD RED) do critério 1 da #36: o Serviço nasce publicado,
com identidade, referência ao perfil e Modelo de Contratação. Inclui só o
stub de contrato Servico.publicar, que lança NaoImplementado.

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>
```

## Saída real

```text
$ git push
To https://github.com/MindHub-DSC/Mindhub.git
   cbf21f5..c1a8af0  feature/36-uc03-modelar-servico -> feature/36-uc03-modelar-servico

$ git log -1 --stat
 mindhub-backend/src/oferta/dominio/servico.ts    | 34 ++++++++++++++++++++++++
 mindhub-backend/test/unit/oferta/servico.spec.ts | 31 +++++++++++++++++++++++
 2 files changed, 65 insertions(+)
```

## Observação

Fora o stub, o commit não tem código de produção. O stub não implementa regra de negócio: serve só para que o RED seja funcional. A implementação real é a fase GREEN.
