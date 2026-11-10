import { DataSource } from 'typeorm';
import { lerAmbienteDoBanco } from '../../src/config/ambiente.js';
import { opcoesTypeOrm } from '../../src/database/opcoes-typeorm.js';
import { apontarParaBancoDeTeste } from './banco-de-teste.js';

/**
 * Antes de todos os testes com banco: cria o banco de testes se ele ainda não
 * existir e aplica as mesmas migrations versionadas da aplicação.
 * Não apaga nada: cada teste limpa só os dados que ele mesmo criou.
 */
export default async function prepararBancoDeTeste(): Promise<void> {
  const alvo = apontarParaBancoDeTeste();
  const ambiente = lerAmbienteDoBanco();

  // Conexão de manutenção no banco "postgres", só para criar o banco de testes.
  const manutencao = new DataSource({
    ...opcoesTypeOrm(ambiente),
    database: 'postgres',
    entities: [],
    migrations: [],
  });
  await manutencao.initialize();
  try {
    const existe = await manutencao.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [alvo],
    );
    if (existe.length === 0) {
      // O nome já foi validado por regex em apontarParaBancoDeTeste.
      await manutencao.query(`CREATE DATABASE "${alvo}"`);
    }
  } finally {
    await manutencao.destroy();
  }

  const banco = new DataSource(opcoesTypeOrm(ambiente));
  await banco.initialize();
  try {
    await banco.runMigrations({ transaction: 'each' });
  } finally {
    await banco.destroy();
  }
}
