# 04-04 — Especificação do teste RED

**Caso de uso:** UC03 — Publicar Serviço (épico [#35](https://github.com/MindHub-DSC/Mindhub/issues/35))
**Sub-Issue:** [#36](https://github.com/MindHub-DSC/Mindhub/issues/36) — Modelar o Serviço e suas condições vigentes
**Data:** 11/11/2026

## Critério de aceite coberto

Critério 1 da #36: *"O Serviço nasce publicado, com identidade própria, referência ao perfil e Modelo de Contratação declarado."* (Origem: fluxo principal, passos 1, 2 e 4; POS-01 a POS-04.)

Só este critério é exercitado. Os outros cinco (modelo ausente ou inválido, condições de Reserva Direta, Sob Proposta sem condições, valores inválidos, porta e adaptador em memória) ficam para os próximos ciclos.

## Nível do teste

**Unitário de domínio**: exercita o Agregado `Servico` sem banco, sem Nest e sem HTTP. É o nível da #36, que modela o domínio (as camadas de persistência e API são das #37 e #40) e roda em `pnpm test` sem Docker, como os testes de `PerfilEspecialista`.

## Arquivos

| Arquivo | Papel |
| --- | --- |
| `mindhub-backend/test/unit/oferta/servico.spec.ts` | Teste RED (Vitest) |
| `mindhub-backend/src/oferta/dominio/servico.ts` | **Stub de contrato**: tipos e `Servico.publicar`, que só lança `NaoImplementado`. Sem regra de negócio |

O stub existe para que a falha seja de **comportamento** (`NaoImplementado`) e não de resolução de módulo, que seria RED inválido. Ele fixa o contrato esperado: `Servico.publicar({ perfilId, titulo, descricao, modeloContratacao, agora })`, com os getters `id`, `perfilId`, `titulo`, `descricao`, `modeloContratacao` e `situacao`.

## Código do teste (AAA)

```ts
import { randomUUID } from 'node:crypto';
import { Servico } from '../../../src/oferta/dominio/servico.js';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const agora = new Date('2026-11-11T12:00:00.000Z');

describe('Servico.publicar', () => {
  it('nasce publicado, com identidade própria, referência ao perfil e Modelo de Contratação', () => {
    // Arrange
    const perfilId = randomUUID();
    const dados = {
      perfilId,
      titulo: 'Mentoria de produto',
      descricao: 'Sessões de discovery para times iniciantes',
      modeloContratacao: 'SOB_PROPOSTA' as const,
      agora,
    };

    // Act
    const servico = Servico.publicar(dados);

    // Assert
    expect(servico.id).toMatch(UUID);
    expect(servico.perfilId).toBe(perfilId);
    expect(servico.titulo).toBe('Mentoria de produto');
    expect(servico.modeloContratacao).toBe('SOB_PROPOSTA');
    expect(servico.situacao).toBe('PUBLICADO');
  });
});
```

Escolhi `SOB_PROPOSTA` para isolar o critério 1: esse modelo não exige condições vigentes (D-UC03-03), então o teste não toca nas regras de Reserva Direta (critérios 3 e 5).

## Dependências e execução

- Dependências: Vitest 4.1.11 (já instalado), Node 24. Nenhuma dependência nova.
- Comando: `cd mindhub-backend && pnpm test`
- Resultado esperado agora: **1 falha** (`NaoImplementado`) e 41 testes passando.
- Resultado esperado na fase GREEN: o teste passa com a implementação real de `Servico.publicar`.
