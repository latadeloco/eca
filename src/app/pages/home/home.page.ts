import { Component, OnInit, ViewChild, ElementRef, ɵConsole } from '@angular/core';
import { ComunidadService } from '../../services/comunidad.service';
import { CuentaComunidadService } from '../../services/cuenta-comunidad.service';
import { BancoService } from '../../services/banco.service';
import { RegistroParteService } from '../../services/registro-parte.service';

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

  // Resto de elementos para el parte
  @ViewChild('importe', {static : false}) importeInput : ElementRef;
  @ViewChild('concepto', {static : false}) conceptoInput : ElementRef;
  @ViewChild('piso', {static : false}) pisoInput : ElementRef;

  comunidades = new Array();
  cuentasBancarias = new Array();
  fechaActual = null;

  nuevaComunidad = false;
  nuevaCuentaBancaria = false;

  existeComunidad = false;

  listadoErrores = new Array();

  // propiedades a ingresar
  ultimaComunidadSeleccionada = null;
  ultimaIdCuentaComunidadSeleccionada = null;

  // propiedades para anadirRegistro finales, hacer el registro de parte de caja del día
  comunidadIngresada = null;
  cuentaComunidadIngresada = null;
  ingresoAnadido = null;
  conceptoIngresado = null;
  pisoIngresado = null;

  idBancoExiste = null;
  nombreBancoExiste = true;
  ultimoBancoSeleccionado = null;

  listadoRegistrosParte = new Array();

  constructor(
    private comunidadService : ComunidadService,
    private cuentaComunidadService : CuentaComunidadService,
    private bancoService : BancoService,
    private registroParteService : RegistroParteService
  ) {}

  ngOnInit() {
    document.getElementsByClassName('anadirNuevaComunidad')[0]['style'].display = "none";
    document.getElementsByClassName('container-iban-manual')[0]['style'].display = "none";
    document.getElementsByClassName('cancelacomunidad')[0]['style'].display = "none";
    document.getElementsByClassName('cancelacuenta')[0]['style'].display = "none";
    var f = new Date();
    let mes = f.getMonth()+1;
    this.fechaActual = f.getFullYear() + "-" + mes + "-" + f.getDate();
    this.comunidadService.getComunidades().subscribe(res => {
      for (var i = 0 ; i < res['nombre'].length ; i++) {
        this.comunidades.push({
          "id_comunidad" : res['id_comunidad'][i],
          "nombre" : res['nombre'][i]
        });
      }
    });

    var selectorComunidades = document.getElementsByClassName('selector-comunidades')[0];
    var selectorCuentasBancarias = document.getElementsByClassName('selector-cuentas-bancarias')[0];
    selectorComunidades.addEventListener('change', (event) => {
      
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

        this.ultimaComunidadSeleccionada = event.target['value'];
        setTimeout(() => {
          this.ultimaIdCuentaComunidadSeleccionada = selectorCuentasBancarias['value'];
        }, 200);
      });

      selectorCuentasBancarias.addEventListener('change', (event) => {
        this.ultimaIdCuentaComunidadSeleccionada = event.target['value'];
    });

    this.registroParteService.getRegistrosPartes().subscribe(res => {
      for (let i = 0; i < res['nombre_comunidad'].length; i++) {
        this.listadoRegistrosParte.push({
          "nombre_comunidad" : res['nombre_comunidad'][i],
          "concepto" : res['concepto'][i],
          "importe" : res['importe'][i],
          "id_asociativo_banco" : res['id_asociativo_banco'][i],
          "grupo1" : res['grupo1'][i],
          "grupo2" : res['grupo2'][i],
          "grupo3" : res['grupo3'][i],
          "grupo4" : res['grupo4'][i],
          "piso" : res['piso'][i],
          "nombre_banco" : res['nombre_banco'][i],
          "fecha" : res['fecha'][i]
        });
      }
    });
  }

  /**
   * Añade una comunidad en la base de datos
   */
  anadirComunidad(permitir) {
    if (permitir) {
      this.nuevaComunidad = true;
      this.nuevaCuentaBancaria = true;
      document.getElementsByClassName('selector-comunidades')[0]['style'].display = "none";
      document.getElementsByClassName('anadirNuevaComunidad')[0]['style'].display = "";
      document.getElementsByClassName('cancelacomunidad')[0]['style'].display = "";
      document.getElementsByClassName('anadircomunidad')[0]['style'].display = "none";

      // al tener que agregar una nueva comunidad también se tendrá que agregar una nueva cuenta bancaria asociada a ella
      document.getElementsByClassName('container-cuentas-existentes')[0]['style'].display = "none";
      document.getElementsByClassName('container-iban-manual')[0]['style'].display = "";
      document.getElementsByClassName('anadircuenta')[0]['style'].display = "none";
      document.getElementsByClassName('cancelacuenta')[0]['style'].display = "none";
    } else {
      this.nuevaComunidad = false;
      this.nuevaCuentaBancaria = false;
      document.getElementsByClassName('selector-comunidades')[0]['style'].display = "";
      document.getElementsByClassName('anadirNuevaComunidad')[0]['style'].display = "none";
      document.getElementsByClassName('cancelacomunidad')[0]['style'].display = "none";
      document.getElementsByClassName('anadircomunidad')[0]['style'].display = "";

      // se hace justo lo opuesto
      document.getElementsByClassName('container-cuentas-existentes')[0]['style'].display = "";
      document.getElementsByClassName('container-iban-manual')[0]['style'].display = "none";
      document.getElementsByClassName('anadircuenta')[0]['style'].display = "";

      // se hace otra peticion al servidor para pedir toda la información de las comunidades y cuentas asociadas a ellas
      this.comunidades = [];
      this.comunidadService.getComunidades().subscribe(res => {
        for (var i = 0 ; i < res['nombre'].length ; i++) {
          this.comunidades.push({
            "id_comunidad" : res['id_comunidad'][i],
            "nombre" : res['nombre'][i]
          });
        }
      });
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
  getCuentaBancaria(id_comunidad) {
    this.cuentaComunidadService.getCuentasComunidad(id_comunidad).subscribe(res => console.log(res));
  }

  /**
   * Añadir un nuevo registro al parte de caja de hoy (fecha por default del día de hoy)
   */
  anadirRegistro() {
    this.listadoErrores = [];
    this.idBancoExiste = null;
    this.nombreBancoExiste = true;
    this.ultimoBancoSeleccionado = null;
    let cuentaComunidadBancariaActual = null;

    if (this.nuevaComunidad) {
      if (this.nuevaComunidadInput['el'].value !== "") {
        this.comprobarComunidadExistente(this.nuevaComunidadInput['el'].value);
        setTimeout(() => {
          if (this.existeComunidad) {
            this.listadoErrores.push("La comunidad ya existe en la base de datos");
          }
        }, 500);
      } else {
        this.listadoErrores.push("El nombre de la comunidad no puede estar vacío");
      }
    }

    if (this.nuevaCuentaBancaria) {
      if (this.idAsociativoBancoInput !== null) {
        this.bancoService.seleccionarBancoPorIdAsociado(this.idAsociativoBancoInput['el'].value).subscribe(res => {
            if (res !== "") {
              this.idBancoExiste = true;
            }
        });
        setTimeout(() => {
          if (!this.idBancoExiste) {
            var confirmacion = confirm("El Código identificativo que está ingresando no está relacionado con ningún banco ¿Desea crear un nuevo banco?");

            if(confirmacion) {
              // comprobaciones
              if (this.comprobarContenidoDelCampo(this.idAsociativoBancoInput['el'].value, true) !== "") {
                var nombreDelBanco = prompt("Introduce el nombre del Banco al que va a ir asociado");

                this.bancoService.seleccionarBancoPorNombre(nombreDelBanco).subscribe(res => {
                  if (res !== null) {
                    this.nombreBancoExiste = false;
                  }
                });
                setTimeout(() => {
                  if(!this.nombreBancoExiste) {
                    let bancoNuevo = {
                      "nombreBanco" : nombreDelBanco,
                      "idAsociativoBanco" : this.idAsociativoBancoInput['el'].value
                    }
                    this.bancoService.altaBanco(bancoNuevo).subscribe(res => console.log(res));
                  }
                }, 200);
              } else {
                console.log(this.comprobarContenidoDelCampo(this.idAsociativoBancoInput['el'].value, true));
                this.listadoErrores.push("El Código identificativo del banco tiene que tener exactamente 4 dígitos");
              }
            }
          }
        }, 500);
      }
      if (this.grupo1Input === null || this.comprobarContenidoDelCampo(this.grupo1Input['el'].value, true) === "") {
        this.listadoErrores.push("El grupo 1 tiene que tener exactamente 4 dígitos");
      }
      if (this.grupo2Input === null || this.comprobarContenidoDelCampo(this.grupo2Input['el'].value, true) === "") {
        this.listadoErrores.push("El grupo 2 tiene que tener exactamente 4 dígitos");
      }
      if (this.grupo3Input === null || this.comprobarContenidoDelCampo(this.grupo3Input['el'].value, true) === "") {
        this.listadoErrores.push("El grupo 3 tiene que tener exactamente 4 dígitos");
      }
      if (this.grupo4Input === null || this.comprobarContenidoDelCampo(this.grupo4Input['el'].value, true) === "") {
        this.listadoErrores.push("El grupo 4 tiene que tener exactamente 4 dígitos");
      }
    } else {
      //TO-DO
    }

    // Verificamos que el importe tenga contenido numérico
    if (!(/^([0-9])*([\,|\.]([0-9]{2}))?$/.test(this.importeInput['el'].value))) {
      this.listadoErrores.push("El importe tiene que ser númerico con dos números decimales")
    }

    // Verificamos que el concepto no esté vacío
    if (this.conceptoInput['el'].value === "" || this.conceptoInput['el'].value === null) {
      this.listadoErrores.push("El concepto no puede estar vacío")
    }

    setTimeout(() => {
      if (this.listadoErrores.length === 0) {
        // en el caso que se le de a una comunidad nueva
        if (this.nuevaComunidad) {
          console.log("estoy dentro")
          this.comunidadService.altaComunidad(this.nuevaComunidadInput['el'].value).subscribe(res => console.log(res));
          setTimeout(() => {
            this.comunidadService.seleccionarUltimaComunidad().subscribe(res => this.ultimaComunidadSeleccionada = res['maximo'][0]);
            setTimeout(() => {
              cuentaComunidadBancariaActual = {
                'id_asociativo_banco' : this.idAsociativoBancoInput['el'].value,
                'grupo1' : this.grupo1Input['el'].value,
                'grupo2' : this.grupo2Input['el'].value,
                'grupo3' : this.grupo3Input['el'].value,
                'grupo4' : this.grupo4Input['el'].value,
                'id_comunidad' : this.ultimaComunidadSeleccionada
              }
              this.cuentaComunidadService.altaCuentaBancariaComunidad(cuentaComunidadBancariaActual).subscribe(res => console.log(res));

              setTimeout(() => {
                this.cuentaComunidadService.seleecionarUltimaCuentaBancaria().subscribe(res => this.ultimaIdCuentaComunidadSeleccionada = res['maximo'][0]);
              }, 300);
            }, 300);
          }, 300);
        }
        // en el caso que se le de a una cuenta bancaria nueva con una comunidad ya creada
        if (!this.nuevaComunidad && this.nuevaCuentaBancaria) {
          cuentaComunidadBancariaActual = {
                'id_asociativo_banco' : this.idAsociativoBancoInput['el'].value,
                'grupo1' : this.grupo1Input['el'].value,
                'grupo2' : this.grupo2Input['el'].value,
                'grupo3' : this.grupo3Input['el'].value,
                'grupo4' : this.grupo4Input['el'].value,
                'id_comunidad' : this.ultimaComunidadSeleccionada
          }

          this.cuentaComunidadService.altaCuentaBancariaComunidad(cuentaComunidadBancariaActual).subscribe(res => console.log(res));
          setTimeout(() => {
            this.cuentaComunidadService.seleecionarUltimaCuentaBancaria().subscribe(res => this.ultimaIdCuentaComunidadSeleccionada = res['maximo'][0]);
          }, 200);
        }

        setTimeout(() => {
          let registroParte = [];
          let f = new Date();
          let mes = f.getMonth()+1;
          console.log(this.ultimaIdCuentaComunidadSeleccionada);
          registroParte.push({
            "concepto" : this.conceptoInput['el'].value,
            "importe"  : this.importeInput['el'].value,
            "piso"     : this.pisoInput['el'].value,
            "fecha"    : f.getFullYear() + "-" + mes + "-" + f.getDate(),
            "id_cuenta_comunidad" : this.ultimaIdCuentaComunidadSeleccionada
          });

          this.registroParteService.altaRegistroParte(registroParte).subscribe(res => (res));

          window.location.reload();
        }, 1000);
      } else {
        //TO-DO
        console.log(this.listadoErrores);
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

  /**
   * Comprobar si hay contenido
   * @param variable : (string) Se asigna a la variable para comprobar los campos de la cuenta bancaria
   * @param numero : (boolean) true si es número, false si no lo es
   * @returns devuelve la variable o "" si ha fallado.
   */
  comprobarContenidoDelCampo(variable: string, numero: boolean) : string {
    if (numero) {
      if(/^([0-9]{4})$/.test(variable)) {
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
}
