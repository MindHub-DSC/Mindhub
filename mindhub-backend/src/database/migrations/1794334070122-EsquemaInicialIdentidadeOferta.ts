import type { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Esquema inicial do primeiro slice.
 * Gerada por `pnpm migration:generate` a partir das ORM Entities.
 * Edição manual: CREATE SCHEMA / DROP SCHEMA, que o TypeORM não gera.
 *
 * - identidade (C1) e oferta (C2) em schemas separados: cada contexto é dono
 *   das próprias tabelas (ADR-04). Não há chave estrangeira entre eles (D6).
 * - uq_perfis_especialista_usuario garante RN-UC02-01 (um perfil por usuário)
 *   mesmo com requisições simultâneas.
 */
export class EsquemaInicialIdentidadeOferta1794334070122 implements MigrationInterface {
  name = 'EsquemaInicialIdentidadeOferta1794334070122';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "identidade"`);
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "oferta"`);
    await queryRunner.query(
      `CREATE TABLE "identidade"."usuarios" ("id" uuid NOT NULL, "nome" character varying(120) NOT NULL, "email" character varying(254) NOT NULL, CONSTRAINT "uq_usuarios_email" UNIQUE ("email"), CONSTRAINT "pk_usuarios" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "oferta"."perfis_especialista" ("id" uuid NOT NULL, "usuario_id" uuid NOT NULL, "descricao" character varying(2000) NOT NULL, "especialidades" character varying(120) array NOT NULL, "situacao" character varying(20) NOT NULL, "criado_em" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "uq_perfis_especialista_usuario" UNIQUE ("usuario_id"), CONSTRAINT "ck_perfis_especialista_situacao" CHECK ("situacao" IN ('ATIVO', 'SUSPENSO')), CONSTRAINT "pk_perfis_especialista" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "oferta"."perfis_especialista"`);
    await queryRunner.query(`DROP TABLE "identidade"."usuarios"`);
    // Sem CASCADE: se houver outro objeto no schema, a reversão para e avisa.
    await queryRunner.query(`DROP SCHEMA "oferta"`);
    await queryRunner.query(`DROP SCHEMA "identidade"`);
  }
}
