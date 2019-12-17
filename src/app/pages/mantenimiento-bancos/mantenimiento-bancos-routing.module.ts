import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MantenimientoBancosPage } from './mantenimiento-bancos.page';

const routes: Routes = [
  {
    path: '',
    component: MantenimientoBancosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MantenimientoBancosPageRoutingModule {}
