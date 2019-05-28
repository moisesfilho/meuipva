import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

export class Consulta {
  placa: string;
  renavam: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private http: HttpClient) { }

  parametrosConsulta: Consulta = new Consulta();
  veiculo: any;
  debitosDoVeiculo: any;

  ngOnInit() {
  }

  limpar() {
    this.veiculo = null;
  }

  get(url: string): Observable<any> {
    return this.http.get(url).pipe(map(response => response));
  }

  getVeiculo(prametrosConsulta: Consulta) {
    //const url = `http://www2.sefaz.ce.gov.br/ipva/api/ipva/v1/emissaoDae/pesquisarVeiculo?placa=${prametrosConsulta.placa}&renavam=${prametrosConsulta.renavam}`;
    const url = `http://dese2.sefaz.ce.gov.br/ipva-web/api/ipva/v1/emissaoDae/pesquisarVeiculo?placa=${prametrosConsulta.placa}&renavam=${prametrosConsulta.renavam}`;

    this.get(url).subscribe(
      res => {
        this.veiculo = res.veiculo;
        this.debitosDoVeiculo = res.debitosDoVeiculo;
      },
      error => {
        throw error;
      }
    );
  }
}
