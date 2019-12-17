import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MantenimientoBancosPageRoutingModule } from './mantenimiento-bancos-routing.module';

import { MantenimientoBancosPage } from './mantenimiento-bancos.page';
import { ComponentModule } from '../../components/component.module';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MantenimientoBancosPageRoutingModule,
    ComponentModule,
    HttpClientModule
  ],
  declarations: [MantenimientoBancosPage]
})
export class MantenimientoBancosPageModule {}
