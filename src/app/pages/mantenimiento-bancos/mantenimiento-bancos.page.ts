import { Component, OnInit, Injectable, ViewChild, ElementRef } from '@angular/core';
import { BancoService } from '../../services/banco.service';
import { $ } from 'protractor';
import { logotipo } from '../../../environments/environment.prod';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-mantenimiento-bancos',
  templateUrl: './mantenimiento-bancos.page.html',
  styleUrls: ['./mantenimiento-bancos.page.scss'],
})
export class MantenimientoBancosPage implements OnInit {
  logo = logotipo.img;

  @ViewChild('nombre', {static: false}) elementNombreBanco : ElementRef;
  @ViewChild('idAsociativo', {static: false}) elementoIdAsociativo : ElementRef;
  @ViewChild('eliminarBanco', {static: false}) botonEliminar : ElementRef;

  idBanco = null;
  errorPorIdAsociado = null;
  errorPorNombreBanco = null;
  
  bancos = null;

  banco = {
    nombre_banco :  null,
    id_asociativo_banco : null,
    id_banco : null
  }

  listado = new Array();

  errores = new Array();

  constructor(
    private bancoService : BancoService,
    private toastController : ToastController
    ) {}

  ngOnInit() {
    this.bancoService.getBancos().subscribe( respuesta =>
      {
        for (var i = 0 ; i < respuesta['nombre_banco'].length ; i++) {
          this.listado.push({
            "id_banco" : respuesta['id_banco'][i], 
            'nombre_banco' : respuesta['nombre_banco'][i], 
            "id_asociativo_banco" : respuesta['id_asociativo_banco'][i]
          });
        }
      });
  }

  obtenerBancos() {
    this.bancoService.getBancos().subscribe(result => console.log(result));
  }

  seleccionarBancoPorNombre(nombre){
    this.bancoService.seleccionarBancoPorNombre(nombre).subscribe(
      result => (this.errorPorNombreBanco = result)
    );
  }

  seleccionarBancoPorIdAsociado(id_banco) {
    this.bancoService.seleccionarBancoPorIdAsociado(id_banco).subscribe(
      result => (this.errorPorIdAsociado = result)
    );
  }


  altaModificacionBanco() {
    let claseActiva : string;
    //Primero recogemos que id tiene si modificar o anadir banco
    var listaClasesBoton = document.getElementsByClassName('container-botones')[0];
    for (var i = 0; i < listaClasesBoton.firstChild['classList'].length; i++) {
      if (listaClasesBoton.firstChild['classList'][i] === 'anadirBanco') {
        claseActiva = listaClasesBoton.firstChild['classList'][i];
      }
      if (listaClasesBoton.firstChild['classList'][i] === 'modificarBanco') {
        claseActiva = listaClasesBoton.firstChild['classList'][i];
      }
    }

    if (claseActiva === 'anadirBanco') {
      this.errores = [];
      // Comprobar el campo nombre_banco
      // Comprobamos el campo de nombre_banco para que no esté repetido
      if (this.banco.nombre_banco  === '' || this.banco.nombre_banco === null) {
        this.errores.push("El nombre del banco no puede estar vacío");
      }
      this.seleccionarBancoPorNombre(this.banco.nombre_banco);
      // Comprobar el campo id_asociativo_banco
      // Comprobamos el campo de id asociado al banco para que no esté repetido y contenga exactamente 4 números
      if (!/^([0-9]{4})$/.test(this.banco.id_asociativo_banco)) {
        this.errores.push("El Código asociado tiene que tener exactamente 4 números");
        return;
      }
      this.seleccionarBancoPorIdAsociado(this.banco.id_asociativo_banco);

      // Se da un margen de un segundo y medio para hacer la tarea asíncrona y después comprobar el resto de parámetros
      setTimeout(() => {
        // Se comprueba si el nombre del banco está en la base de datos
        if (this.errorPorNombreBanco !== "") {
          this.errores.push("El nombre del banco está en la base de datos");
        }

        // Se comprueba si el id asociado está en la base de datos
        if (this.errorPorIdAsociado !== "") {
          this.errores.push("El Código asociado está en la base de datos");
        }

        if (this.errores.length === 0) {
         this.bancoService.altaBanco(this.banco).subscribe(
          datos => {
            if(datos['resultado'] == 'OK') {
              alert(datos['mensaje']);
              this.obtenerBancos();
            }
          }
          );
          window.location.reload();
        } else {
          // TO-DO
          if (this.errores.length >= 2) {
            this.presentToast("Hay varios errores, revisa los campos");
            setTimeout(() => {
              document.getElementsByClassName('mensajeAdvertencia')[0]['style']['textAlign'] = "center";
            }, 50);
          } else {
            this.presentToast(this.errores);
            setTimeout(() => {
              document.getElementsByClassName('mensajeAdvertencia')[0]['style']['textAlign'] = "center";
            }, 50)
          }
          console.log(this.errores);
        }
      }, 1000);
    }
    if (claseActiva === 'modificarBanco') {
      this.bancoService.seleccionarBancoPorNombre(this.elementNombreBanco['el'].value).subscribe(res => this.errorPorNombreBanco = res);
      setTimeout(() => {
        if (this.errorPorNombreBanco !== "") {
          this.errores.push("El banco ya existe en la base de datos");
        }
      }, 300);

      this.bancoService.seleccionarBancoPorIdAsociado(this.elementoIdAsociativo['el'].value).subscribe(res => this.errorPorIdAsociado = res);
      setTimeout(() => {
        if (this.errorPorIdAsociado !== "") {
          this.errores.push("El código asociado al banco ya existe en la base de datos");
        }
      }, 300);

      setTimeout(() => {
        if (this.errores.length === 0) {
          this.bancoService.modificarBanco(this.banco).subscribe(res => res);
          setTimeout(() => {
            window.location.reload();
          }, 300);

        } else {
          var erroresEnPresentacion = "";
          console.log(this.errores);
          for (let i = 0; i < this.errores.length; i++) {
            erroresEnPresentacion += erroresEnPresentacion + this.errores[i] + "\n";
          }
          var confirmacionModificacion = confirm(
            "Hay conflictos: \n" + this.errores + "\nEsto puede crear conflictos en la base de datos, ¿Desea continuar?"
            );
          if (confirmacionModificacion) {
            this.bancoService.modificarBanco(this.banco).subscribe(res => res);
            setTimeout(() => {
              window.location.reload();
            }, 300);
          } else {
            if (this.errores.length >= 2) {
              this.presentToast("Hay varios errores al intentar modificar el banco, revisa los campos");
              setTimeout(() => {
                document.getElementsByClassName('mensajeAdvertencia')[0]['style']['textAlign'] = "center";
              }, 50);
            } else {
              this.presentToast(this.errores)
              setTimeout(() => {
                document.getElementsByClassName('mensajeAdvertencia')[0]['style']['textAlign'] = "center";
              }, 50);
            }
          }
        }
      }, 800);
    }
  }

  modificarBanco(id_banco: number) {
    // Primero recogemos el banco seleccionado
    this.bancoService.seleccionarBancoPorId(id_banco).subscribe(
      res => {
        this.banco.id_banco = res['id_banco'][0];
        this.banco.nombre_banco = res['nombre_banco'][0];
        this.banco.id_asociativo_banco = res['id_asociativo_banco'][0];

        this.elementNombreBanco['el'].value = res['nombre_banco'];
        this.elementoIdAsociativo['el'].value = res['id_asociativo_banco'];
        this.idBanco = res['id_banco'][0];
      }
    );

    var listaClasesBoton = document.getElementsByClassName('container-botones')[0];

    listaClasesBoton.firstChild['classList'].remove('anadirBanco');
    listaClasesBoton.firstChild['classList'].add('modificarBanco');

    listaClasesBoton.children[0].innerHTML = "Modificar banco";

    this.botonEliminar['el'].style.display = "";
  }

  eliminar(id_banco) {
    this.bancoService.eliminarBanco(id_banco).subscribe(res => res);
    setTimeout(() => {
      window.location.reload();
    }, 1000);
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
}