import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';
import { AuthService } from '../services/authServices';

export const authGuard: CanActivateFn = (route, state): Observable<boolean | UrlTree> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Si ni siquiera hay token guardado localmente, chau directo al login
  if (!authService.isLoggedIn()) {
    return of(router.parseUrl('/login'));
  }

  // Le preguntamos al backend si el token sigue vigente
  return authService.verifyToken().pipe(
    map((response) => {
      // Si el backend responde bien, el token es válido
      if (response && response.valido) {
        return true;
      }
      // Por si acaso, si no viene la estructura esperada
      return router.parseUrl('/login');
    }),
    catchError((error) => {
      // Si el backend tira 401 (venció o es inválido), borramos el token viejo y mandamos al login
      authService.logout();
      return of(router.parseUrl('/login'));
    })
  );
};
