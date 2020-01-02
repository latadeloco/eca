import { Component, OnInit, ViewChild, ElementRef, ɵConsole } from '@angular/core';
import { ComunidadService } from '../../services/comunidad.service';
import { CuentaComunidadService } from '../../services/cuenta-comunidad.service';
import { BancoService } from '../../services/banco.service';
import { RegistroParteService } from '../../services/registro-parte.service';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { logotipoPDF } from '../../../environments/environment';
import { ToastController } from '@ionic/angular';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
var alertify = require('alertifyjs');

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  logotipoPDF = logotipoPDF.img;

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
  @ViewChild('fecha', {static : false}) fechaInput : ElementRef;

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
  totalRegistradoActual = 0;

  filtroBanco = new Array();
  filtroBancoActivo = null;
  filtroFechaActivo = null;

  listadoAObtenerEnPDF = new Array();
  pdf : any;

  constructor(
    private comunidadService : ComunidadService,
    private cuentaComunidadService : CuentaComunidadService,
    private bancoService : BancoService,
    private registroParteService : RegistroParteService,
    private toastController : ToastController
  ) {

    
  }

  ngOnInit() {
    this.bancoService.getBancos().subscribe(res => {
      for (let i = 0; i < res['id_banco'].length; i++) {
        this.filtroBanco.push({
          'id_banco' : res['id_banco'][i],
          'nombre_banco' : res['nombre_banco'][i]
        })
        
      }
    });

    document.getElementsByClassName('anadirNuevaComunidad')[0]['style'].display = "none";
    document.getElementsByClassName('container-iban-manual')[0]['style'].display = "none";
    document.getElementsByClassName('cancelacomunidad')[0]['style'].display = "none";
    document.getElementsByClassName('cancelacuenta')[0]['style'].display = "none";
    var f = new Date();
    let mes = f.getMonth()+1;
    let mesconcero = "";
    let dia = f.getDate();
    let diaconcero = "";
    if (mes <= 9) {
      mesconcero = "0" + mes.toString()
    } else {
      mesconcero = mes.toString();
    }
    if (dia <= 9) {
      diaconcero = "0" + dia.toString();
    } else{
      diaconcero = dia.toString();
    }
    console.log(mesconcero);
    this.fechaActual = f.getFullYear() + "-" + mesconcero + "-" + diaconcero;
    console.log(this.fechaActual);
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
      console.log(res)
      for (let i = 0; i < res['nombre_comunidad'].length; i++) {
        if (res['fecha'][i] === this.fechaActual) {
          this.totalRegistradoActual = this.totalRegistradoActual + Number(res['importe'][i]);
        }
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
    var a = document.getElementsByClassName('fecha')[0]['value'] = this.fechaActual;
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
                      "nombre_banco" : nombreDelBanco,
                      "id_asociativo_banco" : this.idAsociativoBancoInput['el'].value
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
    }

    // Verificamos que el importe tenga contenido numérico y que tenga contenido
    if (this.importeInput['el'].value === "") {
      this.listadoErrores.push("El importe no puede estar vacío");
    }
    if (!(/^([0-9])*([\,|\.]([0-9]{2}))?$/.test(this.importeInput['el'].value))) {
      this.listadoErrores.push("El importe tiene que ser númerico (parte entera de 6 máximo) con dos números decimales")
    }

    // Verificamos que el concepto no esté vacío
    if (this.conceptoInput['el'].value === "" || this.conceptoInput['el'].value === null) {
      this.listadoErrores.push("El concepto no puede estar vacío")
    }

    setTimeout(() => {
      if (this.listadoErrores.length === 0) {
        // en el caso que se le de a una comunidad nueva
        if (this.nuevaComunidad) {
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
          setTimeout(() => {
            this.bancoService.getBancos().subscribe(res => (res));
            cuentaComunidadBancariaActual = {
                  'id_asociativo_banco' : this.idAsociativoBancoInput['el'].value,
                  'grupo1' : this.grupo1Input['el'].value,
                  'grupo2' : this.grupo2Input['el'].value,
                  'grupo3' : this.grupo3Input['el'].value,
                  'grupo4' : this.grupo4Input['el'].value,
                  'id_comunidad' : this.ultimaComunidadSeleccionada
            }
  
            this.cuentaComunidadService.altaCuentaBancariaComunidad(cuentaComunidadBancariaActual).subscribe(res => {
              console.log("Aquí se crearia la cuenta bancaria asociada a la comunidad")
              console.log(res)
            });
            setTimeout(() => {
              this.cuentaComunidadService.seleecionarUltimaCuentaBancaria().subscribe(res => {
                this.ultimaIdCuentaComunidadSeleccionada = res['maximo'][0]
              });
            }, 200);
          }, 300);
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
            "fecha"    : document.getElementsByClassName('fecha')[0]['value'],
            "id_cuenta_comunidad" : this.ultimaIdCuentaComunidadSeleccionada
          });

          this.registroParteService.altaRegistroParte(registroParte).subscribe(res => (res));

          window.location.reload();
        }, 1000);
      } else {
        if (this.listadoErrores.length >= 2) {
          this.presentToast("Hay varios errores, revisa todos los campos")
          setTimeout(() => {
            document.getElementsByClassName('mensajeAdvertencia')[0]['style']['textAlign'] = "center";
          }, 50);
        } else {
          this.presentToast(this.listadoErrores)
          setTimeout(() => {
            document.getElementsByClassName('mensajeAdvertencia')[0]['style']['textAlign'] = "center";
          }, 50);
        }
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


  /**
   * Cierra el card de filtro de búsqueda
   */
  cerrarFiltroBusqueda() {
    document.getElementsByClassName('filtro-busqueda')[0]['style'].display = "none";
  }

  /**
   * Añadir en el filtro un rango de bancos
   */

  anadirRangoFiltroBanco() {
    this.filtroBancoActivo = true;
    document.getElementsByClassName('container-filtro-banco-desde-cabecera')[0]['style'].display = "";
    document.getElementsByClassName('container-filtro-seleccion-hasta-banco')[0]['style'].display = "";
    document.getElementsByClassName('boton-filtro-anadir-banco')[0]['style'].display = "none";
    document.getElementsByClassName('boton-filtro-cerrar-banco')[0]['style'].display = "";
  }

  /**
   * Quita la opción del filtro por banco
   */

  quitarFiltroBanco() {
    this.filtroBancoActivo = false;
    document.getElementsByClassName('container-filtro-banco-desde-cabecera')[0]['style'].display = "none";
    document.getElementsByClassName('container-filtro-seleccion-hasta-banco')[0]['style'].display = "none";
    document.getElementsByClassName('boton-filtro-anadir-banco')[0]['style'].display = "";
    document.getElementsByClassName('boton-filtro-cerrar-banco')[0]['style'].display = "none";
  }

  /**
   * Añadir en el filtro un rango de fechas
   */
  anadirRangoFiltroFecha() {
    this.filtroFechaActivo = true;
    document.getElementsByClassName('container-filtro-seleccion-hasta-fecha')[0]['style'].display = "";
    document.getElementsByClassName('boton-filtro-anadir-fecha')[0]['style'].display = "none";
    document.getElementsByClassName('boton-cerrar-filtro-fecha')[0]['style'].display = "";
  }

  /**
   * Quitar la opción del filtros por fecha
   */
  quitarFiltroFecha() {
    this.filtroFechaActivo = false;
    document.getElementsByClassName('container-filtro-seleccion-hasta-fecha')[0]['style'].display = "none";
    document.getElementsByClassName('boton-filtro-anadir-fecha')[0]['style'].display = "";
    document.getElementsByClassName('boton-cerrar-filtro-fecha')[0]['style'].display = "none";
  }
  

  /**
   * Obtener parte de caja según los criterios de filtros
   */
  obtenerParteCaja(opcion) {
    this.listadoErrores = [];
    this.listadoAObtenerEnPDF = [];
    let bancosObtenidos = new Array();
    bancosObtenidos = [];
    var selectorFiltroBancoDesde = document.getElementsByClassName('selector-filtro-banco-desde')[0]['value'];
    var selectorFiltroBancoHasta = document.getElementsByClassName('selector-filtro-banco-hasta')[0]['value'];

    let fechasObtenidas = new Array();
    var selectorFiltroFechaDesdeSinSlice = document.getElementsByClassName('selector-filtro-fecha-desde')[0]['value'];
    var selectorFiltroFechaHastaSinSlice = document.getElementsByClassName('selector-filtro-fecha-hasta')[0]['value'];
    var selectorFiltroFechaDesde = selectorFiltroFechaDesdeSinSlice.slice(0, 10);
    
    if (selectorFiltroFechaHastaSinSlice !== undefined) {
      var selectorFiltroFechaHasta = selectorFiltroFechaHastaSinSlice.slice(0, 10);
    }


    if (this.filtroBancoActivo) {
      if (selectorFiltroBancoDesde !== "/" && selectorFiltroBancoHasta !== "/") {
        var aux;
        if (selectorFiltroBancoDesde > selectorFiltroBancoHasta) {
          aux = selectorFiltroBancoHasta;
          selectorFiltroBancoHasta = selectorFiltroBancoDesde;
          selectorFiltroBancoDesde = aux;
        }
        
        this.bancoService.obtenerBancosDesdeHasta(selectorFiltroBancoDesde, selectorFiltroBancoHasta).subscribe(res => 
          {
            for (let i = 0; i < res['id_banco'].length; i++) {
              bancosObtenidos.push({
                "id_banco" : res['id_banco'][i],
                "nombre_banco" : res['nombre_banco'][i]
              })
            }
          });
      } else {
        this.presentToast("Selecciona algún banco para filtrar por él")
        setTimeout(() => {
          document.getElementsByClassName('mensajeAdvertencia')[0]['style']['textAlign'] = "center";
        }, 50);
      }
    } else {
      if (selectorFiltroBancoDesde !== "/") {
        bancosObtenidos.push({
          "id_banco" : selectorFiltroBancoDesde,
        })
      } else {
        this.presentToast("Selecciona algún banco para filtrar por él")
        setTimeout(() => {
          document.getElementsByClassName('mensajeAdvertencia')[0]['style']['textAlign'] = "center";
        }, 50);
      }
    }

    // ahora filtro por fecha
    if (this.filtroFechaActivo) {
      var auxfecha;
      if (selectorFiltroFechaDesde !== undefined && selectorFiltroFechaHasta !== undefined) {
        if (selectorFiltroFechaDesde > selectorFiltroFechaHasta) {
          auxfecha = selectorFiltroFechaHasta;
          selectorFiltroFechaHasta = selectorFiltroFechaDesde;
          selectorFiltroFechaDesde = auxfecha;
        }
        fechasObtenidas.push({
          "fechaInicio" : selectorFiltroFechaDesde,
          "fechaFin" : selectorFiltroFechaHasta
        });
      } else {
        this.listadoErrores.push("Debes añadir las fechas en el rango")
      }
    } else {
      if (selectorFiltroFechaDesde !== undefined) {
        fechasObtenidas.push({
          "fechaInicio" : selectorFiltroFechaDesde,
          "fechaFin" : selectorFiltroFechaDesde
        })
      } else {
        this.listadoErrores.push("Selecciona una fecha para el filtrado");
      }
    }


    // si no hay ningún error
    setTimeout(() => {
      if (this.listadoErrores.length === 0) {
        let listadoObtenidoActual = new Array();
        let totales = new Array();

        for (let i = 0; i < bancosObtenidos.length; i++) {
          listadoObtenidoActual.push({
            "banco" : new Array()
          });
          totales.push({
            "total" : new Array()
          });
        }

        for (let i = 0; i < bancosObtenidos.length; i++) {
          var total = 0;
          this.registroParteService.seleccionarRegistros(
            bancosObtenidos[i]['id_banco'],
            fechasObtenidas[0]['fechaInicio'],
            fechasObtenidas[0]['fechaFin'])
          .subscribe(res =>
            {
              var total = 0;
              for (let j = 0; j < res['nombre_comunidad'].length; j++) {
                listadoObtenidoActual[i]['banco'].push(
                  {
                    "nombre_banco" : res['nombre_banco'][0],
                    "nombre_comunidad" : res['nombre_comunidad'][j],
                    "concepto" : res['concepto'][j],
                    "importe" : res['importe'][j],
                    "id_asociativo_banco" : res['id_asociativo_banco'][j],
                    "grupo1" : res['grupo1'][j],
                    "grupo2" : res['grupo2'][j],
                    "grupo3" : res['grupo3'][j],
                    "grupo4" : res['grupo4'][j],
                    "piso" : res['piso'][j]
                  });

                  total = total + Number(res['importe'][j]);

                  if (j === res['nombre_comunidad'].length-1) {
                    totales[i]['total'].push(total);
                  }
              }
            });
          }
          setTimeout(() => {
            for (let i = 0; i < listadoObtenidoActual.length; i++) {
              this.creacionInformePorBanco(listadoObtenidoActual[i]['banco'], fechasObtenidas[0]['fechaInicio'], fechasObtenidas[0]['fechaFin'], totales[i]['total'], opcion);
            }
          }, 300);
        } else {
          //TO-DO
          this.presentToast(this.listadoErrores);
          setTimeout(() => {
            document.getElementsByClassName('mensajeAdvertencia')[0]['style']['textAlign'] = "center";
          }, 50);
        }
        
      }, 500);
    }

    async presentToast(message) {
      const toast = await this.toastController.create({
        message,
        cssClass: "mensajeAdvertencia",
        duration: 3000,
        color: "danger",
        mode : "ios",
        position: "top"
      });
      toast.present();
    }
    
    /**
     * Creación de un informe
     */
    creacionInformePorBanco(listadoObtenido, fechaInicio, fechaFin, total, opcion) {
      setTimeout(() => {
      if (listadoObtenido.length !== 0) {
        this.crearObjetoParaPasarloAPDFMake(listadoObtenido);
        var nombre = listadoObtenido[0]['nombre_banco'] + "_" + fechaInicio + "_" + fechaFin + ".pdf";
        var dd = {
          info: {
            title: nombre,
            author: 'Euro-System Informática S.L',
            subject: 'Software creado por Euro-System Informática S.L',
            keywords: 'Parte de caja para Terrafinca - Administradores y Gestores Inmobiliarios',
          },
          footer: {
            columns: [
              { text: 'Informe generado por EuroCaja - Parte de caja para Terrafinca - Administradores y Gestores Inmobiliarios', alignment: 'right', fontSize: 9, marginRight: 12 }
            ]
          },
          content: [
            {
              columns: [
                {
                  width: 150,
                  text: listadoObtenido[0]['id_asociativo_banco'],
                },
                {
                  width: 200,
                  text: listadoObtenido[0]['nombre_banco'],
                },
                {
                  width: 300,
                  text: "PARTE DE CAJA",
                  bold: true,
                  fontSize : 15
                },
                {
                  width: "auto",
                  text: fechaInicio + " / " + fechaFin,
                  italics: true
                },
              ]
            },
            {
            },
              this.crearObjetoParaPasarloAPDFMake(listadoObtenido),
              {
                columns: [
                  {
                    text: ' '
                  },
                ]
              },
              {
                columns: [
                  {
                    text: ' '
                  },
                ]
              },
              {
                columns: [
                  {
                    marginLeft: 400,
                    width: 470,
                    text: "TOTAL: ",
                    fontSize: 15,
                    italics: true
                  },
                  {
                    width: 200,
                    text: Number.parseFloat(total).toFixed(2) + " €",
                    fontSize: 15,
                    bold: true
                  },
                ]
              },
          ],
          pageOrientation: 'landscape',
          }
  
        this.pdf = pdfMake.createPdf(dd);
        if (opcion === "abrir") {
          this.pdf.open();
        } else if (opcion === "descargar") {
          this.pdf.download(nombre);
        }
      } else {
        this.presentToast("No existen registros para esta consulta");
        setTimeout(() => {
          document.getElementsByClassName('mensajeAdvertencia')[0]['style']['textAlign'] = "center";
        }, 50);
      }
    }, 400);
  }

  /**
   * Crear objeto de listado de registro para retornarlo
   */
  crearObjetoParaPasarloAPDFMake(listadoRegistroParte){
    var printableRisks = [];

    printableRisks.push({
      table : {
        widths : ['*', 300, 60, '*', 60],
        body: [
          [
            {text: 'Comunidad', fontSize: 14, bold: true}, 
            {text: 'Concepto', fontSize: 14, bold: true},
            {text: 'Importe', fontSize: 14, bold: true},
            {text: 'Cuenta Bancaria', fontSize: 14, bold: true},
            {text: 'Piso', fontSize: 14, bold: true}
        ],
        ]
      }
    });
    
    for (let i = 0; i < listadoRegistroParte.length; i++) {
      printableRisks[0]['table']['body'].push([
        {text : listadoRegistroParte[i]['nombre_comunidad'], fontSize: 10}, 
        {text : listadoRegistroParte[i]['concepto'], fontSize: 10}, 
        {text : listadoRegistroParte[i]['importe'] + " \€", fontSize: 10}, 
        {text : listadoRegistroParte[i]['id_asociativo_banco'] + " " + 
        listadoRegistroParte[i]['grupo1'] + " " + 
        listadoRegistroParte[i]['grupo2'] + " " + 
        listadoRegistroParte[i]['grupo3'] + " " + 
        listadoRegistroParte[i]['grupo4'], fontSize: 10},
        {text : listadoRegistroParte[i]['piso'], fontSize: 10},
      ]);
    }

    return printableRisks;

  }
}