# Roteiro de conclusão do UC03 — Publicar Serviço

**Repositório:** `MindHub-DSC/Mindhub` · **Branch principal:** `main` · **Épico:** [#35](https://github.com/MindHub-DSC/Mindhub/issues/35)
**Data da inspeção:** 24/11/2026 · **Responsável:** @leohsm
**Fontes:** Épico #35 e Sub-Issues no GitHub (`gh issue view`), `gh pr list --state all`, GitHub Project (colunas `Backlog, Ready, In Progress, In Review, Done`), artefatos `12-01` a `12-08` (Cenário B, preservação) e a proteção da `main` (`gh api …/branches/main/protection`).

> Todos os números abaixo foram lidos do repositório em 24/11/2026. O que não pôde ser verificado está marcado como **a confirmar**. Este documento **não executa** merges nem fecha Issues: é um roteiro para você conduzir.

---

## Seção 1 — O UC03 já está concluído?

**Resposta curta: ainda não.** O que foi pedido nos Materiais 01 a 12 está entregue e verificado, mas o **Épico #35 tem duas Sub-Issues sem começar (#39 e #41)** e todo o código ainda está em Draft PRs, fora da `main`.

### 1.1 Dimensão técnica e didática (Materiais 01 a 12)

| Item | Situação | Evidência real |
| --- | --- | --- |
| **CA1** — Perfil `ATIVO` publica Reserva Direta (com condições) ou Sob Proposta | **Atendido** (na cadeia de PRs, fora da `main`) | `POST /servicos` com 201 nas duas modalidades, na API containerizada e nos testes (`11-07`, `10-07`); #36, #38 e #40 com critérios marcados |
| **CA2** — Perfil `SUSPENSO`, ator sem perfil, modelo ausente e Reserva Direta sem condições são recusados sem registrar nada | **Atendido segundo os testes; a confirmar na revisão** | 403, 404, 400 e 422 mapeados (`servicos.http.spec.ts`, E2E); 404/400/422 vistos na API real (`11-04`); 403 só com serviço simulado |
| **CA3** — Um perfil publica vários Serviços | **Atendido** | FK sem `UNIQUE` (1 perfil : 0..* Serviços), `listarPorPerfil` no contrato; vários Serviços criados para o mesmo perfil nas verificações |
| **CA4** — Concorrência com suspensão (TC-C2-01) | **NÃO atendido** | #39 em `Backlog`, 0 de 4 critérios; a decisão **D-UC03-06** (estratégia de consistência) não está registrada em nenhum comentário |
| **CA5** — Testes do UC03 e dos anteriores passam juntos; `lint` e `build` sem erros | **Atendido na ponta da cadeia, não na `main`** | `pnpm test` 112, `pnpm test:e2e` 35, `pnpm build` exit 0, `pnpm lint` 0/0 em `472cdac` (`12-06`); a `main` ainda não tem o código do UC03 |
| Persistência real (Material 09) | Concluído | #37, 5 de 5 critérios; PR #139 |
| Containerização (Material 10) | Concluído | #141, 5 de 5; PR #142; revalidada em ambiente limpo (`10-07`, seções 12 e 13) |
| Contrato HTTP (Material 11) | Concluído | #144; PR #145; `paraResposta` com teste de não exposição |
| Auditoria arquitetural (Material 12) | Concluído (preservar) | #147; parecer em `12-08`, PR #148 |
| Documentação do UC03 e do endpoint (#41) | **Não feita** | #41 em `Backlog`, 0 de 3 critérios; o `requests.http` não tem exemplo de `/servicos` |
| Decisões D-UC03-01, 02 e 05 (exigidas para concluir o Épico) | Registradas | D-01/02/03 em comentário da #36; D-05 e D-07 em comentário do #35 |

**Condições de conclusão do Épico (texto do #35):** todas as Sub-Issues em `Done`, critérios gerais verificados por testes e as decisões D-UC03-01, D-UC03-02 e D-UC03-05 registradas. Hoje só a terceira condição está cumprida.

### 1.2 Dimensão de governança no GitHub

O Épico **não deve ser encerrado automaticamente** (nem por palavra-chave `Closes` em PR) porque:

1. **#39 e #41 estão pendentes** e o critério CA4 ainda não foi verificado.
2. **Nenhum PR foi revisado por outra pessoa nem integrado**: `main` exige 1 aprovação (ver Passo 3) e o código só existe em Draft PRs.
3. As Sub-Issues só viram `Done` depois da integração e do fechamento rastreável de cada uma.
4. Há Sub-Issues fora da lista do corpo do Épico (#141, #144 e #147, criadas nos Materiais 10 a 12) que precisam ser registradas nele antes do encerramento.

---

## Seção 2 — Mapa atual da cadeia de Pull Requests

Cadeia **empilhada** (cada PR aponta para a branch do anterior), lida com `gh pr list`:

```text
main ◄── PR #131 (Draft)  feature/36-uc03-modelar-servico            [#36  Material 04–06: modelo do Serviço]
            ◄── PR #134 (Draft)  feature/38-uc03-publicar-servico     [#38  serviço de aplicação]
                  ◄── PR #135 (Draft)  feature/40-uc03-endpoint-publicar-servico   [#40  endpoint, Material 07/08]
                        ◄── PR #139 (Draft)  feature/37-uc03-persistir-servico     [#37  Material 09: PostgreSQL]
                              ◄── PR #142 (Draft)  feature/141-uc03-containerizar-backend   [#141 Material 10: Docker]
                                    ◄── PR #145 (Draft)  feature/144-uc03-contrato-http     [#144 Material 11: contrato HTTP]
```

PRs de **documentação**, independentes, todos direto para `main` (abertos, não Draft):

| PR | Branch | Conteúdo |
| --- | --- | --- |
| #143 | `docs/material-10-uc03` | Artefatos do Material 10 |
| #146 | `docs/material-11-uc03` | Artefatos do Material 11 |
| #148 | `docs/material-12-uc03` | Artefatos do Material 12 e este roteiro |

Já integrados na `main`: #132, #133, #136, #137, #138, #140 (documentação dos Materiais anteriores), #34 (UC02) e #9.

O Material 12 **não gerou PR de código** (Cenário B). Sem a branch do #147, o último elo da cadeia de código é o PR #145.

> A cadeia tem 6 PRs de código, então o Passo 4 repete 6 ciclos. Os PRs #143, #146 e #148 não dependem da cadeia e podem ser integrados antes, depois ou entre os ciclos.

---

## Seção 3 — Passo a passo operacional

Pré-requisito: `gh auth status` deve mostrar `Logged in to github.com account leohsm`. Os comandos assumem a raiz do repositório local.

### Passo 1 — Publicar o parecer arquitetural do Material 12

**O quê:** colocar o parecer (`12-08`) à vista dos revisores, no PR de código que será revisado.
**Por quê:** o revisor precisa da decisão "preservar" e das evidências antes de aprovar; o Material 12 não gerou PR próprio de código.
**Como (CLI):** o `12-08` está na branch `docs/material-12-uc03` (PR #148); leia de lá sem mudar de branch:

```bash
git fetch origin
git show origin/docs/material-12-uc03:docs/planejamento/uc03/12-08-revisao-github-checklist.md > /tmp/parecer-12-08.md
gh pr comment 145 --body-file /tmp/parecer-12-08.md        # PR de código no topo da cadeia
gh issue comment 147 --body-file /tmp/parecer-12-08.md     # opcional: rastreabilidade na Issue
```

**Como (Web):** abra o PR #145 → caixa de comentário → cole o conteúdo do `12-08` → *Comment*.
**Versionar os artefatos:** já estão commitados e publicados no PR #148 (não é preciso `git add`/`commit` novos). Só edite o `12-08` se a revisão pedir.

### Passo 2 — Retirar os PRs do modo Draft

**O quê:** marcar como prontos para revisão os 6 PRs de código.
**Por quê:** PR Draft não pode ser integrado e sinaliza trabalho em andamento; antes de tirar do Draft, confirme que a descrição de cada PR está completa.
**Como (CLI):**

```bash
for n in 131 134 135 139 142 145; do gh pr ready $n; done
```

**Como (Web):** em cada PR, botão **Ready for review** (acima da caixa de comentários).
Depois disso, o PR #148 (documentação) e os demais permanecem como estão.

### Passo 3 — Realizar a revisão técnica humana

**O quê:** revisar cada PR e aprovar.
**Por quê:** a `main` está protegida e exige **1 aprovação** (`required_approving_review_count: 1`; `enforce_admins: false`). Nenhuma aprovação foi declarada neste projeto.
**Como (Web):** em cada PR → aba **Files changed** → confira:
- não há `.env`, senhas, dumps nem arquivos de `node_modules` (no `compose.yaml` as credenciais são só interpolações `${…}`);
- o diff do PR contém só o que a descrição diz (por exemplo, o #145 altera apenas `publicar-servico.dto.ts` e `servicos.http.spec.ts`);
- **Review changes** → *Approve* (ou *Request changes*).

**Como (CLI):** `gh pr diff 145` para ler e `gh pr review 145 --approve --body "Revisado: …"`.

> **Importante:** o GitHub **não permite que você aprove o seu próprio PR**. **A confirmar:** quem será o revisor. A API lista um único colaborador (`leohsm`, admin). Se não houver outra pessoa, o bloqueio só pode ser contornado com merge de administrador (Passo 4, opção `--admin`), o que é uma decisão de governança da equipe e deve ficar registrada no PR. Os PRs cujo destino não é a `main` (por exemplo, #134 → `feature/36-…`) não têm essa exigência enquanto a base não for a `main`.

### Passo 4 — Merge sequencial seguro da cadeia até a `main`

**O quê:** integrar #131, #134, #135, #139, #142 e #145 na `main`, nessa ordem.
**Por quê:** cada PR contém os commits do anterior; integrar de baixo para cima mantém a história linear e evita conflitos.

> [!WARNING]
> **Risco de *Stacked PRs*:** **não use `--delete-branch` (nem marque "Delete branch") antes de redirecionar o PR seguinte para a `main`.** Apagar a branch base **fecha automaticamente** o PR dependente (o repositório não apaga branches sozinho: `deleteBranchOnMerge: false`). Sequência segura em cada ciclo: (1) fazer o merge **sem** apagar a branch; (2) apontar o PR seguinte para a `main`; (3) só então, se quiser, apagar a branch já integrada.

**Como (CLI)** — repita para cada par (PR atual → PR seguinte). O repositório aceita *merge commit*, *squash* e *rebase*; use **merge commit** (`--merge`), que preserva os hashes dos commits dos PRs seguintes. **Não use `--squash`/`--rebase` em cadeia empilhada**, porque reescreve os commits e provoca conflitos nos PRs de cima.

```bash
# Ciclo 1: #131 já aponta para main
gh pr merge 131 --merge                       # (com aprovação, ou --admin se for decisão da equipe)
gh pr edit 134 --base main                    # redireciona o seguinte ANTES de apagar qualquer branch

# Ciclo 2
gh pr merge 134 --merge
gh pr edit 135 --base main

# Ciclo 3
gh pr merge 135 --merge
gh pr edit 139 --base main

# Ciclo 4
gh pr merge 139 --merge
gh pr edit 142 --base main

# Ciclo 5
gh pr merge 142 --merge
gh pr edit 145 --base main

# Ciclo 6 (último)
gh pr merge 145 --merge
```

Depois de **cada** `gh pr edit … --base main`, confira que o PR continua aberto e sem conflito:
`gh pr view 134 --json state,baseRefName,mergeable`. Se aparecer conflito, **pare** e resolva antes de seguir (não force).

PRs de documentação (independentes, qualquer ordem, mas só depois de revisados):

```bash
gh pr merge 143 --merge
gh pr merge 146 --merge
gh pr merge 148 --merge
```

**Como (Web):** em cada PR, **Merge pull request → Create a merge commit**, sem marcar *Delete branch*; depois, no PR seguinte, **Edit** (ao lado do título) → mude *base* para `main` → *Save*.

**Atualizar a branch local e validar na `main`** (scripts reais de `mindhub-backend/package.json`):

```bash
git switch main && git pull origin main
cd mindhub-backend
cp .env.example .env              # se ainda não existir; troque a senha (o .env é ignorado pelo Git)
pnpm install --frozen-lockfile
pnpm build
pnpm lint
pnpm db:up                        # sobe só o postgres
pnpm test                         # esperado hoje: 112 testes
pnpm test:e2e                     # esperado hoje: 35 testes, no banco *_test
docker compose up -d --build api  # opcional: reconfirma a API containerizada
```

Os números esperados vêm do `12-06` e só valem se nada mudar no meio do caminho. Se algo falhar na `main`, **não feche nenhuma Issue**: investigue primeiro.

### Passo 5 — Concluir e fechar as Sub-Issues e atualizar o GitHub Project

**Por quê:** as Sub-Issues só devem ser fechadas depois que a entrega está na `main`; os PRs usam `Refs #n` (não `Closes`), então nada fecha sozinho.

| Sub-Issue | Entrega | PR | Pode fechar após o Passo 4? |
| --- | --- | --- | --- |
| #36 Modelar o Serviço | Domínio `Servico` | #131 | Sim |
| #38 Serviço de aplicação | `PublicarServico` | #134 | Sim |
| #40 Endpoint e erros | `POST /servicos` | #135 | Sim |
| #37 Persistir com TypeORM | Migration e adaptador | #139 | Sim |
| #141 Containerização | Dockerfile e serviço `api` | #142 | Sim |
| #144 Contrato HTTP | `paraResposta` e testes | #145 | Sim, **depois de marcar os critérios** (hoje 0 de 5) |
| #147 Auditoria | Parecer 12-01 a 12-08 | #148 | Sim, **depois da revisão do parecer** e de marcar os critérios (0 de 5) |
| **#39 Concorrência** | **Não implementada** | — | **Não**: 0 de 4 critérios, em `Backlog` |
| **#41 Documentação** | **Não feita** | — | **Não**: 0 de 3 critérios, em `Backlog` |

**Marcar os critérios de #144 e #147** (só depois de revisar; troca `- [ ]` por `- [x]`):

```bash
for n in 144 147; do
  gh issue view $n --json body --jq .body | sed 's/^- \[ \]/- [x]/' > /tmp/body-$n.md
  gh issue edit $n --body-file /tmp/body-$n.md
done
```
(Web: abra a Issue → **⋯ → Edit** → clique nas caixas.)

**Fechar (apenas as que estiverem prontas):**

```bash
gh issue close 36  --comment "Entregue no PR #131, integrado na main. Critérios 6/6 verificados."
gh issue close 38  --comment "Entregue no PR #134, integrado na main."
gh issue close 40  --comment "Entregue no PR #135 (POST /servicos), integrado na main."
gh issue close 37  --comment "Entregue no PR #139 (persistência PostgreSQL), integrado na main."
gh issue close 141 --comment "Entregue no PR #142 (containerização), integrado na main."
gh issue close 144 --comment "Entregue no PR #145 (contrato HTTP), integrado na main."
gh issue close 147 --comment "Parecer do Material 12 (preservação) no PR #148, integrado na main."
```

**Project (coluna `Done`)** — o fechamento da Issue pode mover o card sozinho conforme a automação do quadro (**a confirmar**); confira e, se necessário:

```bash
gh project item-edit 1 --owner MindHub-DSC --url https://github.com/MindHub-DSC/Mindhub/issues/36 --field Status --value "Done"
# repita para 37, 38, 40, 141, 144 e 147
gh project item-list 1 --owner MindHub-DSC --limit 100
```
(Web: quadro **Planejamento - Mindhub** → arraste o card para **Done**.) #39 e #41 continuam em `Backlog` (ou `Ready`, ao serem planejadas).

### Passo 6 — Marcar os checkboxes e encerrar formalmente o Épico

> [!IMPORTANT]
> **Este passo só pode ser feito depois que #39 e #41 forem implementadas, integradas e fechadas.** Hoje o Épico **não** pode ser encerrado.

Antes do Passo 6, resta o seguinte (novo ciclo de trabalho, a partir da `main` já atualizada):

1. **#39 — Concorrência (CA4):** registrar a decisão **D-UC03-06** (estratégia de consistência) em comentário da #39 e implementar bloqueio ou versão do perfil na mesma transação, com teste de concorrência repetido contra o banco de testes. Nova branch a partir da `main`.
2. **#41 — Documentação:** `requests.http` com exemplos de publicação (Reserva Direta e Sob Proposta) e das recusas, README com limitações e decisões, e incluir as pendências **A1** (comentários desatualizados) e **A6** (dois formatos de erro) dos artefatos `12-03`/`12-07`.
3. Repetir os Passos 1 a 5 para esses dois PRs.

Quando tudo estiver integrado e verificado:

**Marcar as Sub-Issues e os critérios no corpo do Épico** (inclui acrescentar #141, #144 e #147 à lista):

```bash
gh issue view 35 --json body --jq .body > /tmp/epic.md
# Edite /tmp/epic.md: marque "- [x]" nas Sub-Issues #36..#41 e nos CA1..CA5 efetivamente verificados,
# e acrescente as linhas "- [x] #141", "- [x] #144" e "- [x] #147".
gh issue edit 35 --body-file /tmp/epic.md
```
(Web: Issue #35 → **⋯ → Edit**.)

**Encerrar e conferir:**

```bash
gh issue close 35 --comment "UC03 concluído: Sub-Issues #36–#41, #141, #144 e #147 fechadas e integradas na main; critérios CA1–CA5 verificados por testes (pnpm test, pnpm test:e2e), build e lint sem erros; decisões D-UC03-01, 02 e 05 registradas."
gh project item-edit 1 --owner MindHub-DSC --url https://github.com/MindHub-DSC/Mindhub/issues/35 --field Status --value "Done"
gh issue view 35 --json state,projectItems
```
Confirme o card do Épico em **Done**.

---

## Resumo do que está a confirmar

- Quem fará a revisão humana dos PRs e se haverá merge de administrador (`--admin`) na `main`.
- Se a automação do quadro move o card para `Done` ao fechar a Issue.
- Estado de conflito dos PRs #143 e #146 (`mergeable` ainda `UNKNOWN` na inspeção).
- Os 4 *reviews* já registrados no PR #131 não foram lidos (não se sabe se aprovam).

## Cuidados gerais

- Não use `docker compose down -v`, `migration:revert` automático nem `synchronize: true` em nenhuma validação.
- Não coloque `.env` nem senhas em comentários de PR ou Issue.
- Não declare aprovação ou conclusão antes de ela acontecer.
