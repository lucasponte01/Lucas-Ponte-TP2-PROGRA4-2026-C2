import { Routes } from '@angular/router';
import { authGuard } from './guards/authGuard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
    {
        path: '',
        
        loadComponent: () => import('../app/components/ui/splash-component/splash-component').then(m => m.SplashComponent),
    },
    {
        path: 'login',
        loadComponent: () => import('./pages/login/login').then(m => m.Login),
        
    },
    {
        path: 'registro',
        loadComponent: () => import('./pages/registro/registro').then(m => m.Registro),
        //canActivate: [authGuard]
    }, 
    {
        path: 'feed',
        loadComponent: () => import('./pages/feed/feed').then(m => m.Feed),
        //canActivate: [authGuard]
    }, 
    {
        path: 'crear-publicacion',
        loadComponent: () => import('./pages/crear-publi/crear-publi').then(m => m.CrearPubli),
        //canActivate: [authGuard]
    }, 
    {
        path:'detalles-publis/:id',
        loadComponent: () => import('./pages/detalles-publis/detalles-publis').then(m => m.DetallesPublis),
    },
    {
        path: 'perfil',
        loadComponent: () => import('./pages/perfil/perfil').then(m => m.Perfil),
        //canActivate: [authGuard]
    }, 
    {
        path:'usuarios_admin',
        loadComponent: () => import('./pages/usuarios-admin/usuarios-admin').then(m => m.UsuariosAdmin),
        canActivate:[adminGuard]
    },
    {
        path:'estadisticas_admin',
        loadComponent: () => import('./pages/estadisticas-admin/estadisticas-admin').then(m => m.EstadisticasAdmin),
        canActivate:[adminGuard]
    }
];
