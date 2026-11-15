import { Routes } from '@angular/router';
import { authGuard } from './guards/authGuard';

export const routes: Routes = [
    {
         path: '',
        redirectTo: 'login',
        pathMatch: 'full'
        
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
];
