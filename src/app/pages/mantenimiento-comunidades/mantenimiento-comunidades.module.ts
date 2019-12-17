import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MantenimientoComunidadesPageRoutingModule } from './mantenimiento-comunidades-routing.module';

import { MantenimientoComunidadesPage } from './mantenimiento-comunidades.page';
import { ComponentModule } from '../../components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MantenimientoComunidadesPageRoutingModule,
    ComponentModule
  ],
  declarations: [MantenimientoComunidadesPage]
})
export class MantenimientoComunidadesPageModule {}
