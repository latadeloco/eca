import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { logotipo } from '../../../environments/environment.prod';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  logo = logotipo.img;
  banco = "hola";
  constructor(
    private menuCtrl : MenuController,
    private ruta : Router
  ) { }

  ngOnInit() {}

  toggle() {
    this.menuCtrl.toggle();
  }

  porDondeFiltrar() {
    //document.getElementsByClassName('barra-busqueda')[0]['style'].display = "none";
  }

  hacerReport() {
    /* let navigationExtras: NavigationExtras = {
      queryParams: {
        special: JSON.stringify(this.banco)
      }
    };
    this.ruta.navigate(['report-vertical'], navigationExtras); */

    document.getElementsByClassName('filtro-busqueda')[0]['style'].display = "";
  }
}
