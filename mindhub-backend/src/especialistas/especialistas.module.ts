import { Module } from '@nestjs/common';
import { UsuariosModule } from '../usuarios/usuarios.module.js';
import { EspecialistasController } from './especialistas.controller.js';
import { EspecialistasService } from './especialistas.service.js';

@Module({
  imports: [UsuariosModule],
  controllers: [EspecialistasController],
  providers: [EspecialistasService],
  exports: [EspecialistasService],
})
export class EspecialistasModule {}
