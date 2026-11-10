# 01-03 — Issue principal (Epic)

**Título:** `[UC06] Enviar Proposta`  
**Labels:** `usecase:uc06`, `domain:negociacao`, `type:epic`, `priority:high`  
**Responsável:** @leohsm  
**Estado inicial no board:** `Backlog`

O corpo abaixo, entre os marcadores, é publicado no GitHub. Os marcadores `{{SUB-XX}}` são substituídos pelos números reais após a criação das issues.

<!-- BODY:START -->
## Objetivo

Permitir que o Especialista destinatário de uma Solicitação `Enviada` envie uma Proposta com Condições Comerciais e, depois, novas versões enquanto a Proposta estiver `Enviada` ou `Em revisão`, preservando todas as versões como retratos imutáveis. Este épico fornece o modelo de Proposta consumido pelo UC07.

## Contexto e escopo

- **Contexto responsável:** C3 — Negociação e Contratação.
- **Arquitetura:** módulo de C3 no monólito modular, com persistência em memória e portas, como no UC05; a Proposta e a Versão são entidades distintas da Contratação (`trabalho4.md` §3.3).
- **Dentro do escopo:** Condições Comerciais, Agregado Proposta com Versões, consulta da Solicitação recebida, serviço de envio e de nova versão, aviso ao cliente, endpoints HTTP e documentação.
- **Fora do escopo:** aceitar (UC07), recusar, expirar e pedir revisão da Proposta (sem Caso de Uso, `casos-de-uso.md` §8), estado `Em elaboração`, ciclo da Solicitação (`Respondida`), autenticação.

## Referências

- `docs/casos-de-uso.md` — especificação de UC06
- `docs/trabalhos/trabalho3.md` — §5, §6, §8, §9, §10, §11
- `docs/trabalhos/trabalho4.md` — §3.3, §6.1, §6.3, §8.1, §9
- `docs/trabalhos/trabalho5.md` — §3, §5, §8, §9
- `docs/planejamento/uc05/` e `docs/planejamento/uc07/` — casos de uso vizinhos
- `docs/planejamento/uc06/` — artefatos deste planejamento

## Requisitos contemplados

| ID | Requisito |
| --- | --- |
| RN05 | A versão aceita é identificável: cada versão tem identificação própria. |
| RN13 | O Serviço Sob Proposta segue o caminho de Solicitação e Proposta. |
| INV-01 | Proposta — Versão `1 : 1..*` após o primeiro envio; Versão é objeto de valor. |

**Fluxos:** passo 1 a 5 do fluxo principal; FA-01, FA-02, FE-01, FE-02, FE-03, FE-04, FE-05, FE-06.

## Sub-Issues planejadas

- [ ] {{SUB-01}} — [C3] Modelar as Condições Comerciais
- [ ] {{SUB-02}} — [C3] Modelar a Proposta, suas Versões e o repositório em memória
- [ ] {{SUB-03}} — [C3] Expor a Solicitação recebida ao Especialista destinatário
- [ ] {{SUB-04}} — [C3] Implementar os serviços de aplicação Enviar Proposta e Enviar Nova Versão
- [ ] {{SUB-05}} — [C3] Expor os endpoints de Proposta e verificar o envio de ponta a ponta
- [ ] {{SUB-06}} — [C3] Documentar o UC06 e os endpoints

## Critérios gerais de aceite

- [ ] O Especialista destinatário envia uma Proposta `Enviada` com versão 1 para uma Solicitação `Enviada` sem Proposta.
- [ ] Nova versão em Proposta `Enviada` ou `Em revisão` torna a Proposta `Em revisão` e a nova versão vigente, preservando as anteriores.
- [ ] Solicitação de outro especialista, Solicitação com Proposta, Proposta `Aceita`/`Recusada`/`Expirada` e condições inválidas são recusadas sem registro.
- [ ] Falha no aviso ao cliente não invalida a Proposta registrada.
- [ ] Duas novas versões simultâneas resultam em uma só versão vigente.
- [ ] Testes do caso de uso e dos casos de uso anteriores passam juntos; `lint` e `build` sem erros.

## Dependências externas e decisões pendentes

- **UC05 — Enviar Solicitação:** fornece a Solicitação `Enviada` e a porta de aviso; **bloqueia** o UC06.
- **UC07 — Aceitar Proposta:** já planejado (#18); depende do modelo de Proposta, Versão e Condições Comerciais deste épico (#19, #20, #21, #23).
- **D1:** origem do identificador do Especialista ainda não decidida.
- **D-UC06-01:** Quem leva a Proposta de `Enviada` para `Em revisão`? Este planejamento usa só FA-01 (nova versão do Especialista); "pedir revisão" não é implementado.
- **D-UC06-02:** Quais Condições Comerciais são obrigatórias. Proposta: todas, exceto condições de cancelamento.
- **D-UC06-05:** Especialista suspenso pode enviar Proposta para Solicitação recebida antes da suspensão? RN01 só trata de novas Solicitações. Nenhuma regra criada.
- **D-UC06-06:** A Solicitação passa a `Respondida`? Previsto em T2.1 §13.2, não retomado em T3. Não implementado.
- **D-UC06-07:** Recusar e expirar Proposta são transições sem Caso de Uso. Não implementadas.
- **D-UC06-09:** Origem do identificador do Especialista (D1).

## Condições de conclusão

O épico é concluído quando todas as Sub-Issues estiverem em `Done`, os critérios gerais estiverem verificados por testes e as decisões D-UC06-01 a D-UC06-03 e D-UC06-09 estiverem registradas. O UC07 só pode sair de `Backlog` depois das SUB-01 e SUB-02.
<!-- BODY:END -->
