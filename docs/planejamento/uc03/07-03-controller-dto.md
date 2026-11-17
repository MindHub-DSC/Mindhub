# 07-03 — Controller e DTO

**Caso de uso:** UC03 — Publicar Serviço (épico [#35](https://github.com/MindHub-DSC/Mindhub/issues/35))
**Sub-Issue:** [#40](https://github.com/MindHub-DSC/Mindhub/issues/40) (relacionadas: #38 serviço, #36 domínio)
**Branch:** `feature/40-uc03-endpoint-publicar-servico` (criada a partir de `feature/38-uc03-publicar-servico` @ `5add296`)
**Data:** 17/11/2026

```text
$ git switch -c feature/40-uc03-endpoint-publicar-servico feature/38-uc03-publicar-servico
Switched to a new branch 'feature/40-uc03-endpoint-publicar-servico'
$ git log -1 --format='%h %s'
5add296 feat(oferta): recusa ator sem perfil e perfil suspenso em PublicarServico (ref #38)
```

## 1. Controller — `mindhub-backend/src/oferta/http/servicos.controller.ts`

```ts
import { Body, Controller, Inject, Post, UseFilters } from '@nestjs/common';
import { PublicarServico } from '../aplicacao/publicar-servico.js';
import { ErrosDePublicacaoFilter } from './erros-de-publicacao.filter.js';
import { paraResposta, publicarServicoSchema } from './publicar-servico.dto.js';
import type {
  PublicarServicoRequest,
  ServicoResponse,
} from './publicar-servico.dto.js';

/** Fronteira HTTP do UC03 (#40): recebe, valida o formato e traduz. Não decide regras. */
@Controller('servicos')
@UseFilters(ErrosDePublicacaoFilter)
export class ServicosController {
  constructor(
    @Inject(PublicarServico)
    private readonly publicarServico: PublicarServico,
  ) {}

  @Post()
  async publicar(
    @Body({ schema: publicarServicoSchema }) dados: PublicarServicoRequest,
  ): Promise<ServicoResponse> {
    const servico = await this.publicarServico.executar(dados);
    return paraResposta(servico);
  }
}
```

### Checklist do controller (8.3)

| Item | Situação |
| --- | --- |
| Prefixo de rota | `@Controller('servicos')` → `POST /servicos` (D-UC03-07) |
| Verbo | `@Post()`; o Nest responde 201 por padrão em `POST` |
| Extração | `@Body({ schema: publicarServicoSchema })`, mesmo padrão do `PerfisEspecialistaController` |
| Injeção | `PublicarServico` pelo construtor com `@Inject(PublicarServico)` (o projeto cria o serviço por `useFactory`, sem decoradores na aplicação) |
| Delegação | `this.publicarServico.executar(dados)`: o corpo validado já tem o formato de `PublicarServicoCommand` (`usuarioId`, `titulo`, `descricao`, `modeloContratacao`, `condicoes?`) |
| Lógica de negócio no controller | Nenhuma: não busca perfil, não valida RN01, não cria `Servico`, não acessa repositório |
| Resposta | `paraResposta(servico)`: o agregado não é serializado diretamente |

## 2. DTO — `mindhub-backend/src/oferta/http/publicar-servico.dto.ts`

```ts
export const publicarServicoSchema = z.strictObject({
  usuarioId: z.uuid(),
  titulo: z.string(),
  descricao: z.string(),
  modeloContratacao: z.enum(['RESERVA_DIRETA', 'SOB_PROPOSTA']),
  condicoes: z
    .strictObject({
      preco: z.number(),
      moeda: z.string(),
      duracaoMinutos: z.number(),
      modalidade: z.string(),
    })
    .optional(),
});

export type PublicarServicoRequest = z.infer<typeof publicarServicoSchema>;

export interface ServicoResponse {
  id: string;
  perfilId: string;
  titulo: string;
  descricao: string;
  modeloContratacao: string;
  condicoes: { preco: number; moeda: string; duracaoMinutos: number; modalidade: string } | null;
  situacao: string;
}

export function paraResposta(servico: Servico): ServicoResponse { /* copia os 7 campos */ }
```

*(O arquivo completo tem o comentário com D-UC03-05 e a função `paraResposta` por extenso.)*

Restrições da fronteira:

| Campo | Regra no DTO | Por quê |
| --- | --- | --- |
| Objeto raiz | `z.strictObject` | Campos não previstos (ex.: `situacao`, `perfilId`) → 400 (FE-01) |
| `usuarioId` | `z.uuid()` | Formato da referência do ator (D-UC03-05) |
| `titulo`, `descricao` | `z.string()` | Tipo. Vazio/espaços é invariante do domínio (D-UC03-01) |
| `modeloContratacao` | `z.enum([...])` | Valores conhecidos do protocolo; o domínio também recusa por conta própria |
| `condicoes` | `z.strictObject` opcional, com tipos | Tipo e campos. Inteiro, ≥ 0, > 0 e "Reserva Direta exige condições" são do domínio |

## 3. Filtro — `mindhub-backend/src/oferta/http/erros-de-publicacao.filter.ts`

Criado nesta fase porque o controller o referencia em `@UseFilters`. Traduz os erros conforme D-UC03-07:

| Erro | Origem | Status |
| --- | --- | --- |
| `AtorSemPerfil` | Aplicação (#38) | 404 |
| `PerfilSuspenso` | Aplicação (#38, RN01) | 403 |
| `CondicoesVigentesAusentes` | Domínio (#36) | 422 (testado antes de `ServicoInvalido`, de que é subclasse) |
| `ServicoInvalido` | Domínio (#36) | 400 |
| `ArmazenamentoIndisponivel` | Infra | 503 pelo filtro global já existente (`ArmazenamentoIndisponivelFilter`) |

## 4. Contratos preservados

| Contrato | Preservado? |
| --- | --- |
| `PublicarServico.executar(comando): Promise<Servico>` | Sim, chamado sem adaptação |
| Erros de domínio e aplicação | Sim, só são lidos pelo filtro |
| Entidade `Servico` | Sim; a resposta copia os getters |
| `ServicosRepositorio` / token | Não tocados nesta fase |

## 5. Validação HTTP × regra de negócio

- **Fronteira (DTO + pipe):** garante que o JSON tem a estrutura e os tipos esperados. Um corpo com `titulo: 123` ou um campo `situacao` extra é barrado com 400 **antes** de chamar `PublicarServico`.
- **Domínio/aplicação:** garantem as invariantes para qualquer chamador (HTTP, teste, futuro consumidor). Ex.: `titulo: "   "` passa pelo DTO (é string) e é recusado por `Servico.publicar` com `ServicoInvalido` → 400. Reserva Direta sem `condicoes` passa pelo DTO (campo opcional) e é recusada pelo domínio → 422.
- Nenhuma regra nova foi colocada no serviço de aplicação nesta etapa: as regras vieram dos ciclos TDD da #36 e da #38.

## 6. Dependências

| Pacote | Uso | Situação |
| --- | --- | --- |
| `@nestjs/common` 12 | `Controller`, `Post`, `Body` (opção `schema`), `Inject`, `UseFilters`, `Catch`, `HttpStatus` | Instalado |
| `zod` 4.6.5 | Schema do corpo | Instalado |
| `class-validator` / `class-transformer` | — | **Não usados**: o projeto valida com zod e `StandardSchemaValidationPipe` |

## 7. Verificações

```text
$ pnpm build    → nest build   build exit=0
$ pnpm lint     → oxlint --type-aware src/ test/   sem avisos
$ pnpm test
 Test Files  8 passed (8)
      Tests  80 passed (80)
```

## 8. Situação e pendências

- Os três arquivos estão salvos e compilam. **O controller ainda não está registrado no `OfertaModule`** (Fase 7): por isso a rota ainda não existe na aplicação e nada foi exercitado por HTTP.
- Ainda sem commit (Fase 10).
