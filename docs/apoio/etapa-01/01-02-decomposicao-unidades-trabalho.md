# 01-02 — Decomposição em unidades de trabalho

**Caso de uso:** UC02 — Cadastrar Perfil de Especialista
**Base:** [01-01 — Análise técnica](01-01-analise-tecnica.md)

O caso de uso foi decomposto em **7 unidades de trabalho**. Cada unidade entrega um comportamento verificável e inclui seus próprios testes. Não há unidades separadas para fases de TDD (RED/GREEN), reuniões, branches ou revisões.

| ID | Atividade técnica | Objetivo | Escopo e responsabilidades | Componente / camada | Origem no caso de uso | Depende de | Critério geral de conclusão |
| --- | --- | --- | --- | --- | --- | --- | --- |
| SUB-01 | Expor interface pública de reconhecimento de usuário (C1) | Permitir que outros contextos verifiquem uma referência de usuário sem acessar o modelo completo | Interface e token de injeção; implementação sobre o armazenamento de C1; testes unitários; regressão do UC01 | C1 — aplicação (contrato público) | FP-3, FE-02, RN-UC02-04 | — | Interface responde reconhecido/não reconhecido sem expor nome ou email; testes do UC01 continuam passando |
| SUB-02 | Modelar Perfil de Especialista e suas invariantes | Representar o perfil no domínio de C2 | Entidade e criação com situação inicial; invariantes de descrição e especialidades; tipo de situação; testes unitários | C2 — domínio | FP-5, POS-01..03, RN-UC02-02/03, §7, D2, D3 | Decisões D2 e D3 (hipóteses registradas) | Criação válida produz perfil `ATIVO`; cada invariante violada é recusada em teste |
| SUB-03 | Definir contrato de persistência de perfis e adaptador em memória com unicidade | Isolar o armazenamento e proteger a unicidade `1 : 0..1` | Interface de repositório; adaptador em memória com verificação e inserção na mesma operação; cópias defensivas; testes | C2 — repositório | FP-6, FE-03, RN-UC02-01/05 | SUB-02 (formato do perfil) | Segunda adição para o mesmo usuário falha sem alterar a primeira |
| SUB-04 | Implementar serviço de aplicação Cadastrar Perfil de Especialista | Coordenar reconhecimento, criação e registro | Serviço dependente apenas de contratos; erros `UsuarioNaoReconhecido` e `PerfilJaExistente`; testes com dublês | C2 — aplicação | FP-3..7, FE-02, FE-03, RN-UC02-01/04 | SUB-01, SUB-02, SUB-03 (contratos) | Três cenários (sucesso, usuário inexistente, perfil existente) verificados com dublês |
| SUB-05 | Expor endpoint HTTP de cadastro de perfil | Disponibilizar o caso de uso pela API | Schema de entrada estrito; controller; mapeamento 201/400/404/409; testes do controller | C2 — interface (API) | FP-1, FP-2, FP-7, FE-01..03, §7 | SUB-04 (contrato); decisão D1 | Cada código de resposta coberto por teste; origem de `usuarioId` conforme D1 |
| SUB-06 | Integrar C1 e C2 e verificar o fluxo completo por testes HTTP | Comprovar o comportamento de ponta a ponta | Registro do módulo de C2 no `AppModule`; ligação dos contratos aos adaptadores reais; testes HTTP; regressão | Integração | Todos os fluxos; PRE-01; POS-01..03; FA-01 | SUB-01, SUB-03, SUB-04, SUB-05 (implementações) | `pnpm test`, `pnpm lint` e `pnpm build` sem erros, com o fluxo principal e as exceções cobertos |
| SUB-07 | Documentar o UC02 e o endpoint | Manter a documentação do backend coerente | READMEs com objetivo, regras, exemplos e limitações | Documentação | Rastreabilidade; T4 §13.8 | SUB-05 (contrato do endpoint) para a seção da API | Documentação revisada e exemplos executáveis localmente |

## Justificativa da decomposição

- **SUB-01 a SUB-03 produzem contratos** (interface de C1, formato do perfil, interface de persistência). Separá-los permite acordar assinaturas cedo e liberar trabalho paralelo.
- **SUB-04 e SUB-05** separam a regra de aplicação do protocolo HTTP. A decisão D1 (origem da identidade) afeta apenas a SUB-05.
- **SUB-06** existe porque a integração é uma dependência própria: ela só pode ser verificada quando as implementações estiverem prontas.
- **SUB-07** é independente na maior parte do escopo e pode avançar em paralelo.
- Uma decomposição menor (por exemplo, juntar SUB-03 e SUB-04) esconderia o contrato de persistência, que concentra o principal risco técnico: a unicidade. Uma decomposição maior (por exemplo, uma issue só para o DTO) criaria tarefas sem comportamento verificável próprio.
