# 05-06 — Análise preliminar de qualidade

**Caso de uso:** UC03 — Publicar Serviço (épico [#35](https://github.com/MindHub-DSC/Mindhub/issues/35))
**Sub-Issue:** [#36](https://github.com/MindHub-DSC/Mindhub/issues/36)
**Código analisado:** `mindhub-backend/src/oferta/dominio/servico.ts` (estado GREEN)
**Data:** 12/11/2026

> Esta análise só **identifica** melhorias. Nada aqui foi aplicado: as alterações ficam para o REFACTOR (Material 06), com a suíte verde como rede de segurança.

## Diagnóstico

| Aspecto | Avaliação |
| --- | --- |
| Nomes | Bons. `publicar`, `perfilId`, `modeloContratacao` e `situacao` vêm da linguagem do UC03 e seguem o padrão do `PerfilEspecialista` (`cadastrar`, `usuarioId`) |
| Separação de responsabilidades | Correta: o agregado é puro, sem Nest, ORM ou HTTP. Não há persistência no domínio |
| Duplicação | Pequena e estrutural: o padrão "construtor privado + getters" se repete com o `PerfilEspecialista`. Ainda não justifica abstração |
| Exceções e bordas | Frágil de propósito: nenhuma entrada é validada (título vazio, `perfilId` vazio, modelo fora do tipo em tempo de execução) |
| Complexidade | Ciclomática 1 em todos os métodos. Fácil de ler |

## Pontos fortes

- O estado é imutável: campos `private readonly`, sem setters.
- O agregado só nasce por `publicar`, porque o construtor é privado.
- O contrato do RED ficou intacto (assinatura e getters).
- O formato segue o agregado irmão, então a próxima pessoa reconhece o padrão.
- Só um arquivo foi alterado e a mudança é fácil de revisar.

## Débitos técnicos e fragilidades

| # | Débito | Impacto |
| --- | --- | --- |
| D1 | A classe `NaoImplementado` continua exportada sem nenhum uso | Código morto que confunde quem lê o domínio |
| D2 | Parâmetro `agora` recebido e ignorado | O contrato sugere um dado temporal que não é guardado |
| D3 | Sem invariantes: título, descrição e `perfilId` aceitam string vazia | Viola D-UC03-01 quando chegar dado real |
| D4 | `SituacaoServico` só tem `'PUBLICADO'`, e não há um objeto equivalente a `SituacaoPerfil` | Inconsistente com `situacao-perfil.ts` quando surgirem outras situações (suspenso, despublicado) |
| D5 | `ModeloContratacao` não é validado em tempo de execução | Dado vindo da API ou do banco pode ter valor fora do tipo |
| D6 | Não há erro de domínio próprio (`ServicoInvalido`), como `PerfilInvalido` em `erros.ts` | As validações futuras vão precisar dele |
| D7 | Falta `reconstituir` | Necessário para a #37 (persistência) |

## Backlog para o REFACTOR e os próximos ciclos

Separação importante: **refatoração** não muda comportamento. Os itens que mudam comportamento entram por **novo teste RED**, não pelo REFACTOR.

| Prioridade | Item | Tipo | Onde |
| --- | --- | --- | --- |
| 1 | Remover `NaoImplementado` (D1) | Refatoração | Material 06 |
| 2 | Comentário de classe: citar o critério e as decisões D-UC03-01 a 03 | Refatoração (documentação) | Material 06 |
| 3 | Decidir se `agora` fica na assinatura ou vira `publicadoEm` (D2) | Decisão + teste RED se for guardado | Registrar na #36 |
| 4 | Validar título/descrição com trim e mínimo de 1 caractere, e criar `ServicoInvalido` (D3, D6) | Novo comportamento | RED do critério 5 |
| 5 | Validar o Modelo de Contratação (D5) | Novo comportamento | RED do critério 2 |
| 6 | Condições vigentes da Reserva Direta | Novo comportamento | RED dos critérios 3 e 5 |
| 7 | Objeto `SituacaoServico` no padrão de `situacao-perfil.ts` (D4) | Refatoração quando houver segunda situação | Quando surgir |
| 8 | `reconstituir`, porta e adaptador em memória (D7) | Novo comportamento | RED do critério 6 |

## Riscos de arquitetura e recomendações

- **Merge sem as validações:** se o PR #131 fosse integrado agora, a #37 (persistência) e a #40 (API) consumiriam um agregado que aceita dados inválidos. Recomendação: manter o PR em Draft até os critérios 2 a 6 estarem cobertos.
- **Mudança de contrato vista pela #37:** decidir `agora`/`publicadoEm` (item 3) antes de a #37 modelar a tabela, para não precisar de migration extra.
- **Refatorar sem rede:** só refatore com `pnpm test` verde antes e depois de cada passo.
