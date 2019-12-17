import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MenuInterface } from '../../interfaces/menu-interface';
import { DataService } from '../../services/data-service.service';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

  opcionesMenu : Observable<MenuInterface[]>;

  constructor(
    private menuCtrl : MenuController,
    private dataService : DataService,
  ) { }

  ngOnInit() {
    this.opcionesMenu = this.dataService.getMenuOpts();
  }

  toggle() {
    this.menuCtrl.toggle();
  }
}
