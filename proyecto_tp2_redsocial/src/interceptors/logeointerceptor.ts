// src/common/interceptors/logging.interceptor.ts
import {CallHandler,ExecutionContext,Injectable,Logger,NestInterceptor,} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LogeoInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context.switchToHttp().getRequest();
    const { method, url } = req;
    const inicio = Date.now();

    return next.handle().pipe(
      tap(() => {
        const ms = Date.now() - inicio;
        this.logger.log(`${method} ${url} - ${ms}ms`);
      }),
    );
  }
}