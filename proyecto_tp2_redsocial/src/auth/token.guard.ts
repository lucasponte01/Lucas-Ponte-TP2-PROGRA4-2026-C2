import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
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
    
    const token = authheader?.replace("bearer", '');

    if (!token || !clave) return false;

    try {
      // Verifica el token por su clave secreta y devuelve el payload decodificado
      const valido: any = jwt.verify(token, clave); 

      // Asignamos primero los datos al request ANTES de retornar true
      req.body = req.body || {};
      req.body.user = valido.user; // Guarda el usuario dueño del token para usarlo en el controlador

      return true;
    } catch (err) {
      console.log('Error al verificar token:', err);
      return false;
    }
  }
}