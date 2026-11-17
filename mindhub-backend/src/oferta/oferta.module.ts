import { Module } from '@nestjs/common';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { IdentidadeModule } from '../identidade/identidade.module.js';
import {
  RECONHECIMENTO_DE_USUARIO,
  type ReconhecimentoDeUsuario,
} from '../identidade/publico/reconhecimento-de-usuario.js';
import { CadastrarPerfilEspecialista } from './aplicacao/cadastrar-perfil-especialista.js';
import { PublicarServico } from './aplicacao/publicar-servico.js';
import {
  PERFIS_ESPECIALISTA_REPOSITORIO,
  type PerfisEspecialistaRepositorio,
} from './dominio/perfis-especialista.repositorio.js';
import {
  SERVICOS_REPOSITORIO,
  type ServicosRepositorio,
} from './dominio/servicos.repositorio.js';
import { PerfisEspecialistaController } from './http/perfis-especialista.controller.js';
import { ServicosController } from './http/servicos.controller.js';
import { PerfilEspecialistaOrmEntity } from './infra/perfil-especialista.orm-entity.js';
import { PerfisEspecialistaTypeOrmRepositorio } from './infra/perfis-especialista.typeorm-repositorio.js';
import { ServicosEmMemoria } from './infra/servicos.em-memoria.js';

/**
 * C2 — Oferta Profissional.
 * Liga as portas às implementações. Domínio e aplicação não conhecem o Nest:
 * são criados aqui por useFactory, recebendo só as interfaces.
 */
@Module({
  imports: [
    IdentidadeModule,
    TypeOrmModule.forFeature([PerfilEspecialistaOrmEntity]),
  ],
  controllers: [PerfisEspecialistaController, ServicosController],
  providers: [
    {
      provide: PERFIS_ESPECIALISTA_REPOSITORIO,
      useFactory: (orm: Repository<PerfilEspecialistaOrmEntity>) =>
        new PerfisEspecialistaTypeOrmRepositorio(orm),
      inject: [getRepositoryToken(PerfilEspecialistaOrmEntity)],
    },
    {
      provide: CadastrarPerfilEspecialista,
      useFactory: (
        reconhecimento: ReconhecimentoDeUsuario,
        perfis: PerfisEspecialistaRepositorio,
      ) => new CadastrarPerfilEspecialista(reconhecimento, perfis),
      inject: [RECONHECIMENTO_DE_USUARIO, PERFIS_ESPECIALISTA_REPOSITORIO],
    },
    // Provisório até a #37 (TypeORM): os Serviços ficam em memória e se
    // perdem ao reiniciar. Troca-se só esta linha; o contrato é o mesmo.
    { provide: SERVICOS_REPOSITORIO, useClass: ServicosEmMemoria },
    {
      provide: PublicarServico,
      useFactory: (
        perfis: PerfisEspecialistaRepositorio,
        servicos: ServicosRepositorio,
      ) => new PublicarServico(perfis, servicos),
      inject: [PERFIS_ESPECIALISTA_REPOSITORIO, SERVICOS_REPOSITORIO],
    },
  ],
})
export class OfertaModule {}
