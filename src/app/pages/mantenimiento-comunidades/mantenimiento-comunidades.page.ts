import { Component, OnInit, ViewChild, ElementRef, ViewChildren, QueryList } from '@angular/core';

@Component({
  selector: 'app-mantenimiento-comunidades',
  templateUrl: './mantenimiento-comunidades.page.html',
  styleUrls: ['./mantenimiento-comunidades.page.scss'],
})
export class MantenimientoComunidadesPage implements OnInit {

  @ViewChildren('comunidad') comunidad : QueryList<ElementRef>;
  @ViewChild('contenedorListado', {static : false}) contenedorListado : ElementRef;
  constructor() { }

  ngOnInit() {
  }
  
  entrarComunidad() {
    console.log("entrar comunidad");
  }
  
  modificar() {
    this.contenedorListado.nativeElement.hidden = true;
    //console.log();


    // para añadir atributos y valores personalizados : SIRVEEEEE
//    let atributo = document.createAttribute("ktal");
//    atributo.value = "300";

//    this.comunidad.toArray()[0].el.attributes.setNamedItem(atributo);

//    console.log(this.comunidad.toArray()[0].el.attributes);

    
  }

  eliminar() {
    console.log("eliminar");
  }

  onSearchChange(event){}
}
