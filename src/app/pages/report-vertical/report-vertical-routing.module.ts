import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReportVerticalPage } from './report-vertical.page';

const routes: Routes = [
  {
    path: '',
    component: ReportVerticalPage
  },
  {
    path: ':special',
    component: ReportVerticalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportVerticalPageRoutingModule {}
