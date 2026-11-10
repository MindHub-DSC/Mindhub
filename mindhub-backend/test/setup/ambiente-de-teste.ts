// Roda em cada arquivo de teste com banco, antes dos imports do AppModule
// lerem a configuração: garante que DB_NAME é o banco de testes.
import { apontarParaBancoDeTeste } from './banco-de-teste.js';

apontarParaBancoDeTeste();
