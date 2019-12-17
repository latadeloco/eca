import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MenuInterface } from '../interfaces/menu-interface';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(
    private http : HttpClient
  ) { }

  getMenuOpts() {
    return this.http.get<MenuInterface[]>('/assets/data/menu.json');
  }
}
