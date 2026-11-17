import {
  Check,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { PerfilEspecialistaOrmEntity } from './perfil-especialista.orm-entity.js';

/**
 * Registro persistido de um Serviço (schema "oferta", #37).
 * Não é a entidade de domínio: o mapeamento fica em ServicoMapper.
 *
 * - perfil_id tem chave estrangeira para oferta.perfis_especialista: o perfil
 *   e o Serviço são do mesmo contexto (C2). Sem UNIQUE: 1 perfil : 0..* Serviços.
 * - As condições vigentes ficam em colunas nulas: todas preenchidas ou todas
 *   nulas, e obrigatórias em RESERVA_DIRETA (D-UC03-02/03), por CHECK.
 * - "ordem" é técnica (identity): garante a ordem de registro exigida por
 *   listarPorPerfil mesmo quando dois Serviços têm o mesmo publicado_em.
 *   Não existe no domínio.
 */
@Entity({ name: 'servicos', schema: 'oferta' })
@Index('ix_servicos_perfil_ordem', ['perfilId', 'ordem'])
@Check(
  'ck_servicos_modelo_contratacao',
  `"modelo_contratacao" IN ('RESERVA_DIRETA', 'SOB_PROPOSTA')`,
)
@Check('ck_servicos_situacao', `"situacao" IN ('PUBLICADO')`)
@Check(
  'ck_servicos_condicoes_completas',
  `("preco" IS NULL AND "moeda" IS NULL AND "duracao_minutos" IS NULL AND "modalidade" IS NULL) OR ("preco" IS NOT NULL AND "moeda" IS NOT NULL AND "duracao_minutos" IS NOT NULL AND "modalidade" IS NOT NULL)`,
)
@Check(
  'ck_servicos_reserva_direta_com_condicoes',
  `"modelo_contratacao" <> 'RESERVA_DIRETA' OR "preco" IS NOT NULL`,
)
@Check('ck_servicos_preco', `"preco" >= 0`)
@Check('ck_servicos_duracao', `"duracao_minutos" > 0`)
export class ServicoOrmEntity {
  /** Gerado pelo domínio (randomUUID), não pelo banco. */
  @PrimaryColumn({ type: 'uuid', primaryKeyConstraintName: 'pk_servicos' })
  id: string;

  @Column({ name: 'perfil_id', type: 'uuid' })
  perfilId: string;

  @ManyToOne(() => PerfilEspecialistaOrmEntity, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({
    name: 'perfil_id',
    foreignKeyConstraintName: 'fk_servicos_perfil',
  })
  perfil?: PerfilEspecialistaOrmEntity;

  /** Limite decidido em 17/11/2026 (#36); o domínio também o impõe. */
  @Column({ type: 'varchar', length: 120 })
  titulo: string;

  /** Limite decidido em 17/11/2026 (#36); o domínio também o impõe. */
  @Column({ type: 'varchar', length: 2000 })
  descricao: string;

  @Column({ name: 'modelo_contratacao', type: 'varchar', length: 20 })
  modeloContratacao: string;

  @Column({ type: 'varchar', length: 20 })
  situacao: string;

  /** Unidade monetária mínima (ex.: centavos). */
  @Column({ type: 'integer', nullable: true })
  preco: number | null;

  /** Sem limite de tamanho: o domínio não define um (decisão técnica). */
  @Column({ type: 'text', nullable: true })
  moeda: string | null;

  @Column({ name: 'duracao_minutos', type: 'integer', nullable: true })
  duracaoMinutos: number | null;

  /** Sem limite de tamanho: o domínio não define um (decisão técnica). */
  @Column({ type: 'text', nullable: true })
  modalidade: string | null;

  /** Decisão A2 (17/11/2026, #36). */
  @Column({ name: 'publicado_em', type: 'timestamptz' })
  publicadoEm: Date;

  /** Técnica: ordem de registro (identity). Não é lida pelo domínio. */
  @Column({
    type: 'bigint',
    generated: 'identity',
    generatedIdentity: 'ALWAYS',
    insert: false,
    update: false,
  })
  ordem?: string;
}
