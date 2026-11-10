import { Module } from '@nestjs/common';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { IdentidadeModule } from '../identidade/identidade.module.js';
import {
  RECONHECIMENTO_DE_USUARIO,
  type ReconhecimentoDeUsuario,
} from '../identidade/publico/reconhecimento-de-usuario.js';
import { CadastrarPerfilEspecialista } from './aplicacao/cadastrar-perfil-especialista.js';
import {
  PERFIS_ESPECIALISTA_REPOSITORIO,
  type PerfisEspecialistaRepositorio,
} from './dominio/perfis-especialista.repositorio.js';
import { PerfisEspecialistaController } from './http/perfis-especialista.controller.js';
import { PerfilEspecialistaOrmEntity } from './infra/perfil-especialista.orm-entity.js';
import { PerfisEspecialistaTypeOrmRepositorio } from './infra/perfis-especialista.typeorm-repositorio.js';

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
  controllers: [PerfisEspecialistaController],
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
  ],
})
export class OfertaModule {}
