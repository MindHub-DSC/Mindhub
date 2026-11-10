import type { DataSourceOptions } from 'typeorm';
import type { AmbienteDoBanco } from '../config/ambiente.js';
import { UsuarioOrmEntity } from '../identidade/infra/usuario.orm-entity.js';
import { PerfilEspecialistaOrmEntity } from '../oferta/infra/perfil-especialista.orm-entity.js';
import { MIGRACOES } from './migracoes.js';

export const ENTIDADES_ORM = [UsuarioOrmEntity, PerfilEspecialistaOrmEntity];

export type OpcoesPostgres = Extract<DataSourceOptions, { type: 'postgres' }>;

/**
 * Opções de conexão usadas pela API, pela CLI de migrations e pelos testes.
 * synchronize: false — o esquema só muda por migration versionada.
 */
export function opcoesTypeOrm(ambiente: AmbienteDoBanco): OpcoesPostgres {
  return {
    type: 'postgres',
    host: ambiente.DB_HOST,
    port: ambiente.DB_PORT,
    username: ambiente.DB_USER,
    password: ambiente.DB_PASSWORD,
    database: ambiente.DB_NAME,
    entities: ENTIDADES_ORM,
    migrations: MIGRACOES,
    migrationsTableName: 'migrations',
    synchronize: false,
    migrationsRun: false,
    logging: false,
  };
}
