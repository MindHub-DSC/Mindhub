# 01-11 — Checklist de validação

Situação em 10/11/2026, após a geração do planejamento. Os itens marcados dependem só dos artefatos; os itens em aberto dependem da execução manual no GitHub (roteiro [01-10](01-10-roteiro-operacional-github.md)).

- [x] Issue principal documentada, com objetivo, escopo, referências, critérios gerais e dependências ([01-03](01-03-issue-principal-epic.md)).
- [x] Pelo menos 5 Sub-Issues com justificativa técnica (7 Sub-Issues, [01-02](01-02-decomposicao-unidades-trabalho.md)).
- [x] Critérios de aceite claros, objetivos e verificáveis em cada Sub-Issue ([01-04](01-04-sub-issues.md)).
- [x] Dependências mapeadas sem ciclos ([01-06](01-06-matriz-dependencias.md)).
- [ ] Labels criadas e atribuídas no repositório (passos 2 a 4 do roteiro).
- [ ] GitHub Project `Planejamento - Mindhub` com os 5 estados, itens em `Backlog` (passo 8 do roteiro).
- [x] Estado inicial condizente com a fase de planejamento (todas em `Backlog`, [01-08](01-08-planejamento-github-project.md)).
- [x] Rastreabilidade com os requisitos do caso de uso, com lacunas declaradas ([01-05](01-05-matriz-rastreabilidade.md)).
- [x] Sem tarefas redundantes, inventadas ou divididas por fase de TDD.
- [x] Decisões não documentadas sinalizadas como proposta técnica ou dúvida documentada ([01-01](01-01-analise-tecnica.md) §9).
- [x] Nenhuma regra do CeliLac ou de outro projeto foi usada.
- [ ] Marcas **[PROP]** e dúvidas impeditivas do caso de uso revisadas e confirmadas pelo responsável (exigido por `docs/casos-de-uso.md` §9 antes de mover qualquer issue para `Ready`).
- [x] Marcas [PROP] e dúvidas tratadas como hipóteses explícitas, nunca como regras confirmadas.
- [x] Nenhuma Sub-Issue foi criada para separar fases de TDD (RED/GREEN).
