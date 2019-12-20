import { Component, OnInit, ViewChild, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { ComunidadService } from '../../services/comunidad.service';
import { CuentaComunidadService } from '../../services/cuenta-comunidad.service';
import { BancoService } from '../../services/banco.service';

@Component({
  selector: 'app-mantenimiento-comunidades',
  templateUrl: './mantenimiento-comunidades.page.html',
  styleUrls: ['./mantenimiento-comunidades.page.scss'],
})
export class MantenimientoComunidadesPage implements OnInit {

  @ViewChild('nombreComunidad', {static : false}) nombreComunidad : ElementRef;
  @ViewChild('eliminarComunidad', {static : false}) botonEliminar : ElementRef;
  @ViewChild('salirComunidad', {static : false}) salirComunidad : ElementRef;
  
  // Elemento de pantalla de modificación de cuentas

  @ViewChild('idAsociativoBanco', {static : false}) elementoIdeAsociativoBanco : ElementRef;
  @ViewChild('grupo1', {static : false}) elementoGrupo1 : ElementRef;
  @ViewChild('grupo2', {static : false}) elementoGrupo2 : ElementRef;
  @ViewChild('grupo3', {static : false}) elementoGrupo3 : ElementRef;
  @ViewChild('grupo4', {static : false}) elementoGrupo4 : ElementRef;

  principal = true;

  errorPorNombreComunidad = null;
  id_comunidad = null;
  comunidades = null;
  comunidad = {
    id_comunidad : null,
    nombre : null,
  };
  conteoClicModifComunidad = 0;
  ultimaComunidadAnadida = null;

  cuentasBancariasComunidad = new Array();
  conteoCuentasBancariasComunidad : number;
  nombreCuentaBancariaActual = null;
  cuentaBancariaComunidadIdComunidad = null;
  tituloCuentaBancariaAModificar = null;
  erroresCuentaBancaria = new Array();


  listado = new Array();
  errores = new Array();


  constructor(
    private comunidadService : ComunidadService,
    private cuentaComunidadService : CuentaComunidadService,
    private bancoService : BancoService
  ) { }

  ngOnInit() {
    this.principal = true;
    this.comunidadService.getComunidades().subscribe( respuesta =>
      {
        for (var i = 0 ; i < respuesta['nombre'].length ; i++) {
          this.listado.push({
            "id_comunidad" : respuesta['id_comunidad'][i],
            "nombre" : respuesta['nombre'][i],
          });
        }
      });
  }
  
  obtenerComunidades() {
    this.comunidadService.getComunidades().subscribe(result => console.log(result));
  }
  
  
  preparadoModificacion(id_comunidad: number) {
    document.getElementsByClassName('modificarComunidadAnadida')[0]['style'].display = "none";
    document.getElementsByClassName('anadirBanca')[0]['style'].display = "";
    // Quitar cartel de no hay cuentas asociadas a la comunidad
    this.principal = false;
    var elementosListadoComunidades = document.getElementsByClassName('container-listado-comunidades')[0];
    elementosListadoComunidades['style'].display = "none"
    //ocultarModificar.children[0].style.display="none";
      // Primero la comunidad seleccionada
      this.comunidadService.seleccionarComunidadPorId(id_comunidad).subscribe(
       res => {
         this.comunidad.id_comunidad = res['id_comunidad'][0];
         this.comunidad.nombre = res['nombre'][0];
         this.nombreComunidad['el'].value = res['nombre'][0];
       }
     );
      var listaClasesBoton = document.getElementsByClassName('contenedor-boton-anadir-comunidad')[0];
      listaClasesBoton.firstChild['classList'].remove('anadirComunidad');
      listaClasesBoton.firstChild['classList'].add('modificarComunidad');
      listaClasesBoton.children[0].innerHTML = "Modificar Comunidad";
      this.botonEliminar['el'].style.display = "";
      this.salirComunidad['el'].style.display = "";
 
     // Preparamos todas las cuentas vinculadas a esa comunidad
     setTimeout(() => {
       this.cuentaComunidadService.getCuentasComunidad(this.comunidad.id_comunidad).subscribe(res => 
         {
             for (var i = 0 ; i < res['id_asociativo_banco'].length; i++) {
               this.cuentasBancariasComunidad.push({
                 'id_banco_fk' : res['id_banco_fk'][i],
                 "id_cuenta_comunidad" : res['id_cuenta_comunidad'][i],
                 "nombre_banco" : res['nombre_banco'][i],
                 "id_asociativo_banco" : res['id_asociativo_banco'][i],
                 "grupo1" : res['grupo1'][i],
                 "grupo2" : res['grupo2'][i],
                 "grupo3" : res['grupo3'][i],
                 "grupo4" : res['grupo4'][i]
               });
             }
         });
     }, 500);
  }

  seleccionarComunidadPorNombre(nombre) {
    this.comunidadService.seleccionarComunidadPorNombre(nombre).subscribe(
      result => (this.errorPorNombreComunidad = result)
    );
  }


  altaOModificacionComunidad() {
    let claseActiva : string;
    //Primero recogemos que id tiene si modificar o anadir comunidad
    var listaClasesBoton = document.getElementsByClassName('contenedor-boton-anadir-comunidad')[0];
    for (var i = 0; i < listaClasesBoton.firstChild['classList'].length; i++) {
      if (listaClasesBoton.firstChild['classList'][i] === 'anadirComunidad') {
        claseActiva = listaClasesBoton.firstChild['classList'][i];
      }
      if (listaClasesBoton.firstChild['classList'][i] === 'modificarComunidad') {
        claseActiva = listaClasesBoton.firstChild['classList'][i];
      }
    }


    if (claseActiva === 'anadirComunidad') {

      this.errores = [];
      // Comprobar el campo nombre
      // Comprobamos el campo de nombre para que no esté repetido
      if (this.comunidad.nombre  == '' || this.comunidad.nombre == null) {
        this.errores.push("El nombre de la comunidad no puede estar vacío");
      }
      this.seleccionarComunidadPorNombre(this.comunidad.nombre);

      // Se da un margen de un segundo y medio para hacer la tarea asíncrona y después comprobar el resto de parámetros
      setTimeout(() => {
        // Se comprueba si el nombre del banco está en la base de datos
        if (this.errorPorNombreComunidad !== "") {
          this.errores.push("El nombre de la comunidad está en la base de datos");
        }

        if (this.errores.length === 0) {
         this.comunidadService.altaComunidad(this.comunidad).subscribe(
          datos => {
            if(datos['resultado'] == 'OK') {
              alert(datos['mensaje']);
              this.obtenerComunidades();
            }
          }
          );

          setTimeout(() => {
            this.listado = [];
            this.comunidadService.getComunidades().subscribe(respuesta => {
              for (var i = 0 ; i < respuesta['nombre'].length ; i++) {
                this.listado.push({
                  "id_comunidad" : respuesta['id_comunidad'][i],
                  "nombre" : respuesta['nombre'][i],
                });
              }
            });

            this.comunidadService.seleccionarUltimaComunidad().subscribe(res => this.ultimaComunidadAnadida = res['maximo'][0]);
            setTimeout(() => {
              document.getElementsByClassName('modificarComunidadAnadida')[0]['style'].display = "";
            }, 10);
          }, 10);

        } else {
          // TO-DO
        }
      }, 500);
    }
    if (claseActiva === 'modificarComunidad') {
      this.comunidadService.modificarComunidad(this.comunidad).subscribe(res => console.log(res));
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  }

  eliminaComunidad(id_comunidad: number) {
    this.comunidadService.eliminarComunidad(id_comunidad).subscribe(res => res);

    setTimeout(() => {
      window.location.reload();
    }, 500);
  }

  /**
   * Modificación de la cuenta bancaria seleccionada
   * @param event 
   */
  modificacionCuentaBancaria(id_cuenta_bancaria) {
    this.cuentaBancariaComunidadIdComunidad = id_cuenta_bancaria;
    var contCuentaComunidad = document.getElementsByClassName('contenedor-cuenta-clicada')[0];
    contCuentaComunidad['style'].display = "";
    this.cuentaComunidadService.seleccionarCuentaBancariaComunidadPorId(id_cuenta_bancaria).subscribe(res => {
      this.elementoIdeAsociativoBanco['value'] = res['id_asociativo_banco'];
      this.elementoGrupo1['value'] = res['grupo1'];
      this.elementoGrupo2['value'] = res['grupo2'];
      this.elementoGrupo3['value'] = res['grupo3'];
      this.elementoGrupo4['value'] = res['grupo4'];
      this.tituloCuentaBancariaAModificar =   this.elementoIdeAsociativoBanco['el'].value + " " + this.elementoGrupo1['el'].value + " "
                                            + this.elementoGrupo1['el'].value + " " + this.elementoGrupo3['el'].value + " "
                                            + this.elementoGrupo4['el'].value
    });
  }

  /**
   * Eliminación de cuenta bancaria unida a la comunidad
   * @param event 
   */
  eliminacionCuentaBancaria(id_cuenta_comunidad: number, id_cuenta_actual : number) {
    this.cuentaComunidadService.eliminarCuentaBancaria(id_cuenta_comunidad).subscribe(res => (res));

    //Pasamos a eliminar el elemento de DOM
    var cuentaEliminadaActual = document.getElementById(id_cuenta_actual.toString());
    cuentaEliminadaActual.parentNode.removeChild(cuentaEliminadaActual);
  }

  /**
   * Alta de una nueva cuenta bancaria unida a una comunidad
   * @param id_comunidad id de comunidad para comprobarla y ponerla en DOM 
   */
  modificacionCuentaBancariaSeleccionada(id_comunidad: number) {
    this.erroresCuentaBancaria = [];
    let cuentaBancariaModificarActual = new Array();
    let existeBanco = false;
    cuentaBancariaModificarActual.push({
      "id_cuenta_comunidad" : this.cuentaBancariaComunidadIdComunidad,
      "id_asociativo_banco" : this.elementoIdeAsociativoBanco['el'].value,
      "grupo1" : this.elementoGrupo1['el'].value,
      "grupo2" : this.elementoGrupo2['el'].value,
      "grupo3" : this.elementoGrupo3['el'].value,
      "grupo4" : this.elementoGrupo4['el'].value,
      
    });

    // Comprobaciones de campos para sean una cadena de 4 dígitos exactos
    // Se comprueba si vienen en array o como cadena y se hace las comprobaciones
    
    // comprobamos campo id_asociativo_banco si es array o no
    if (Array.isArray(this.elementoIdeAsociativoBanco['el'].value)) {
      if (this.comprobarContenidoDelCampo(this.elementoIdeAsociativoBanco['el'].value[0], true) !== "") {
        this.erroresCuentaBancaria.push("El código identificativo del banco tiene que ser de 4 dígitos exactos");
      }
    } else {
      if (this.comprobarContenidoDelCampo(this.elementoIdeAsociativoBanco['el'].value, true) !== "") {
        this.erroresCuentaBancaria.push("El código identificativo del banco tiene que ser de 4 dígitos exactos");
      }
    }

    // comprobamos campo grupo1 si es array o no
    if (Array.isArray(this.elementoGrupo1['el'].value)) {
      if (this.comprobarContenidoDelCampo(this.elementoGrupo1['el'].value[0], true) !== "") {
      this.erroresCuentaBancaria.push("El grupo 1 asociado al banco tiene que ser de 4 dígitos exactos");
      }
    } else {
      if (this.comprobarContenidoDelCampo(this.elementoGrupo1['el'].value, true) !== "") {
        this.erroresCuentaBancaria.push("El grupo 1 asociado al banco tiene que ser de 4 dígitos exactos");
      }
    }

    // comprobamos campo grupo2 si es array o no
    if (Array.isArray(this.elementoGrupo2['el'].value)) {
      if (this.comprobarContenidoDelCampo(this.elementoGrupo2['el'].value[0], true) !== "") {
      this.erroresCuentaBancaria.push("El grupo 2 asociado al banco tiene que ser de 4 dígitos exactos");
      }
    } else {
      if (this.comprobarContenidoDelCampo(this.elementoGrupo2['el'].value, true) !== "") {
      this.erroresCuentaBancaria.push("El grupo 2 asociado al banco tiene que ser de 4 dígitos exactos");
      }
    }

    // comprobamos campo grupo3 si es array o no
    if (Array.isArray(this.elementoGrupo3['el'].value)) {
      if (this.comprobarContenidoDelCampo(this.elementoGrupo3['el'].value[0], true) !== "") {
      this.erroresCuentaBancaria.push("El grupo 3 asociado al banco tiene que ser de 4 dígitos exactos");
      }
    } else {
      if (this.comprobarContenidoDelCampo(this.elementoGrupo3['el'].value, true) !== "") {
      this.erroresCuentaBancaria.push("El grupo 3 asociado al banco tiene que ser de 4 dígitos exactos");
      }
    }

    // comprobamos campo grupo4 si es array o no
    if (Array.isArray(this.elementoGrupo4['el'].value)) {
      if (this.comprobarContenidoDelCampo(this.elementoGrupo4['el'].value[0], true) !== "") {
      this.erroresCuentaBancaria.push("El grupo 4 asociado al banco tiene que ser de 4 dígitos exactos");
      }
    } else {
      if (this.comprobarContenidoDelCampo(this.elementoGrupo4['el'].value, true) !== "") {
      this.erroresCuentaBancaria.push("El grupo 4 asociado al banco tiene que ser de 4 dígitos exactos");
      }
    }

    if (this.erroresCuentaBancaria.length === 0) {
      this.bancoService.seleccionarBancoPorIdAsociado(cuentaBancariaModificarActual[0]['id_asociativo_banco'][0]).subscribe(res => 
        {
          if (res !== "") {
            existeBanco = true;
          }
        });
  
      setTimeout(() => {
        if (existeBanco) {
          this.cuentaComunidadService.modificarCuentaComunidad(cuentaBancariaModificarActual).subscribe(res => console.log(res));
        } else {
          if (confirm("El Código identificativo del banco no existe ¿Desea crearlo?")) {
            var nombreBanco = prompt("Introduzca el nombre del banco");
            var existeNombreBanco = true;
            this.bancoService.seleccionarBancoPorNombre(nombreBanco).subscribe(res => {
              if (res === "") {
                existeNombreBanco = false;
              }
            });

            setTimeout(() => {
              if (!existeNombreBanco) {
                this.comprobarContenidoDelCampo(nombreBanco, true);
                let bancoAIngresar = {
                  nombreBanco : nombreBanco,
                  idAsociativoBanco : cuentaBancariaModificarActual[0]['id_asociativo_banco']
                }
                this.bancoService.altaBanco(bancoAIngresar).subscribe(res => (res));
                this.cuentaComunidadService.modificarCuentaComunidad(cuentaBancariaModificarActual).subscribe(res => res);
              } else {
                // TO-DO
                console.log("El nombre del banco ya existe en la base de datos");
              }
            }, 300);
          }
        }
      }, 500);
    } else {
      setTimeout(() => {
        // TO-DO
        console.log(this.erroresCuentaBancaria);
      }, 400);
    }
  }

  /**
   * Comprobar si hay contenido
   * @param variable : (string) Se asigna a la variable para comprobar los campos de la cuenta bancaria
   * @param numero : (boolean) true si es número, false si no lo es
   * @returns devuelve la variable o "" si ha fallado.
   */
  comprobarContenidoDelCampo(variable: string, numero: boolean) : string {
    if (numero) {
      if(!/^([0-9]{4})$/.test(variable)) {
        return variable;
      }
        return "";
      
      } else {
      if (variable !== "" || variable !== null) {
        var booleano = this.bancoService.seleccionarBancoPorNombre(variable).subscribe(
          result => {
            if (result !== "") {
              return variable;
            }
          }
        );
        setTimeout(() => {
          console.log(booleano);
          return variable;
        }, 400);
      } else {
        return "";
      }
    }
  }

  /**
   * Se redirecciona al panel de Cuenta Bancaria
   */
  redireccionComponenteCuentaClicada() {
    document.getElementsByClassName('contenedor-cuenta-clicada')[0]['style'].display = "";
  }

  /**
   * Alta de una nueva cuenta bancaria asociada directamente a una comunidad
   * @param id_comunidad 
   */
  altaCuentaBancaria(id_comunidad: number) {

  }














}
