# 12-03 — Auditoria de responsabilidades

**Caso de uso:** UC03 — Publicar Serviço (épico [#35](https://github.com/MindHub-DSC/Mindhub/issues/35))
**Issue:** [#147](https://github.com/MindHub-DSC/Mindhub/issues/147) · **Código:** `feature/144-uc03-contrato-http` @ `472cdac`
**Data:** 24/11/2026

Classificação: **Observação** (característica do código) · **Problema** (risco técnico demonstrável) · **Evidência**. Uma observação não é, por si, um problema.

## 1. Matriz de componentes

| Componente | Responsabilidade esperada | Observado | Evidência | Adequado? |
| --- | --- | --- | --- | --- |
| `ServicosController` | Receber e responder HTTP | Recebe o corpo validado, chama `executar`, devolve `paraResposta(...)`; 26 linhas, sem regra | `servicos.controller.ts` | Sim |
| DTO de entrada | Representar e validar a entrada | `z.strictObject`; só formato; invariantes ficam no domínio | `publicar-servico.dto.ts:14-27` | Sim |
| DTO de resposta | Definir o contrato público | `ServicoResponse` com 7 campos | idem `:31-44` | Sim |
| Mapper HTTP | Entidade → resposta pública | Cópia explícita, inclusive `condicoes` (Material 11) | idem `:46-68`; teste de não exposição | Sim |
| `PublicarServico` | Coordenar o caso de uso | Busca perfil, checa situação, delega a `Servico.publicar`, persiste; relógio injetável | `publicar-servico.ts` | Sim |
| `ServicosRepositorio` | Contrato de persistência | 3 métodos, só tipos de domínio | `servicos.repositorio.ts` | Sim (ver A2, A3) |
| `ServicosTypeOrmRepositorio` | Implementar persistência | `insert`, `findOneBy`, `find` ordenado; traduz falha de conexão | `servicos.typeorm-repositorio.ts` | Sim |
| `ServicoMapper` | Adaptar domínio ↔ persistência | Sem regra de negócio; falha de dado vira `RegistroDeServicoCorrompido` | `servico.mapper.ts` | Sim |
| `ServicoOrmEntity` | Mapear o esquema | Tabela, FK, 6 CHECKs, `ordem` técnica | `servico.orm-entity.ts` | Sim |
| `OfertaModule` | Compor dependências | `useFactory` com tokens; domínio/aplicação sem decorators | `oferta.module.ts` | Sim |

## 2. Os oito critérios

| # | Critério | Conclusão (no escopo verificado) | Evidência |
| --- | --- | --- | --- |
| 1 | Separação de responsabilidades | Não revelou inadequação | Camadas respeitadas; nenhum import de framework/ORM em domínio e aplicação; Controller sem ORM (`12-02`, seção B) |
| 2 | Acoplamento | Não revelou inadequação (uma observação: A5) | Dependências apontam para as portas; adaptador é o único a conhecer o ORM |
| 3 | Coesão | Uma observação (A4) | Cada classe com um papel; `publicar-servico.dto.ts` reúne entrada, saída e mapper HTTP |
| 4 | Duplicação | Não revelou inadequação | `paraResposta` é a única construção da resposta; `responderErro` é compartilhado pelos filtros |
| 5 | Legibilidade | Uma observação (A1) | Comentários explicam as decisões; dois comentários de código estão desatualizados |
| 6 | Testabilidade | Não revelou inadequação | Portas com contrato testado em duas implementações; serviço com relógio injetável; HTTP com serviço simulado; integração e E2E com PostgreSQL de testes |
| 7 | Estabilidade dos contratos | Uma observação (A6) | Contrato fechado por `toEqual`; dois formatos de erro coexistem |
| 8 | Configuração e composição | Não revelou inadequação | Token `Symbol` + `useFactory`; `servicos.composicao.spec.ts` cobre o erro clássico de provider |

## 3. Hipóteses do material, descartadas com evidência

| # | Hipótese | Resultado | Evidência |
| --- | --- | --- | --- |
| H1 | Controller acessa o ORM diretamente | **Descartada** | `grep` em `*/http`: nenhum `typeorm`/`Repository`/`infra/` (exceto o filtro compartilhado, A5) |
| H2 | Service depende de infraestrutura | **Descartada** | `grep` em `*/dominio */aplicacao`: nenhum import de `@nestjs`, `typeorm`, `pg`, `express`, `zod` |
| H3 | Repository abstrato expõe tipos do ORM | **Descartada** | `servicos.repositorio.ts` só importa `Servico` |
| H4 | Mapeamento HTTP duplicado no Controller | **Descartada** | `paraResposta` único; Controller não monta objeto de resposta (Material 11) |
| H5 | Providers inconsistentes | **Descartada** | Token e adaptador ligados em `OfertaModule`; spec de composição; contêiner sobe com a rota mapeada |

## 4. Achados (observações, nenhuma confirmada como problema)

| ID | Componente | Observação | Evidência | Risco técnico | Conclusão |
| --- | --- | --- | --- | --- | --- |
| A1 | Comentários de `servicos.repositorio.ts` e `servicos.em-memoria.ts` | Dizem que a TypeORM "terá" #37 e que a aplicação usa a memória "provisoriamente" e "perde registros ao reiniciar". A #37 já está feita e a aplicação usa o PostgreSQL | `servicos.repositorio.ts:5`; `servicos.em-memoria.ts:6-7`; `oferta.module.ts:52` já está correto | Baixo: leitor pode concluir que a aplicação roda em memória | Dívida de documentação; não é problema de arquitetura |
| A2 | `ServicosEmMemoria` | Dublê de teste mora em `src/oferta/infra` e entra em `dist`/imagem; só testes o usam | `grep`: usos em `test/` e no comentário do módulo | Baixo: código extra na imagem, sem efeito em execução | Observação; preservar (é a segunda implementação do contrato) |
| A3 | Porta `ServicosRepositorio` | `buscarPorId` e `listarPorPerfil` não têm uso em produção, só no contrato/testes | `grep` em `src/`: nenhum chamador | Nenhum: estão no critério 6 da #36 e a #39 (concorrência) tende a usá-los | Preservar |
| A4 | `publicar-servico.dto.ts` | Entrada, saída e mapper HTTP no mesmo arquivo (68 linhas) | arquivo | Baixo hoje; cresce se entrarem mais endpoints | Observação; registrar como gatilho para separar |
| A5 | `compartilhado/http/armazenamento-indisponivel.filter.ts` | A camada HTTP compartilhada importa o erro de `compartilhado/infra` | linha 3 | Baixo: é uma classe de erro neutra, traduzida a 503 genérico | Observação; preservar |
| A6 | Respostas de erro | Dois formatos: pipe/Nest (`{message, error, statusCode}`) e domínio/aplicação (`{statusCode, message}`) | `11-04` | Médio para consumidores; é contrato HTTP, não estrutura interna | Já decidido no Material 11 (D-UC03-07); tratar na #41, não refatorar aqui |

## 5. Pontos adequados

Domínio e aplicação puros; dependência invertida por portas; adaptador com tradução de falha de conexão e `insert` (não `save`); mapper de persistência sem regras; contrato HTTP protegido por teste fechado; composição explícita por token; limpeza dos testes com `DELETE` filtrado e banco `_test` obrigatório.

## 6. Limitações

Auditoria por leitura do código e execução das suítes; sem análise de concorrência (#39), carga ou segurança. Aprovação de testes não prova ausência de defeitos. 403 e 503 só em teste com serviço simulado. Vale para a cadeia de PRs Draft, não para a `main`.

## 7. Conclusão

Os oito critérios foram examinados e **não revelaram inadequação arquitetural no escopo verificado**. Há cinco observações de baixo risco (A1–A5) e uma já decidida no Material 11 (A6).
