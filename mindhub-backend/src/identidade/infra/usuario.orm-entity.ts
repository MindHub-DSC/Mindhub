import { Column, Entity, PrimaryColumn, Unique } from 'typeorm';

/**
 * Registro persistido de um Usuário (schema "identidade").
 * Não é a entidade de domínio: o mapeamento fica em UsuarioMapper.
 */
@Entity({ name: 'usuarios', schema: 'identidade' })
@Unique('uq_usuarios_email', ['email'])
export class UsuarioOrmEntity {
  /** Gerado pelo domínio (randomUUID), não pelo banco. */
  @PrimaryColumn({ type: 'uuid', primaryKeyConstraintName: 'pk_usuarios' })
  id: string;

  @Column({ type: 'varchar', length: 120 })
  nome: string;

  /** Já normalizado (aparado e minúsculo); a restrição única garante o UC01. */
  @Column({ type: 'varchar', length: 254 })
  email: string;
}
