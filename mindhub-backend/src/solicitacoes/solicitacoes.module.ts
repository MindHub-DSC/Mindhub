import { Module } from '@nestjs/common';
import { UsuariosModule } from '../usuarios/usuarios.module.js';
import { EspecialistasModule } from '../especialistas/especialistas.module.js';
import { ServicosModule } from '../servicos/servicos.module.js';
import { SolicitacoesController } from './solicitacoes.controller.js';
import { SolicitacoesService } from './solicitacoes.service.js';

@Module({
  imports: [UsuariosModule, EspecialistasModule, ServicosModule],
  controllers: [SolicitacoesController],
  providers: [SolicitacoesService],
})
export class SolicitacoesModule {}
