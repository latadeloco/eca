import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BancoService {

  URL = "http://192.168.0.116/eurocaja/api/";
  bancos = null;
  banco = {
    nombre_banco : null,
    id_asociativo_banco : null
  };
  constructor(
    private http : HttpClient,
  ) {

  }
  
  /**
   * Obtener todos los bancos
   * return Observable
   */
  getBancos() {
    return this.http.get(`${this.URL}bancos/bancos.php`);
  }
  
  /**
   * Obtener un banco por id_asociativo_banco
   * params id_asociativo_banco: number
   * return Observable
   */
  seleccionarBancoPorIdAsociado(id_asociativo_banco: number) {
    return this.http.get(`${this.URL}bancos/obtenerBancoPorIdAsociado.php?id_asociativo_banco=${id_asociativo_banco}`);
  }
  
  /**
   * Obtener un banco por nombre_banco
   * params nombre_banco: string
   * return Observable
   */
  seleccionarBancoPorNombre(nombre_banco: string) {
    return this.http.get(`${this.URL}bancos/obtenerBancoPorNombre.php?nombre_banco=${nombre_banco}`);
  }
  
  /**
   * Obtener un banco por id_banco
   * params id_banco : number
   * return Observable
   */
  seleccionarBancoPorId(id_banco: number) {
    return this.http.get(`${this.URL}/bancos/obtenerBancoPorId.php?id_banco=${id_banco}`);
  }
  
  /**
   * Modificar un banco
   * params banco
   * return Observable
   */
  
  modificarBanco(banco) {
    return this.http.post(`${this.URL}/bancos/modificarBanco.php`, JSON.stringify(banco));
  }

  /**
   * Insertar un banco
   * return Observable
   */
  altaBanco(banco) {
    return this.http.post(`${this.URL}bancos/altaBanco.php`, JSON.stringify(banco), {responseType: 'text'});
  }

  /**
   * Eliminar un banco
   * @param id_banco Identificador único de banco
   * @returns Observable
   */
  eliminarBanco(id_banco : number) {
    return this.http.get(`${this.URL}/bancos/bajaBanco.php?id_banco=${id_banco}`);
  }

  /**
   * Seleccionar el último banco
   * @returns Observable
   */
  seleccionarUltimoBanco() {
    return this.http.get(`${this.URL}/bancos/obtenerUltimoBanco.php`);
  }

  /**
   * Obtener bancos dentro de un rango inclusivo
   */
  obtenerBancosDesdeHasta(bancoInicio, bancoFinal) {
    return this.http.get(`${this.URL}/bancos/obtenerBancosDesdeHasta.php?bancoInicio=${bancoInicio}&bancoFinal=${bancoFinal}`);
  }
}
