import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getInfo() {
    return {
      nome: 'Mindhub',
      descricao: 'Plataforma de Mentorias e Consultorias',
      versao: '0.0.1',
      recursos: [
        '/api/usuarios',
        '/api/especialistas',
        '/api/servicos',
        '/api/solicitacoes',
      ],
    };
  }
}
