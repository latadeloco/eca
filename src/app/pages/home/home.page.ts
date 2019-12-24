import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ComunidadService } from '../../services/comunidad.service';
import { CuentaComunidadService } from '../../services/cuenta-comunidad.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild('nuevaComunidadInput', {static : false}) nuevaComunidadInput : ElementRef;
  
  // Nueva cuenta bancaria
  @ViewChild('inputIdAsociativoBanco', {static: false}) idAsociativoBancoInput : ElementRef;
  @ViewChild('inputGrupo1', {static: false}) grupo1Input : ElementRef;
  @ViewChild('inputGrupo2', {static: false}) grupo2Input : ElementRef;
  @ViewChild('inputGrupo3', {static: false}) grupo3Input : ElementRef;
  @ViewChild('inputGrupo4', {static: false}) grupo4Input : ElementRef;

  comunidades = new Array();
  cuentasBancarias = new Array();
  fechaActual = null;

  nuevaComunidad = false;
  nuevaCuentaBancaria = false;

  existeComunidad = false;

  listadoErrores = new Array();

  constructor(
    private comunidadService : ComunidadService,
    private cuentaComunidadService : CuentaComunidadService
  ) {}

  ngOnInit() {
    document.getElementsByClassName('anadirNuevaComunidad')[0]['style'].display = "none";
    document.getElementsByClassName('container-iban-manual')[0]['style'].display = "none";
    document.getElementsByClassName('cancelacomunidad')[0]['style'].display = "none";
    document.getElementsByClassName('cancelacuenta')[0]['style'].display = "none";
    var f = new Date();
    this.fechaActual = (f.getDate() + "/" + (f.getMonth() +1) + "/" + f.getFullYear());
    this.comunidadService.getComunidades().subscribe(res => {
      for (var i = 0 ; i < res['nombre'].length ; i++) {
        this.comunidades.push({
          "id_comunidad" : res['id_comunidad'][i],
          "nombre" : res['nombre'][i]
        });
      }
    });

    var selector = document.getElementsByClassName('selector-comunidades')[0];
    selector.addEventListener('change', (event) => {
      this.cuentasBancarias = [];
      this.cuentaComunidadService.getCuentasComunidad(event.target['value']).subscribe(res => 
        {
          for (var i = 0; i < res['id_asociativo_banco'].length; i++) {
            this.cuentasBancarias.push({
              'id_cuenta_comunidad' : res['id_cuenta_comunidad'][i],
              "id_asociativo_banco" : res['id_asociativo_banco'][i],
              "grupo1" : res['grupo1'][i],
              "grupo2" : res['grupo2'][i],
              "grupo3" : res['grupo3'][i],
              "grupo4" : res['grupo4'][i], 
              "nombre_banco" : res['nombre_banco'][i]
            })
          }
        }
        );
    });
  }

  /**
   * Añade una comunidad en la base de datos
   */
  anadirComunidad(permitir) {
    if (permitir) {
      this.nuevaComunidad = true;
      document.getElementsByClassName('selector-comunidades')[0]['style'].display = "none";
      document.getElementsByClassName('anadirNuevaComunidad')[0]['style'].display = "";
      document.getElementsByClassName('cancelacomunidad')[0]['style'].display = "";
      document.getElementsByClassName('anadircomunidad')[0]['style'].display = "none";
    } else {
      this.nuevaComunidad = false;
      document.getElementsByClassName('selector-comunidades')[0]['style'].display = "";
      document.getElementsByClassName('anadirNuevaComunidad')[0]['style'].display = "none";
      document.getElementsByClassName('cancelacomunidad')[0]['style'].display = "none";
      document.getElementsByClassName('anadircomunidad')[0]['style'].display = "";
    }
  }
  
  /**
   * Añade una cuenta bancaria unida a la cuenta bancaria en la base de datos
   */
  anadirCuentaBancaria(permitir) {
    if (permitir) {
      this.nuevaCuentaBancaria = true;
      document.getElementsByClassName('container-cuentas-existentes')[0]['style'].display = "none";
      document.getElementsByClassName('container-iban-manual')[0]['style'].display = "";
      document.getElementsByClassName('cancelacuenta')[0]['style'].display = "";
      document.getElementsByClassName('anadircuenta')[0]['style'].display = "none";

     // document.getElementsByClassName('idAsociativoBancoClase')[0].addEventListener('blur', this.getCuentaBancaria);
    } else {
      this.nuevaCuentaBancaria = false;
      document.getElementsByClassName('container-cuentas-existentes')[0]['style'].display = "";
      document.getElementsByClassName('container-iban-manual')[0]['style'].display = "none";
      document.getElementsByClassName('cancelacuenta')[0]['style'].display = "none";
      document.getElementsByClassName('anadircuenta')[0]['style'].display = "";
    }
  }

  /**
   * Evento para el id_asociativo_banco en el caso de que pierda el foco y el banco no exista
   * 
   */
  getCuentaBancaria() {
    this.cuentaComunidadService.getCuentasComunidad(id_comunidad).subscribe(res => console.log(res));
  }


  anadirRegistro() {
    if (this.nuevaComunidadInput) {
      if (this.nuevaComunidadInput['el'].value !== "") {
        this.comprobarComunidadExistente(this.nuevaComunidadInput['el'].value);
        setTimeout(() => {
          if (this.existeComunidad) {
            this.listadoErrores.push("La comunidad ya existe en la base de datos");
          }
        }, 500);
      }
    }

/*     if (this.nuevaCuentaBancaria) {
      
    } else {

    }
 */
    setTimeout(() => {
      if (this.listadoErrores.length === 0) {
        //if ()
        this.comunidadService.altaComunidad(this.nuevaComunidadInput['el'].value).subscribe(res => console.log(res));
        setTimeout(() => {
          this.comunidadService.seleccionarUltimaComunidad().subscribe(res => console.log(res));
        }, 300);
      }
    }, 500);
  }

  /**
   * Obtener comunidad si existe
   * @returns boolean
   */
  comprobarComunidadExistente(nombreComunidad: string) {
    this.comunidadService.seleccionarComunidadPorNombre(nombreComunidad).subscribe(res => {
      if (res !== "") {
        this.existeComunidad = true;
      } else {
        this.existeComunidad = false;
      }
    });
    return this.existeComunidad;
  }
}
