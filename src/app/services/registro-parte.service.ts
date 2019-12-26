import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RegistroParteService {
  URL = "http://192.168.0.116/eurocaja/api/";
  registrosPartes = null;
  registroParte = {
    $id_concepto : null,
    $concepto : null,
    $importe : null,
    $piso : null,
    $fecha : null,
    $id_cuenta_comunidad : null
  };

  constructor(
    private http : HttpClient,
  ) {

  }

  /**
   * Obtener todos los registros del parte de caja
   * @params
   * @return
   */
  getRegistrosPartes() {
    return this.http.get(`${this.URL}registroParte/registros.php`);
  }

  /**
   * Añadir un nuevo registro de parte a día de hoy
   */
  altaRegistroParte(registroParte) {
    return this.http.post(`${this.URL}registroParte/altaRegistro.php`, JSON.stringify(registroParte), {responseType: 'text'});
  }
}