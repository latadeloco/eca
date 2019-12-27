import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-report-vertical',
  templateUrl: './report-vertical.page.html',
  styleUrls: ['./report-vertical.page.scss'],
})
export class ReportVerticalPage implements OnInit {

  parametro = null;
  data: any;
 
  constructor(private route: ActivatedRoute, private router: Router) {
    this.route.queryParams.subscribe(params => {
      if (params && params.special) {
        this.data = JSON.parse(params.special);
      }
    });
  }

  ngOnInit() {
    //this.parametro = this.recepcionParametros.snapshot.paramMap;
    console.log(this.data);
  }

}
