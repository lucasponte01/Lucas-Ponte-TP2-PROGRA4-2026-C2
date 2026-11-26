import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import { LogeoInterceptor } from './interceptors/logeointerceptor.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
    }),
  );

  app.useGlobalInterceptors(new LogeoInterceptor());

  app.enableCors({
    origin: ["http://localhost:4200", "https://tp2-progra4-frontend.onrender.com"],
    credentials: true,
  });
  
  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
