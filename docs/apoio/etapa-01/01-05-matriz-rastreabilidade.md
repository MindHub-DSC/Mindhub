# 01-05 — Matriz de rastreabilidade

**Caso de uso:** UC02 — Cadastrar Perfil de Especialista

| Requisito / regra / fluxo | Sub-Issue | Atividade técnica | Critério de aceite vinculado | Comportamento a verificar futuramente |
| --- | --- | --- | --- | --- |
| PRE-01 — usuário cadastrado | SUB-01, SUB-06 | Reconhecimento de usuário; teste HTTP | SUB-01: reconhece usuário cadastrado | Perfil só é criado após `POST /usuarios` |
| PRE-02 — usuário sem perfil | SUB-03, SUB-04 | Unicidade no repositório; coordenação | SUB-03: segunda adição falha | Segundo cadastro recusado |
| FP-1 e FP-2 — receber e validar dados | SUB-05 | Schema estrito e controller | SUB-05: 400 para dados inválidos | Campos ausentes, fora de limite ou extras recusados |
| FP-3 — reconhecer usuário em C1 | SUB-01, SUB-04 | Interface pública de C1; uso no serviço | SUB-04: depende apenas da interface | Serviço não importa classes concretas de C1 |
| FP-4 — verificar ausência de perfil | SUB-03, SUB-04 | Repositório e serviço | SUB-04: `PerfilJaExistente` sem segundo registro | 409 sem alterar o perfil existente |
| FP-5 — criar perfil `ATIVO` | SUB-02 | Modelo de domínio | SUB-02: criação gera `ATIVO` | Situação retornada é `ATIVO` |
| FP-6 — registrar com unicidade | SUB-03 | Adaptador em memória | SUB-03: verificação e inserção na mesma operação | Sem intervalo assíncrono entre verificação e inserção |
| FP-7 — devolver o perfil | SUB-05, SUB-06 | Resposta HTTP 201 | SUB-05: campos do corpo 201 | Corpo contém `id`, `usuarioId`, `descricao`, `especialidades`, `situacao`, `criadoEm` |
| FA-01 — usuário que também é cliente | SUB-02, SUB-06 | Perfil referencia o usuário existente | SUB-06: mesmo `id`, sem novo usuário | Nenhuma identidade duplicada |
| FE-01 — dados inválidos | SUB-02, SUB-05 | Invariantes e schema | SUB-02 (invariantes); SUB-05 (400) | 400 e nada registrado |
| FE-02 — usuário não reconhecido | SUB-01, SUB-04, SUB-05 | Reconhecimento, erro de aplicação, 404 | SUB-04 e SUB-05 | 404 e nada registrado |
| FE-03 — perfil existente | SUB-03, SUB-04, SUB-05 | Unicidade, erro de aplicação, 409 | SUB-03, SUB-04 e SUB-05 | 409 e primeiro perfil intacto |
| RN-UC02-01 — `1 : 0..1` | SUB-03 | Unicidade no armazenamento | SUB-03 | Segunda adição falha |
| RN-UC02-02 — papéis do mesmo usuário | SUB-02 | Perfil guarda só a referência | SUB-02: sem nome ou email | Perfil não copia dados cadastrais |
| RN-UC02-03 — situação para RN01 | SUB-02 | Tipo da situação | SUB-02: só `ATIVO`/`SUSPENSO` | Situação presente no perfil |
| RN-UC02-04 — interface restrita de C1 | SUB-01, SUB-04 | Contrato público | SUB-01: não expõe `Usuario` | C2 sem acesso ao modelo completo |
| RN-UC02-05 — unicidade na persistência | SUB-03 | Adaptador | SUB-03 | Proteção não depende só do serviço |
| Validações §7 | SUB-02, SUB-05 | Invariantes e schema | SUB-02; SUB-05 | Limites de descrição e especialidades |
| POS-03 — sem dados cadastrais copiados | SUB-02 | Modelo | SUB-02 | Perfil sem nome ou email |
| Governança da documentação | SUB-07 | READMEs | SUB-07 | Documentação coerente com a API |

## Lacunas identificadas

- **Sem regra documentada:** situação inicial (D2) e especialidades repetidas (D3). Ambas foram registradas como hipóteses, não como regras confirmadas.
- **Sem cobertura neste caso de uso:** suspensão e reativação do perfil. A situação `SUSPENSO` existe no tipo, mas nenhuma operação a produz no UC02. Isso é intencional: o efeito de RN01 pertence a outros casos de uso.
- **Atividades sem justificativa na especificação:** nenhuma. A SUB-07 se apoia na governança da entrega registrada no Trabalho 4.
