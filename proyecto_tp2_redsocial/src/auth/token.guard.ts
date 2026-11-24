import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import jwt from 'jsonwebtoken';
import { Observable } from 'rxjs';

const clave = process.env.JWT_SECRET || 'clave_secreta_por_defecto';

@Injectable()
export class TokenGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    
    const req = context.switchToHttp().getRequest();
    const authheader = req.headers.authorization;
    
    const token = authheader?.replace(/bearer/i, '').trim();


    try {
      const valido: any = jwt.verify(token, clave); 
      
      req.body = req.body || {};
      req.body.user = valido.user; 

      return true;
    } catch (err) {
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }
}