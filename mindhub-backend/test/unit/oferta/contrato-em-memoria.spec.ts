import { verificarContratoDePerfis } from '../../support/contrato-perfis-especialista.js';
import { PerfisEspecialistaEmMemoria } from '../../support/perfis-especialista.em-memoria.js';

describe('Contrato PerfisEspecialistaRepositorio — em memória', () => {
  verificarContratoDePerfis(() => new PerfisEspecialistaEmMemoria());
});
