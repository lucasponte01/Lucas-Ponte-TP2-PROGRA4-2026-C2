import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { MongooseModule } from '@nestjs/mongoose';
import { UsuariosModule } from './usuarios/usuarios.module.js';
import { AuthModule } from './auth/auth.module.js';
import { PublicacionesModule } from './publicaciones/publicaciones.module.js';
import { ComentariosModule } from './comentarios/comentarios.module.js';
import { EstadisticasModule } from './estadisticas/estadisticas.module.js';
import { HealthController } from './health/health.controller.js';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';


@Module({
imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60_000,
        limit: 120,
      },
    ]),
    MongooseModule.forRoot(
      'mongodb+srv://lucasponteponte204_db_user:pk4rUKtjRe2peLYy@clustertp2.sjbxedf.mongodb.net',
    ),
    UsuariosModule,
    AuthModule,
    PublicacionesModule,
    ComentariosModule,
    EstadisticasModule,
  ],
  controllers: [AppController, HealthController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
