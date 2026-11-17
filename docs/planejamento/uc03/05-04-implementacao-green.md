# 05-04 — Implementação GREEN

**Caso de uso:** UC03 — Publicar Serviço (épico [#35](https://github.com/MindHub-DSC/Mindhub/issues/35))
**Sub-Issue:** [#36](https://github.com/MindHub-DSC/Mindhub/issues/36), critério 1
**Branch:** `feature/36-uc03-modelar-servico`
**Data:** 12/11/2026

## Pré-condições conferidas

- Branch ativa: `feature/36-uc03-modelar-servico`, sincronizada com a remota em `c1a8af0`.
- `git status`: nenhuma alteração em arquivos rastreados antes da edição.
- Contratos acessíveis: `ModeloContratacao`, `SituacaoServico` e a assinatura de `publicar` já estão em `servico.ts`.

## Arquivos

| Arquivo | Alteração |
| --- | --- |
| `mindhub-backend/src/oferta/dominio/servico.ts` | **Modificado**: stub trocado pela implementação (`+51 −11`) |
| `mindhub-backend/test/unit/oferta/servico.spec.ts` | **Sem alteração** (`git diff --exit-code -- test/` retornou 0) |

## Código implementado

```ts
import { randomUUID } from 'node:crypto';                      // (1)

export type ModeloContratacao = 'RESERVA_DIRETA' | 'SOB_PROPOSTA';
export type SituacaoServico = 'PUBLICADO';

// NaoImplementado: mantida sem uso; a remoção fica para o REFACTOR.

export class Servico {
  private constructor(                                          // (2)
    private readonly _id: string,
    private readonly _perfilId: string,
    private readonly _titulo: string,
    private readonly _descricao: string,
    private readonly _modeloContratacao: ModeloContratacao,
    private readonly _situacao: SituacaoServico,
  ) {}

  static publicar(dados: {                                      // (3)
    perfilId: string;
    titulo: string;
    descricao: string;
    modeloContratacao: ModeloContratacao;
    agora: Date;
  }): Servico {
    return new Servico(
      randomUUID(),                                             // (4)
      dados.perfilId,                                           // (5)
      dados.titulo,
      dados.descricao,
      dados.modeloContratacao,
      'PUBLICADO',                                              // (6)
    );
  }

  get id(): string { return this._id; }                         // (7)
  get perfilId(): string { return this._perfilId; }
  get titulo(): string { return this._titulo; }
  get descricao(): string { return this._descricao; }
  get modeloContratacao(): ModeloContratacao { return this._modeloContratacao; }
  get situacao(): SituacaoServico { return this._situacao; }
}
```

*(Os getters aparecem compactados aqui; no arquivo cada um ocupa três linhas, no estilo do `PerfilEspecialista`.)*

### Explicação

1. **`randomUUID`** de `node:crypto`: gera a identidade sem dependência externa, como em `PerfilEspecialista.cadastrar`.
2. **Construtor privado com `private readonly`**: substitui os `declare readonly`, que só declaravam o tipo e não guardavam valor em tempo de execução. Por ser privado, o Serviço não pode ser criado fora da fábrica, e `readonly` impede mudar o estado depois da criação (não há setters).
3. **`publicar`**: a assinatura é a mesma do stub, inclusive `agora`. O corpo agora cria a instância em vez de lançar `NaoImplementado`.
4. **Identidade própria**: cada chamada gera um UUID novo. O Serviço não reaproveita o id do perfil.
5. **Referência ao perfil, título, descrição e modelo**: são guardados como chegaram. Nenhuma validação foi adicionada (ver "postergado").
6. **`'PUBLICADO'`**: situação inicial fixa. O UC03 não tem rascunho, o Serviço nasce publicado (POS do fluxo principal).
7. **Getters**: expõem os campos com os mesmos nomes e tipos que o contrato do RED fixou.

## Ligação entre código e asserções

| Asserção do teste | Linha do código que a satisfaz |
| --- | --- |
| `expect(servico.id).toMatch(UUID)` | (4) `randomUUID()` + getter `id` |
| `expect(servico.perfilId).toBe(perfilId)` | (5) `dados.perfilId` + getter `perfilId` |
| `expect(servico.titulo).toBe('Mentoria de produto')` | (5) `dados.titulo` + getter `titulo` |
| `expect(servico.modeloContratacao).toBe('SOB_PROPOSTA')` | (5) `dados.modeloContratacao` + getter `modeloContratacao` |
| `expect(servico.situacao).toBe('PUBLICADO')` | (6) `'PUBLICADO'` + getter `situacao` |

A `descricao` é guardada e exposta porque faz parte do contrato do agregado, mas o teste não a verifica.

## O que foi postergado e por quê

| Item | Motivo | Destino |
| --- | --- | --- |
| Trim e mínimo de 1 caractere em título/descrição (D-UC03-01) | Nenhuma asserção exige; seria código sem teste | Ciclo RED do critério 5 da #36 |
| Validação do Modelo de Contratação ausente ou inválido | Critério 2 | Próximo ciclo RED |
| Condições vigentes da Reserva Direta (D-UC03-02) | Critérios 3 e 5 | Próximos ciclos RED |
| Guardar `agora` (`publicadoEm`) | Nenhuma asserção; o parâmetro continua na assinatura | Quando um teste exigir |
| `reconstituir`, porta e adaptador em memória | Critério 6 | Próximos ciclos |
| Remover `NaoImplementado` (sem uso) | Limpeza, não comportamento | REFACTOR (Material 06) |
