# 12-04 — Priorização e decisões

**Caso de uso:** UC03 — Publicar Serviço (épico [#35](https://github.com/MindHub-DSC/Mindhub/issues/35))
**Issue:** [#147](https://github.com/MindHub-DSC/Mindhub/issues/147)
**Data:** 24/11/2026

Só entram aqui os achados registrados no `12-03`. As hipóteses H1 a H5 foram descartadas com evidência e **não** são avaliadas como problema. A escala é **julgamento técnico** (baixo/médio/alto), não uma métrica objetiva.

## 1. Matriz de decisão

| Achado | Evidência | Impacto | Risco de mexer | Benefício | Esforço | Dependências | Cobertura | Prioridade | Decisão |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| A1 — comentários desatualizados (porta e memória) | `servicos.repositorio.ts:5`, `servicos.em-memoria.ts:6-7` | Baixo (documentação) | Muito baixo (só comentário) | Pequeno: o texto passa a dizer a verdade | Muito baixo | Nenhuma | Nenhuma necessária (não muda comportamento) | **Baixa**: não é falha de arquitetura e uma troca só de comentário seria alteração cosmética isolada | **Adiar** e registrar como dívida; corrigir junto da documentação do UC03 (#41), que já mexe no texto do UC |
| A2 — dublê de teste em `src/` | `grep` de usos | Baixo | Médio (mover arquivo muda imports de 5 testes e do contrato) | Pequeno: imagem um pouco menor | Baixo | 5 specs, módulo | Suítes de contrato e composição | **Baixa** | **Preservar** |
| A3 — métodos da porta sem uso em produção | `grep` em `src/` | Nenhum | Alto se removidos (quebra o critério 6 da #36 e a #39) | Nenhum | — | #36, #39 | Suíte de contrato nas duas implementações | **Nenhuma** | **Preservar** |
| A4 — entrada, saída e mapper no mesmo arquivo | `publicar-servico.dto.ts` | Baixo | Baixo | Pequeno hoje | Baixo | Controller, 2 specs | Teste HTTP (contrato fechado) | **Baixa**: 68 linhas, um único endpoint | **Preservar**; gatilho: separar quando entrar um segundo endpoint de Oferta com DTOs próprios |
| A5 — filtro compartilhado importa erro de infra | linha 3 do filtro | Baixo | Médio | Pequeno | Baixo | 2 contextos | Testes de erros de banco e HTTP | **Baixa** | **Preservar** |
| A6 — dois formatos de erro | `11-04` | Médio (para consumidores) | Alto (muda contrato HTTP) | Médio | Médio | Todos os filtros e consumidores | Testes HTTP dos 3 endpoints | **Média, mas é contrato, não arquitetura** | **Investigar**/tratar na #41 com análise de compatibilidade (`11-06`); fora deste material |

## 2. Alternativas consideradas

| Alternativa | Por que não |
| --- | --- |
| Corrigir A1 agora, em PR de código | Seria um commit de comentário sem risco demonstrável; o material pede para não alterar código só para gerar diff |
| Mover `ServicosEmMemoria` para `test/support` | Mexe em 5 arquivos de teste para ganho irrelevante em execução |
| Unificar os formatos de erro | Altera o contrato HTTP estabilizado no Material 11 e exigiria a análise de compatibilidade e versão |
| Separar DTOs de entrada e saída | Sem segundo endpoint, só geraria arquivos |
| Introduzir `ClassSerializerInterceptor` ou camadas extras | Sem problema que o justifique |

## 3. Decisão

**Preservar a implementação atual.** Nenhum problema comprovado que justifique refatoração imediata. Dívidas registradas: **A1** (corrigir na #41) e **A6** (tratar com análise de compatibilidade na #41). Gatilhos: A4 (segundo endpoint de Oferta) e A2/A5 (se a imagem ou a estrutura de pastas virar requisito).
