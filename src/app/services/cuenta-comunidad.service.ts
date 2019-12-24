import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CuentaComunidadService {
  URL = "http://192.168.0.116/eurocaja/api/";
  cuentasComunidades = null;
  cuentaComunidad = {
    id_asociativo_cuenta_banco : null,
    grupo1 : null,
    grupo2 : null,
    grupo3 : null,
    grupo4 : null,
    id_comunidad : null
  };
  constructor(
    private http : HttpClient,
  ) {

  }

  /**
   * Obtener las cuentas de la comunidad seleccionada
   * @params
   * @return
   */
  getCuentasComunidad(id_comunidad) {
    return this.http.get(`${this.URL}cuentasComunidades/obtenerCuentasComunidad.php?id_comunidad=${id_comunidad}`);
  }

  /**
   * Obtener una comunidad por id_comunidad
   * @params id_banco : number
   * @return Observable
   */
  seleccionarCuentaBancariaComunidadPorId(id_cuenta_comunidad: number) {
    return this.http.get(`${this.URL}cuentasComunidades/obtenerCuentaComunidadPorId.php?id_cuenta_comunidad=${id_cuenta_comunidad}`);
  }

  /**
   * Modificar una comunidad
   * @params comunidad : Object
   * @return Observable
   */

  modificarCuentaComunidad(cuentaBancaria) {
    return this.http.post(`${this.URL}cuentasComunidades/modificarCuentaComunidad.php`, JSON.stringify(cuentaBancaria), {responseType : 'text'});
  }

  /**
   * Insertar una comunidad
   * @params banco : Object
   * @return Observable
   */
  altaCuentaBancariaComunidad(cuentaComunidad) {
    return this.http.post(`${this.URL}cuentasComunidades/altaCuentaBancaria.php`, JSON.stringify(cuentaComunidad), {responseType: 'text'});
  }

  /**
   * Eliminar un banco
   * @param id_banco Identificador único de banco
   * @returns Observable
   */
  eliminarCuentaBancaria(id_cuenta_comunidad : number) {
    return this.http.get(`${this.URL}cuentasComunidades/bajaCuentaBancaria.php?id_cuenta_comunidad=${id_cuenta_comunidad}`);
  }

  /**
   * Obtiene la última cuenta de la comunidad seleccionada
   * @param 
   */
  seleecionarUltimaCuentaBancaria(){
    return this.http.get(`${this.URL}cuentasComunidades/obtenerUltimaCuentaBancaria.php`);
  }
}
