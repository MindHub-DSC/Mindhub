import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('identifica a plataforma de mentorias e consultorias', () => {
      expect(appController.getInfo()).toMatchObject({
        nome: 'Mindhub',
        descricao: 'Plataforma de Mentorias e Consultorias',
      });
    });
  });
});
