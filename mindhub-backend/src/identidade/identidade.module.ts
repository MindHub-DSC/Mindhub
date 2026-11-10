import { Module } from '@nestjs/common';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { CadastrarUsuario } from './aplicacao/cadastrar-usuario.js';
import { ReconhecerUsuario } from './aplicacao/reconhecer-usuario.js';
import {
  USUARIOS_REPOSITORIO,
  type UsuariosRepositorio,
} from './dominio/usuarios.repositorio.js';
import { UsuariosController } from './http/usuarios.controller.js';
import { UsuarioOrmEntity } from './infra/usuario.orm-entity.js';
import { UsuariosTypeOrmRepositorio } from './infra/usuarios.typeorm-repositorio.js';
import { RECONHECIMENTO_DE_USUARIO } from './publico/reconhecimento-de-usuario.js';

/**
 * C1 — Identidade e Organizações.
 * Exporta só a interface pública de reconhecimento (ADR-04).
 */
@Module({
  imports: [TypeOrmModule.forFeature([UsuarioOrmEntity])],
  controllers: [UsuariosController],
  providers: [
    {
      provide: USUARIOS_REPOSITORIO,
      useFactory: (orm: Repository<UsuarioOrmEntity>) =>
        new UsuariosTypeOrmRepositorio(orm),
      inject: [getRepositoryToken(UsuarioOrmEntity)],
    },
    {
      provide: CadastrarUsuario,
      useFactory: (usuarios: UsuariosRepositorio) =>
        new CadastrarUsuario(usuarios),
      inject: [USUARIOS_REPOSITORIO],
    },
    {
      provide: RECONHECIMENTO_DE_USUARIO,
      useFactory: (usuarios: UsuariosRepositorio) =>
        new ReconhecerUsuario(usuarios),
      inject: [USUARIOS_REPOSITORIO],
    },
  ],
  exports: [RECONHECIMENTO_DE_USUARIO],
})
export class IdentidadeModule {}
