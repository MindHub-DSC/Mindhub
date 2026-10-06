import { Module, StandardSchemaValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { UsuariosModule } from './usuarios/usuarios.module.js';
import { EspecialistasModule } from './especialistas/especialistas.module.js';
import { ServicosModule } from './servicos/servicos.module.js';
import { SolicitacoesModule } from './solicitacoes/solicitacoes.module.js';

@Module({
  imports: [
    UsuariosModule,
    EspecialistasModule,
    ServicosModule,
    SolicitacoesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_PIPE, useClass: StandardSchemaValidationPipe },
  ],
})
export class AppModule {}
