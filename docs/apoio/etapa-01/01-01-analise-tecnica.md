# 01-01 — Análise técnica do caso de uso

**Projeto:** Mindhub — Plataforma de Mentorias e Consultorias
**Caso de uso:** UC02 — Cadastrar Perfil de Especialista
**Etapa:** 01 — Do Caso de Uso ao Planejamento da Implementação
**Data:** 10/11/2026
**Responsável:** Leonardo Herrero S. Martins (@leohsm) — trabalho individual

## Legenda de fontes

| Marca | Significado |
| --- | --- |
| **[T3]** | Documentado em `trabalho3.md` (modelo conceitual) |
| **[T4]** | Documentado em `trabalho4.md` (fronteiras e decisões arquiteturais) |
| **[CÓD]** | Evidência no código atual (`mindhub-backend/src`) |
| **[CÓD-ant]** | Evidência na versão anterior do backend (commit `ec1469f`, removida em `6a3e5c9`) |
| **[PROP]** | Proposta técnica deste planejamento; precisa de confirmação |

## 1. Identificação e motivo da escolha

- **Código:** UC02 **[PROP]**. O projeto não possui numeração formal de casos de uso; UC01 corresponde ao cadastro de usuário já implementado (`POST /usuarios`) **[CÓD]**.
- **Nome:** Cadastrar Perfil de Especialista.
- **Contexto responsável:** C2 — Oferta Profissional **[T4 §3.2]**, consumindo C1 — Identidade e Organizações **[T4 §3.1]**.

Motivos da escolha:

1. O backend atual implementa apenas o cadastro de usuário (C1). O Perfil de Especialista é o próximo conceito exigido por qualquer fluxo comercial, porque RN01 condiciona a publicação de Serviços e o recebimento de Solicitações a um perfil ativo **[T3 §9]**.
2. O Trabalho 4 descreve a forma esperada desta operação: "C2 consulta reconhecimento público da referência de usuário, sem exigir nome, email e futuros vínculos corporativos" **[T4 §13.4.2]**.
3. O caso exercita contratos entre fronteiras (C1 → C2) e de persistência sem depender de contextos ainda inexistentes (Agenda, Pagamentos, Governança).

## 2. Objetivo e escopo

**Objetivo:** permitir que um Usuário já cadastrado registre seu Perfil de Especialista e passe a exercer o papel contextual de especialista, sem criar uma nova identidade **[T3 §1.2; T4 §13.2]**.

**Dentro do escopo:**

- receber a descrição profissional e as especialidades;
- reconhecer o usuário por uma interface pública de C1;
- garantir no máximo um perfil por usuário;
- registrar o perfil com identificador, situação inicial e data de criação;
- devolver o perfil registrado.

**Fora do escopo** (casos de uso futuros ou decisões pendentes):

- suspender ou reativar o perfil (alteração de situação);
- publicar Serviços e receber Solicitações (consumidores de RN01);
- consultar, listar ou editar perfis;
- autenticar o agente da requisição (ver D1);
- persistência durável em banco de dados (ver D4).

## 3. Atores

| Ator | Papel no caso de uso | Fonte |
| --- | --- | --- |
| Usuário | Ator principal; ao concluir, passa a exercer também o papel de Especialista | [T3 §1.2] |
| C1 — Identidade e Organizações | Fronteira interna consultada para reconhecer a referência de usuário | [T4 §3.1, §13.4.2] |

## 4. Pré-condições e pós-condições

**Pré-condições**

- **PRE-01:** o usuário está cadastrado em C1 (UC01).
- **PRE-02:** o usuário ainda não possui Perfil de Especialista.

**Pós-condições (sucesso)**

- **POS-01:** existe um Perfil de Especialista com identificador próprio, vinculado a exatamente um usuário.
- **POS-02:** o perfil possui situação `ATIVO` **[CÓD-ant; decisão D2]** e data de criação.
- **POS-03:** nenhum dado cadastral do Usuário (nome, email) é copiado para o perfil **[T4 §13.4.2]**.

## 5. Fluxos

### Fluxo principal (FP)

1. O usuário informa a referência de usuário, a descrição profissional e a lista de especialidades.
2. O sistema valida o formato dos dados recebidos.
3. O sistema solicita a C1 o reconhecimento da referência de usuário.
4. O sistema verifica que o usuário não possui perfil.
5. O sistema cria o Perfil de Especialista com situação `ATIVO`.
6. O sistema registra o perfil preservando a unicidade por usuário.
7. O sistema devolve o perfil com identificador, situação e data de criação.

### Fluxo alternativo

- **FA-01 — Usuário que já atua como cliente:** o fluxo é o mesmo. Cliente e especialista são papéis do mesmo Usuário; não há cadastro separado **[T3 §1.2; T4 §13.2]**. O teste anterior "mantém cliente e especialista como papéis do mesmo usuário" verificava esse comportamento **[CÓD-ant]**.

### Fluxos de exceção

| Código | Condição | Comportamento esperado | Resposta HTTP proposta |
| --- | --- | --- | --- |
| FE-01 | Dados inválidos ou campos não previstos | Recusar sem registrar nada | 400 [CÓD — padrão atual] |
| FE-02 | Referência de usuário não reconhecida por C1 | Recusar sem registrar nada | 404 [CÓD-ant] |
| FE-03 | Usuário já possui perfil | Recusar sem alterar o perfil existente | 409 [CÓD-ant] |

## 6. Regras de negócio

| ID | Regra | Fonte |
| --- | --- | --- |
| RN-UC02-01 | Um Usuário possui no máximo um Perfil de Especialista (`1 : 0..1`) | [T3 §8; T4 §3.2] |
| RN-UC02-02 | Cliente e Especialista são papéis do mesmo Usuário; o perfil não cria nova identidade | [T3 §1.2; T4 §13.2] |
| RN-UC02-03 | O perfil registra uma situação que permite aplicar RN01 nos fluxos consumidores | [T3 §9 RN01; T4 §3.2] |
| RN-UC02-04 | C2 reconhece o usuário por interface pública restrita de C1, sem depender do modelo completo de Usuário | [T4 §12.4 ADR-04; §13.4.2] |
| RN-UC02-05 | A unicidade do perfil deve ser protegida também na persistência | [T4 §1.3; §13.2] |

## 7. Validações de entrada

| Campo | Regra | Fonte |
| --- | --- | --- |
| `usuarioId` | UUID obrigatório | [CÓD — identificadores atuais usam `randomUUID()`] |
| `descricao` | Texto obrigatório, sem espaços nas extremidades, de 1 a 2000 caracteres | [CÓD-ant] |
| `especialidades` | Lista com 1 a 20 itens; cada item com 1 a 120 caracteres após `trim`; sem repetições, sem diferenciar maiúsculas e minúsculas | [CÓD-ant; decisão D3] |
| Demais campos | Proibidos (objeto estrito); impede, por exemplo, enviar `situacao` | [CÓD — padrão `z.strictObject`] |

## 8. Componentes e camadas envolvidas

| Componente | Camada | Contexto | Situação atual |
| --- | --- | --- | --- |
| Interface pública de reconhecimento de usuário | Aplicação (contrato público) | C1 | Inexistente; `UsuariosService` apenas cadastra |
| Perfil de Especialista | Domínio | C2 | Inexistente (removido em `6a3e5c9`) |
| Contrato de persistência de perfis e adaptador em memória | Repositório | C2 | Inexistente |
| Serviço de aplicação "Cadastrar Perfil" | Aplicação | C2 | Inexistente |
| Endpoint HTTP e DTO de entrada | Interface (API) | C2 | Inexistente |
| Composição dos módulos | Integração | C1 + C2 | `AppModule` registra apenas Usuários |

## 9. Considerações arquiteturais preliminares

- **Monólito modular** (ADR-01 **[T4 §12.1]**): C1 e C2 como módulos internos; a verificação do usuário é síncrona e local (ADR-03 **[T4 §12.3]**).
- **Interfaces por propósito** (ADR-04 **[T4 §12.4]**): C1 expõe apenas o reconhecimento da referência, não o objeto `Usuario` completo.
- **Persistência atrás de contrato** **[T4 §13.4.4]**: o adaptador em memória pode ser substituído por banco sem alterar o caso de uso.
- **Composição concentrada** **[PROP]**: o registro do módulo de C2 no `AppModule` fica em uma atividade de integração, para reduzir conflitos sobre o mesmo arquivo.
- **Testes progressivos**: cada unidade traz seus testes unitários; a integração traz os testes HTTP. Não há fase de testes isolada ao final.

## 10. Restrições, dúvidas e decisões pendentes

| ID | Tipo | Descrição | Impacto | Encaminhamento |
| --- | --- | --- | --- | --- |
| D1 | Decisão arquitetural | Origem da identidade do agente. O T4 registra que "o ID informado pelo cliente HTTP não substituirá a identidade autenticada" **[T4 §6.2, §13.1]**, mas não há autenticação implementada nem mecanismo escolhido | Define se `usuarioId` vem do corpo da requisição ou de uma identidade autenticada; afeta o contrato HTTP | Decisão do responsável técnico antes da SUB-05 |
| D2 | Regra não documentada | Situação inicial do perfil. A versão anterior criava `ATIVO`; T3 e T4 não descrevem aprovação prévia | Afeta o modelo de domínio e o efeito de RN01 | **Decidida em 10/11/2026 por @leohsm:** o perfil nasce `ATIVO` |
| D3 | Validação não documentada | Tratamento de especialidades repetidas na mesma lista | Afeta a validação de domínio | **Decidida em 10/11/2026 por @leohsm:** recusar repetições (400), sem diferenciar maiúsculas e minúsculas |
| D4 | Restrição técnica | Persistência durável ainda não decidida **[T4 §13.6, item 3]** | Nenhum neste caso de uso, desde que o contrato de persistência isole o adaptador | Fora do escopo; usar adaptador em memória |
