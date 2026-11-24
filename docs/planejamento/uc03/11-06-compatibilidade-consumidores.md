# 11-06 — Compatibilidade com consumidores

**Caso de uso:** UC03 — Publicar Serviço (épico [#35](https://github.com/MindHub-DSC/Mindhub/issues/35))
**Issue:** [#144](https://github.com/MindHub-DSC/Mindhub/issues/144) · **PR:** [#145](https://github.com/MindHub-DSC/Mindhub/pull/145) (Draft)
**Data:** 24/11/2026

Análise **hipotética**: nenhuma das mudanças abaixo foi implementada e nenhuma versão `/v2` foi criada.

## 1. Contrato atual

`201` com `{ id: string, perfilId: string, titulo: string, descricao: string, modeloContratacao: "RESERVA_DIRETA" | "SOB_PROPOSTA", condicoes: { preco: number, moeda: string, duracaoMinutos: number, modalidade: string } | null, situacao: "PUBLICADO" }` (`11-02`).

**Consumidores:** hoje só o `requests.http` e os testes do projeto; não há cliente externo registrado. Os consumidores potenciais abaixo são futuros (front-end do MindHub, integrações de outros contextos).

## 2. Matriz de mudanças

| # | Alteração | Contrato anterior | Contrato hipotético | Consumidores afetados | Classificação | Justificativa | Mitigação |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Renomear o identificador | `id` | `servicoId` | Qualquer cliente que leia `id` | **Potencialmente incompatível** | O campo some e outro aparece; leitura de `id` vira `undefined` | Manter `id` e, se necessário, adicionar o novo como campo extra durante a transição; ou versionar |
| 2 | Renomear outro campo | `titulo` | `nome` | Telas de exibição | **Potencialmente incompatível** | Mesma razão | Idem |
| 3 | Remover um campo | `descricao` presente | ausente | Quem exibe ou valida a descrição | **Potencialmente incompatível** | Cliente pode falhar ao ler o campo ou validar o objeto como obrigatório | Depreciar antes; anunciar a data |
| 4 | Alterar o tipo do identificador | `id: string` (UUID) | `id: number` | Clientes tipados, ORMs, bancos de clientes | **Potencialmente incompatível** | Quebra tipagem e armazenamento; UUID em string não cabe em número | Não alterar sem versão |
| 5 | Encapsular a resposta em `data` | `{ id, … }` | `{ data: { id, … } }` | Todos | **Potencialmente incompatível** | Todos os caminhos de leitura mudam | Versão nova do endpoint |
| 6 | Alterar o status de sucesso | `201` | `200` | Clientes que testam `=== 201` ou que usam `Location`/semântica de criação | **Dependente do contrato e dos consumidores** | Cliente que aceita qualquer 2xx não quebra; cliente que compara `201` quebra | Documentar; manter 201 (é o semântico para criação) |
| 7 | Adicionar propriedade opcional | 7 campos | + `visibilidade?` | Clientes que leem só o que conhecem | **Dependente do contrato e dos consumidores** | Cliente com leitura aberta (ignora desconhecidos) não quebra; cliente que valida de forma **fechada** (`strict`/`additionalProperties: false`) quebra | Comunicar antes; os testes deste projeto usam `toEqual` fechado e **falhariam**, o que é desejado: a mudança exige atualizar o contrato |

## 3. Observações específicas do projeto

- **Entrada fechada:** o servidor rejeita campos extras (`z.strictObject`). Para quem **envia**, adicionar campo obrigatório novo na entrada é incompatível; campo opcional novo é compatível.
- **`condicoes: null`:** quem espera sempre um objeto quebraria; o contrato promete `null` em Sob Proposta.
- **`situacao`:** hoje só `PUBLICADO`; ao entrar um novo valor (por exemplo, despublicar), clientes com enumeração fechada quebrariam. Tratar como mudança de contrato.
- **`publicadoEm`:** acrescentá-lo seria o cenário 7 (campo opcional novo) e dependeria de os consumidores lerem de forma aberta ou fechada.

## 4. Conclusão

Renomear, remover, mudar tipo ou encapsular são **incompatíveis** por natureza; mudar status e adicionar campo **dependem do consumidor**. Os testes de contrato do `11-05` (`toEqual` fechado) transformam qualquer dessas mudanças em falha de teste, forçando decisão consciente antes de entrar.
