import { verificarContratoDeServicos } from '../../support/contrato-servicos.js';
import { ServicosEmMemoria } from '../../../src/oferta/infra/servicos.em-memoria.js';

// Critério de aceite 6 da #36: a porta permite adicionar, buscar por
// identificador e listar por perfil; o adaptador em memória devolve cópias
// defensivas.
describe('Contrato ServicosRepositorio — em memória', () => {
  verificarContratoDeServicos(() => new ServicosEmMemoria());
});
