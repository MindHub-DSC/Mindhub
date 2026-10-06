import { Module } from '@nestjs/common';
import { EspecialistasModule } from '../especialistas/especialistas.module.js';
import { ServicosController } from './servicos.controller.js';
import { ServicosService } from './servicos.service.js';

@Module({
  imports: [EspecialistasModule],
  controllers: [ServicosController],
  providers: [ServicosService],
  exports: [ServicosService],
})
export class ServicosModule {}
