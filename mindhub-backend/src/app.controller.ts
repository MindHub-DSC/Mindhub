import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service.js';

@Controller()
export class AppController {
  constructor(@Inject(AppService) private readonly appService: AppService) {}

  @Get()
  getInfo() {
    return this.appService.getInfo();
  }

  @Get('health')
  getHealth() {
    return { status: 'ok', aplicacao: 'Mindhub' };
  }
}
