import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)},
  {
    path: 'mantenimiento-comunidades',
    loadChildren: () => import('./pages/mantenimiento-comunidades/mantenimiento-comunidades.module').then( m => m.MantenimientoComunidadesPageModule)
  },
  {
    path: 'mantenimiento-bancos',
    loadChildren: () => import('./pages/mantenimiento-bancos/mantenimiento-bancos.module').then( m => m.MantenimientoBancosPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
