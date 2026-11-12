import { randomUUID } from 'node:crypto';
import { Servico } from '../../../src/oferta/dominio/servico.js';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const agora = new Date('2026-11-11T12:00:00.000Z');

describe('Servico.publicar', () => {
  // Critério de aceite 1 da #36 (UC03): o Serviço nasce publicado, com
  // identidade própria, referência ao perfil e Modelo de Contratação declarado.
  it('nasce publicado, com identidade própria, referência ao perfil e Modelo de Contratação', () => {
    // Arrange: dados válidos. Sob Proposta não exige condições vigentes (D-UC03-03).
    const perfilId = randomUUID();
    const dados = {
      perfilId,
      titulo: 'Mentoria de produto',
      descricao: 'Sessões de discovery para times iniciantes',
      modeloContratacao: 'SOB_PROPOSTA' as const,
      agora,
    };

    // Act
    const servico = Servico.publicar(dados);

    // Assert
    expect(servico.id).toMatch(UUID);
    expect(servico.perfilId).toBe(perfilId);
    expect(servico.titulo).toBe('Mentoria de produto');
    expect(servico.modeloContratacao).toBe('SOB_PROPOSTA');
    expect(servico.situacao).toBe('PUBLICADO');
  });
});
