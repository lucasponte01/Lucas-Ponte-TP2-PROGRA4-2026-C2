import {CanActivate, ExecutionContext,ForbiddenException,Injectable,UnauthorizedException,} from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const user = req.user;

    if (!user) {
      throw new UnauthorizedException('Usuario no autenticado');
    }

    if (user.perfil !== 'administrador') {
      throw new ForbiddenException('Acceso denegado: se requiere perfil administrador');
    }

    return true;
  }
}