import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReportVerticalPageRoutingModule } from './report-vertical-routing.module';

import { ReportVerticalPage } from './report-vertical.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReportVerticalPageRoutingModule
  ],
  declarations: [ReportVerticalPage]
})
export class ReportVerticalPageModule {}
