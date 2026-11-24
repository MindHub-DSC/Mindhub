# 11-02 — Definição do contrato público

**Caso de uso:** UC03 — Publicar Serviço (épico [#35](https://github.com/MindHub-DSC/Mindhub/issues/35))
**Issue:** [#144](https://github.com/MindHub-DSC/Mindhub/issues/144) — Estabilizar e testar o contrato HTTP de POST /servicos
**Branch:** `feature/144-uc03-contrato-http` · **PR:** [#145](https://github.com/MindHub-DSC/Mindhub/pull/145) (Draft)
**Data:** 24/11/2026

Legenda: **[DOC]** documentado · **[CÓD]** confirmado no código · **[EXE]** executado nesta atividade · **[PEN]** pendente.

## 1. Contrato de entrada (`publicarServicoSchema`) [CÓD]

`POST /servicos`, `Content-Type: application/json`, schema Zod **estrito** (campo não previsto → 400).

| Campo | Tipo | Obrigatório | Observação |
| --- | --- | --- | --- |
| `usuarioId` | string (UUID) | sim | Ator; sem autenticação (D-UC03-05) |
| `titulo` | string | sim | Limite e vazio: invariantes do domínio |
| `descricao` | string | sim | idem |
| `modeloContratacao` | `"RESERVA_DIRETA"` \| `"SOB_PROPOSTA"` | sim | |
| `condicoes` | objeto | não (obrigatório em Reserva Direta, regra do domínio → 422) | `preco: number`, `moeda: string`, `duracaoMinutos: number`, `modalidade: string` |

## 2. Contrato de saída anterior

Os mesmos campos da seção 3; `condicoes` era o **objeto do domínio**, repassado por referência. Nenhum campo mudou de nome, tipo ou posição.

## 3. Contrato público definido (resposta de sucesso)

Status **201 Created**, `Content-Type: application/json; charset=utf-8`.

| Campo | Tipo JSON | Obrigatório | Origem | Justificativa | Impacto para o consumidor |
| --- | --- | --- | --- | --- | --- |
| `id` | string (UUID) | sempre | `Servico.id` | Identificador gerado pelo domínio | Chave para referências futuras |
| `perfilId` | string (UUID) | sempre | `Servico.perfilId` | Perfil dono do Serviço (derivado do `usuarioId`) | Liga o Serviço ao perfil |
| `titulo` | string | sempre | `Servico.titulo` | Eco do que foi publicado | Exibição |
| `descricao` | string | sempre | `Servico.descricao` | idem | Exibição |
| `modeloContratacao` | `"RESERVA_DIRETA"` \| `"SOB_PROPOSTA"` | sempre | `Servico.modeloContratacao` | Define como se contrata | Decide o fluxo do cliente |
| `condicoes` | objeto \| `null` | sempre presente | `Servico.condicoes` | `null` em Sob Proposta; o campo **nunca é omitido** | O cliente precisa tratar `null` |
| `condicoes.preco` | number | se `condicoes` ≠ null | idem | Preço vigente | |
| `condicoes.moeda` | string | idem | idem | | |
| `condicoes.duracaoMinutos` | number | idem | idem | | |
| `condicoes.modalidade` | string | idem | idem | | |
| `situacao` | `"PUBLICADO"` | sempre | `Servico.situacao` | Único valor hoje | O cliente não deve assumir que será sempre este |

**Fora do contrato (propositalmente):** `publicadoEm` (existe no domínio e no banco, mas nenhum requisito do UC03 o pede na resposta), `ordem` (coluna técnica do ORM) e qualquer propriedade do ORM.

## 4. Responsabilidades dos quatro modelos

| Modelo | Componente | Responsabilidade |
| --- | --- | --- |
| DTO de entrada | `publicarServicoSchema` / `PublicarServicoRequest` | Formato do que o cliente envia; recusa o que não é previsto |
| Entidade de domínio | `Servico` | Invariantes e regras (`publicar`, limites, condições); não conhece HTTP |
| Entidade de persistência | `ServicoOrmEntity` + `ServicoMapper` | Tabela `oferta.servicos` (inclui `ordem`); não é exposta |
| DTO de resposta | `ServicoResponse` + `paraResposta` | O que a API promete aos consumidores |

O mapper HTTP (`paraResposta`, domínio → resposta) **não** se confunde com o mapper de persistência (`ServicoMapper`, domínio ↔ ORM); este último não foi alterado.

## 5. Decisões e compatibilidade

- Contrato **preservado**: nenhum campo novo, renomeado ou removido; nenhum requisito novo.
- `ServicoResponse` já cumpria o papel de DTO de resposta; não foi criado outro.
- Campo extra na entrada: este projeto **rejeita** (400), mais estrito que `whitelist: true`, que só descartaria.

## 6. Pendências

Nenhuma sobre o contrato. Este documento é a referência a manter; mudanças futuras passam pela análise do `11-06`.
