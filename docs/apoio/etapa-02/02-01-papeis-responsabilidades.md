# 02-01 — Matriz de papéis e responsabilidades

**Caso de uso:** UC02 — Cadastrar Perfil de Especialista (épico [#1](https://github.com/MindHub-DSC/Mindhub/issues/1))
**Equipe:** um integrante. Trabalho individual informado pelo estudante em 10/11/2026.

## Integrante

| Nome | GitHub | Função principal | Funções acumuladas |
| --- | --- | --- | --- |
| Leonardo Herrero S. Martins | @leohsm | Desenvolvedor | Coordenador, Responsável Técnico, Revisor de Issues |

## Responsabilidades por papel

| Papel | Responsabilidades | Atividades |
| --- | --- | --- |
| Coordenador | Acompanhar o board, respeitar o limite de WIP, registrar impedimentos e decisões nas issues | Épico #1 |
| Responsável Técnico | Decidir D1 (origem da identidade), acordar os contratos de SUB-01, SUB-02 e SUB-03, garantir aderência às ADRs do Trabalho 4 | #2, #3, #4, #6 |
| Desenvolvedor | Executar as Sub-Issues e anexar evidências (PR, testes) | #2 a #8 |
| Revisor de Issues | Revisar descrição e critérios de aceite antes de cada issue ir para `Ready`; registrar o resultado com o template do [02-05](02-05-comentarios-github.md) | #2 a #8 |

## Justificativa

Com um único integrante, todos os papéis recaem sobre a mesma pessoa. A consequência mais relevante é que a **revisão não é independente**: a revisão de issues é uma autorrevisão. Para reduzir o risco, adotam-se:

- critérios de aceite verificáveis por teste, e não por opinião;
- uma pré-análise automatizada (assistente de IA) como segunda leitura, registrada separadamente da revisão humana;
- registro escrito das decisões, para que possam ser auditadas pelo professor.

O assistente de IA **não é integrante da equipe** e não exerce papel funcional; ele apenas produz a pré-análise.

## Papel, permissão e atribuição

| Conceito | Significado neste projeto |
| --- | --- |
| Papel funcional | O que a pessoa faz (coordenar, decidir, desenvolver, revisar) |
| Permissão no GitHub | O que a conta pode fazer no repositório (ver [02-02](02-02-matriz-permissoes.md)) |
| Atribuição (assignee) | Quem executa uma issue específica (ver [02-03](02-03-distribuicao-sub-issues.md)) |

Ser Coordenador ou Responsável Técnico não exige, por si só, permissão de administrador. Aqui o integrante é `Admin` porque é o único mantenedor do repositório (ver 02-02).
