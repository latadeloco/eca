import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ComunidadService {
  URL = "http://192.168.0.116/eurocaja/api/";
  comunidades = null;
  comunidad = {
    nombre : null
  };
  constructor(
    private http : HttpClient,
  ) {

  }

  /**
   * Obtener todos los bancos
   * return Observable
   */
  getComunidades() {
    return this.http.get(`${this.URL}comunidades/comunidades.php`);
  }

  /**
   * Obtener una comunidad por id_comunidad
   * @params id_banco : number
   * @return Observable
   */
  seleccionarComunidadPorId(id_comunidad: number) {
    return this.http.get(`${this.URL}comunidades/obtenerComunidadPorId.php?id_comunidad=${id_comunidad}`);
  }

  /**
   * Obtener una comunidad por nombre
   * @params nombre: string
   * @return Observable
   */
  seleccionarComunidadPorNombre(nombre: string) {
    return this.http.get(`${this.URL}comunidades/obtenerComunidadPorNombre.php?nombre=${nombre}`);
  }

  /**
   * Modificar una comunidad
   * @params comunidad : Object
   * @return Observable
   */

  modificarComunidad(comunidad) {
    return this.http.post(`${this.URL}comunidades/modificarComunidad.php`, JSON.stringify(comunidad), {responseType : 'text'});
  }

  /**
   * Insertar una comunidad
   * @params banco : Object
   * @return Observable
   */
  altaComunidad(comunidad) {
    return this.http.post(`${this.URL}comunidades/altaComunidades.php`, JSON.stringify(comunidad), {responseType: 'text'});
  }

  /**
   * Eliminar un banco
   * @param id_banco Identificador único de banco
   * @returns Observable
   */
  eliminarComunidad(id_comunidad : number) {
    return this.http.get(`${this.URL}comunidades/bajaComunidad.php?id_comunidad=${id_comunidad}`);
  }

  /**
   * Selecciona la última comunidad
   * @returns Observable
   */
  seleccionarUltimaComunidad() {
    return this.http.get(`${this.URL}comunidades/obtenerUltimaComunidad.php`)
  }
}
