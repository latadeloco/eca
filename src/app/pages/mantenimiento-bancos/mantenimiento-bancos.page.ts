import { Component, OnInit, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BancoService } from '../../services/banco.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-mantenimiento-bancos',
  templateUrl: './mantenimiento-bancos.page.html',
  styleUrls: ['./mantenimiento-bancos.page.scss'],
})
export class MantenimientoBancosPage implements OnInit {

  bancos = null;

  banco = {
    id_banco : null,
    nombre_banco : null,
    id_asociativo_banco : null
  }

  nombreBancos = new Array();

  constructor (
    private bancoService : BancoService
  ) {}

  ngOnInit() {
    this.bancoService.getBanco().subscribe(respuesta => console.log(respuesta)
      /* {
        for (var i = 0 ; i < respuesta.nombre_banco.length ; i++) {
          //console.log(respuesta);
          this.nombreBancos.push(respuesta.nombre_banco[i])
        }
      } */
    )
      this.nombreBancos
  }

  obtenerBancos() {
    this.bancoService.getBanco().subscribe(
      result => console.log(result)
    )
  }


  altaBanco() {
    this.bancoService.altaBanco(this.banco).subscribe(
      datos => {
        console.log(datos);
        if(datos['resultado'] == 'OK') {
          alert(datos['mensaje']);
          this.obtenerBancos();
        }
      }
    );
  }

}
 /*  constructor(
    private http : HttpClient,
  ) {
   }

  nombre_banco : string;
  id_asociativo_banco: string;

  ngOnInit() {
    console.log(this.http.get("http://localhost/euroCaja/src/app/api/bancos.php"));
//    (this.arrayBancos.subscribe(res => console.log(res)));


  }

  anadirBanco(){
  
  } */
