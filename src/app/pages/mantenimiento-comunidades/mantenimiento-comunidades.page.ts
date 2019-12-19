import { Component, OnInit, ViewChild, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { ComunidadService } from '../../services/comunidad.service';
import { CuentaComunidadService } from '../../services/cuenta-comunidad.service';

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

  errorPorNombreComunidad = null;
  id_comunidad = null;
  comunidades = null;
  comunidad = {
    id_comunidad : null,
    nombre : null,
  };
  conteoClicModifComunidad = 0;

  cuentasBancariasComunidad = new Array();
  conteoCuentasBancariasComunidad : number;
  nombreCuentaBancariaActual = null;
  cuentaBancariaComunidadIdComunidad = null;

  listado = new Array();
  errores = new Array();

  constructor(
    private comunidadService : ComunidadService,
    private cuentaComunidadService : CuentaComunidadService
  ) { }

  ngOnInit() {
    this.comunidadService.getComunidades().subscribe( respuesta =>
      {
        for (var i = 0 ; i < respuesta['nombre'].length ; i++) {
          this.listado.push({
            "id_comunidad" : respuesta['id_comunidad'][i],
            "nombre" : respuesta['nombre'][i],
          });
        }
      });
    
      // Se pone un id al span de modificar para que no se pueda dar dos veces al mismo botón
    setTimeout(() => {
      var ponerValorSpanListado = document.getElementsByClassName('elemento-listado-accion');
      for (var i = 0; i < ponerValorSpanListado.length; i++) {
        ponerValorSpanListado[i].childNodes[0]['id'] = this.listado[i]['id_comunidad'];
      }
    }, 500);
  }
  
  obtenerComunidades() {
    this.comunidadService.getComunidades().subscribe(result => console.log(result));
  }
  
  
  preparadoModificacion(id_comunidad: number) {
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
    this.comunidadService.seleccionarBancoPorNombre(nombre).subscribe(
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
          window.location.reload();
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
   * @param event 
   */
  modificacionCuentaBancariaSeleccionada(id_comunidad: number) {
    let cuentaBancariaModificarActual = new Array();
    
    cuentaBancariaModificarActual.push({
      "id_cuenta_comunidad" : this.cuentaBancariaComunidadIdComunidad,
      "id_asociativo_banco" : this.elementoIdeAsociativoBanco['el'].value,
      "grupo1" : this.elementoGrupo1['el'].value,
      "grupo2" : this.elementoGrupo2['el'].value,
      "grupo3" : this.elementoGrupo3['el'].value,
      "grupo4" : this.elementoGrupo4['el'].value
    });

    this.cuentaComunidadService.modificarCuentaComunidad(cuentaBancariaModificarActual).subscribe(res => console.log(res));
  }
  onSearchChange(event){}
}
