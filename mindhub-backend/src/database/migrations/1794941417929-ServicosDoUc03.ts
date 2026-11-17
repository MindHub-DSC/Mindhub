import type { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Tabela de Serviços do UC03 (#37).
 * Gerada por `pnpm migration:generate` a partir da ServicoOrmEntity; só a
 * formatação e este comentário foram editados.
 *
 * - perfil_id → oferta.perfis_especialista (mesmo contexto C2), sem UNIQUE:
 *   um perfil publica vários Serviços (FA-01). ON DELETE RESTRICT.
 * - CHECKs repetem no banco as invariantes do domínio que cabem em SQL:
 *   modelo e situação conhecidos, condições vigentes todas ou nenhuma,
 *   Reserva Direta com condições, preço >= 0 e duração > 0.
 * - "ordem" (identity) é técnica: dá a ordem de registro de listarPorPerfil.
 */
export class ServicosDoUc031794941417929 implements MigrationInterface {
  name = 'ServicosDoUc031794941417929';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "oferta"."servicos" ("id" uuid NOT NULL, "perfil_id" uuid NOT NULL, "titulo" character varying(120) NOT NULL, "descricao" character varying(2000) NOT NULL, "modelo_contratacao" character varying(20) NOT NULL, "situacao" character varying(20) NOT NULL, "preco" integer, "moeda" text, "duracao_minutos" integer, "modalidade" text, "publicado_em" TIMESTAMP WITH TIME ZONE NOT NULL, "ordem" bigint GENERATED ALWAYS AS IDENTITY NOT NULL, CONSTRAINT "ck_servicos_duracao" CHECK ("duracao_minutos" > 0), CONSTRAINT "ck_servicos_preco" CHECK ("preco" >= 0), CONSTRAINT "ck_servicos_reserva_direta_com_condicoes" CHECK ("modelo_contratacao" <> 'RESERVA_DIRETA' OR "preco" IS NOT NULL), CONSTRAINT "ck_servicos_condicoes_completas" CHECK (("preco" IS NULL AND "moeda" IS NULL AND "duracao_minutos" IS NULL AND "modalidade" IS NULL) OR ("preco" IS NOT NULL AND "moeda" IS NOT NULL AND "duracao_minutos" IS NOT NULL AND "modalidade" IS NOT NULL)), CONSTRAINT "ck_servicos_situacao" CHECK ("situacao" IN ('PUBLICADO')), CONSTRAINT "ck_servicos_modelo_contratacao" CHECK ("modelo_contratacao" IN ('RESERVA_DIRETA', 'SOB_PROPOSTA')), CONSTRAINT "pk_servicos" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "ix_servicos_perfil_ordem" ON "oferta"."servicos"  ("perfil_id", "ordem") `,
    );
    await queryRunner.query(
      `ALTER TABLE "oferta"."servicos" ADD CONSTRAINT "fk_servicos_perfil" FOREIGN KEY ("perfil_id") REFERENCES "oferta"."perfis_especialista"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "oferta"."servicos" DROP CONSTRAINT "fk_servicos_perfil"`,
    );
    await queryRunner.query(`DROP INDEX "oferta"."ix_servicos_perfil_ordem"`);
    await queryRunner.query(`DROP TABLE "oferta"."servicos"`);
  }
}
