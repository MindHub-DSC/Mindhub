# 02-02 — Matriz de permissões do GitHub

**Caso de uso:** UC11 — Reagendar Sessão (épico [#69](https://github.com/MindHub-DSC/Mindhub/issues/69))  
**Equipe:** um integrante (Leonardo Herrero S. Martins, @leohsm), trabalho individual.  
**Data:** 11/11/2026

Esta matriz é uma **recomendação de governança**. Ela não altera permissões reais; isso depende dos administradores do repositório.

| Integrante | Papel funcional | Operações no repositório | Permissão recomendada | Acesso ao Project | Justificativa |
| --- | --- | --- | --- | --- | --- |
| @leohsm | Desenvolvedor, Coordenador, Responsável Técnico, Revisor | Editar issues, comentar, abrir branches e PRs, mover itens no board | `Write` no dia a dia; `Admin` só enquanto for o único mantenedor | Edição do Project `Planejamento - Mindhub` | Menor privilégio: `Write` cobre o desenvolvimento e a revisão de planejamento; `Admin` só se justifica por não haver outro administrador |

## Repositório e Project são coisas diferentes

- A permissão do **repositório** define quem altera issues e código. A do **Project** é separada e define quem move itens entre colunas.
- Níveis do repositório: `Read`, `Triage`, `Write`, `Maintain`, `Admin`.
- *Decisão da equipe:* se entrarem novos integrantes, devolver `Admin` ao mínimo necessário (`Write` para desenvolver, `Triage` para quem só revisa issues).
- *Não verificado:* a permissão real da conta no repositório não foi alterada nem auditada nesta etapa.
