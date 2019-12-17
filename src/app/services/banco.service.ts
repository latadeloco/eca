import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BancoService {

  URL = "http://localhost/eurocaja/api/";
  bancos = null;
  banco = {
    nombre_banco : null,
    id_asociativo_banco : null
  };
  constructor(
    private http : HttpClient,
  ) {

  }
  
  getBanco() {
    return this.http.get(`${this.URL}bancos/bancos.php`);
  }

  altaBanco(banco) {
    return this.http.post(`${this.URL}bancos/altaBanco.php`, JSON.stringify(banco), {responseType: 'text'});
  }

  bajaUsuario(idUsuario: number) {
    return this.http.get(`${this.URL}BajaUsuario.php?idUsuario=${idUsuario}`);
  }

}
