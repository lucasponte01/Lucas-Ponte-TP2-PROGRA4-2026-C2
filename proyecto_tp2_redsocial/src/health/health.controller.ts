import { Controller, Get } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import type { Connection } from 'mongoose';


@Controller('health')
export class HealthController {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  @Get()
  check() {
    const dbConectada = this.connection.readyState === 1;
    return {
      status: dbConectada ? 'ok' : 'no ok',
      db: dbConectada ? 'conectado' : 'desconectado',
      timestamp: new Date().toISOString(),
    };
  }
}
