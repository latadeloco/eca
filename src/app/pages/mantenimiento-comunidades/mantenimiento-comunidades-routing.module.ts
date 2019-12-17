import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MantenimientoComunidadesPage } from './mantenimiento-comunidades.page';

const routes: Routes = [
  {
    path: '',
    component: MantenimientoComunidadesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MantenimientoComunidadesPageRoutingModule {}
