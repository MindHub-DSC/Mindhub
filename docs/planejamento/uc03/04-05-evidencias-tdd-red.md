# 04-05 — Evidências do TDD RED

**Caso de uso:** UC03 — Publicar Serviço (épico [#35](https://github.com/MindHub-DSC/Mindhub/issues/35))
**Sub-Issue:** [#36](https://github.com/MindHub-DSC/Mindhub/issues/36)
**Data:** 11/11/2026

## Comando

```text
cd mindhub-backend && pnpm test
```

## Saída real (trecho)

```text
 RUN  v4.1.11 C:/Users/leonardo/Desktop/DSC/Mindhub/mindhub-backend

 ❯ test/unit/oferta/servico.spec.ts (1 test | 1 failed) 10ms
     × nasce publicado, com identidade própria, referência ao perfil e Modelo de Contratação 9ms

 FAIL  test/unit/oferta/servico.spec.ts > Servico.publicar > nasce publicado, com identidade própria, referência ao perfil e Modelo de Contratação
NaoImplementado: Servico.publicar ainda não implementado.
 ❯ Servico.publicar src/oferta/dominio/servico.ts:32:11
     30|     agora: Date;
     31|   }): Servico {
     32|     throw new NaoImplementado('Servico.publicar');
       |           ^
     33|   }
     34| }
 ❯ test/unit/oferta/servico.spec.ts:22:29

 Test Files  1 failed | 5 passed (6)
      Tests  1 failed | 41 passed (42)
```

Antes do teste novo, a linha de base era `Test Files 5 passed (5)` e `Tests 41 passed (41)` (ver `04-02`).

## Causa da falha

O teste chama `Servico.publicar(...)` (linha 22 do spec), e o stub lança `NaoImplementado`. A falha ocorre no passo **Act**, antes de qualquer asserção, porque o comportamento "publicar um Serviço" ainda não existe.

## Validação formal da fase RED

| Verificação | Resultado |
| --- | --- |
| O teste executou (o runner e o módulo foram carregados)? | Sim |
| A falha é funcional (comportamento ausente) e não de ambiente? | Sim: `NaoImplementado`, não erro de sintaxe, módulo ou dependência |
| Só o teste novo falhou? | Sim: 41 testes anteriores seguem passando |
| Há código de produção que satisfaça o teste? | Não: o stub só lança erro |
| `pnpm lint` e `pnpm build` | Sem erros |

**RED válido.** A fase GREEN (implementação de `Servico.publicar`) e a REFACTOR ficam para o Material 05.
