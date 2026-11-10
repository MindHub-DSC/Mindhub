import { Check, Column, Entity, PrimaryColumn, Unique } from 'typeorm';

/**
 * Registro persistido de um Perfil de Especialista (schema "oferta").
 * Não é a entidade de domínio: o mapeamento fica em PerfilEspecialistaMapper.
 *
 * usuario_id NÃO tem chave estrangeira para identidade.usuarios (D6): C2 não
 * escreve nem depende do esquema de C1; a referência é verificada pela porta
 * ReconhecimentoDeUsuario no momento do cadastro.
 */
@Entity({ name: 'perfis_especialista', schema: 'oferta' })
@Unique('uq_perfis_especialista_usuario', ['usuarioId'])
@Check('ck_perfis_especialista_situacao', `"situacao" IN ('ATIVO', 'SUSPENSO')`)
export class PerfilEspecialistaOrmEntity {
  /** Gerado pelo domínio (randomUUID), não pelo banco. */
  @PrimaryColumn({
    type: 'uuid',
    primaryKeyConstraintName: 'pk_perfis_especialista',
  })
  id: string;

  /** RN-UC02-01: um perfil por usuário, garantido pela restrição única. */
  @Column({ name: 'usuario_id', type: 'uuid' })
  usuarioId: string;

  @Column({ type: 'varchar', length: 2000 })
  descricao: string;

  /** Ordem preservada; as invariantes ficam no domínio (Especialidades). */
  @Column({ type: 'varchar', length: 120, array: true })
  especialidades: string[];

  @Column({ type: 'varchar', length: 20 })
  situacao: string;

  @Column({ name: 'criado_em', type: 'timestamptz' })
  criadoEm: Date;
}
