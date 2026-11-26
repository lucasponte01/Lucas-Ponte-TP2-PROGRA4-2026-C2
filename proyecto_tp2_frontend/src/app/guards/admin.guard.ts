import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/authServices';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.verificacion_logeo()) {
    return router.navigate(['/login']);
  }

  const perfil = localStorage.getItem('perfil');
  if (perfil === 'administrador') {
    return true;
  }

  return router.navigate(['/feed']);
};