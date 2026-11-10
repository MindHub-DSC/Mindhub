import { DataSource } from 'typeorm';
import { lerAmbienteDoBanco } from '../config/ambiente.js';
import { opcoesTypeOrm } from './opcoes-typeorm.js';

/**
 * DataSource da CLI do TypeORM (migration:generate, run, revert, show).
 * Usado compilado: dist/database/data-source.js. O banco de destino é o de
 * DB_NAME no .env (ou no terminal).
 */
export default new DataSource(opcoesTypeOrm(lerAmbienteDoBanco()));
