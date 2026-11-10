import { Module, StandardSchemaValidationPipe } from '@nestjs/common';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ArmazenamentoIndisponivelFilter } from './compartilhado/http/armazenamento-indisponivel.filter.js';
import { lerAmbienteDoBanco } from './config/ambiente.js';
import { opcoesTypeOrm } from './database/opcoes-typeorm.js';
import { IdentidadeModule } from './identidade/identidade.module.js';
import { OfertaModule } from './oferta/oferta.module.js';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        ...opcoesTypeOrm(lerAmbienteDoBanco()),
        retryAttempts: 3,
        retryDelay: 2000,
      }),
    }),
    IdentidadeModule,
    OfertaModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_PIPE, useClass: StandardSchemaValidationPipe },
    { provide: APP_FILTER, useClass: ArmazenamentoIndisponivelFilter },
  ],
})
export class AppModule {}
