# 02-02 — Matriz de permissões do GitHub

Esta matriz é uma **recomendação de governança**. Ela não altera permissões reais; isso depende de ação de um administrador.

## Níveis de permissão do repositório

| Nível | Uso típico |
| --- | --- |
| `Read` | Acompanhar código, issues e board |
| `Triage` | Gerenciar issues e labels, sem push |
| `Write` | Criar branches, fazer push e abrir Pull Requests |
| `Maintain` | Gerenciar o repositório sem acesso a configurações sensíveis |
| `Admin` | Configurações, membros, proteção de branches e exclusão do repositório |

## Matriz

| Integrante | Papel | Operações necessárias | Permissão no repositório | Acesso ao GitHub Project | Justificativa |
| --- | --- | --- | --- | --- | --- |
| Leonardo (@leohsm) | Todos os papéis | Criar labels, issues e Project; configurar o repositório; desenvolver e revisar | `Admin` (atual) | `Admin` (criador do Project) | Único mantenedor: alguém precisa administrar o repositório e a organização. Para o trabalho diário, `Write` bastaria |
| Professor (se convidado) | Avaliação | Ler issues, board e documentos | `Read` | `Read` | Menor privilégio para acompanhamento |
| Futuro integrante desenvolvedor | Desenvolvedor | Branches, PRs, comentários | `Write` | `Write` | Executa issues sem alterar configurações |
| Futuro revisor de issues | Revisor | Comentar, ajustar labels e critérios | `Triage` | `Write` (mover status) | Revisa planejamento sem push de código |

## Situação real verificada em 10/11/2026

- Colaboradores do repositório: apenas @leohsm, com `admin`.
- Token do GitHub CLI com escopos `repo`, `workflow`, `read:org` e `gist`, **sem** `project`. A criação do Project depende de `gh auth refresh -s project`.

## Recomendações de menor privilégio

- Se mais pessoas entrarem, conceder `Write` ou `Triage`, nunca `Admin` por conveniência.
- No token do GitHub CLI, manter somente os escopos necessários; `project` é necessário apenas para gerenciar o board.
- Em computador compartilhado, encerrar a sessão com `gh auth logout` ao final.
