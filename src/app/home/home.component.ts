import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { ParametrosConsulta } from '../entities/parametrosConsulta';
import { IdbService } from '../services/idb.service';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private http: HttpClient, private idbService: IdbService) {
    this.idbService.connectToIDB();
  }

  parametrosConsulta: ParametrosConsulta = new ParametrosConsulta();
  veiculo: any;
  debitosDoVeiculo: any;
  veiculoNaoEncontrado: string;

  displayedColumns: string[] = ['Exercício', 'Parcela', 'Valor', 'Situação'];

  ngOnInit() {
    const teste = this.idbService.get('parametros-consulta', 'default');

    teste.then((valor: any) => {
      if (valor != null) {
        this.parametrosConsulta = (valor as ParametrosConsulta);
      }
    });

    // this.idbService.getAllData('parametros-consulta').then((lista: any) => {
    //   if (lista.length > 0) {
    //     this.parametrosConsulta = lista[0];
    //   }
    // });
  }

  limpar() {
    this.veiculo = null;
    this.veiculoNaoEncontrado = null;
  }

  get(url: string): Observable<any> {
    return this.http.get(url).pipe(map(response => response));
  }

  getVeiculo(prametrosConsulta: ParametrosConsulta) {
    this.limpar();

    const url = `http://www2.sefaz.ce.gov.br/ipva/api/ipva/v1/emissaoDae/pesquisarVeiculo?placa=${prametrosConsulta.placa}&renavam=${prametrosConsulta.renavam}`;
    // const url = `http://www3.sefaz.ce.gov.br/ipva/api/ipva/v1/emissaoDae/pesquisarVeiculo?placa=${prametrosConsulta.placa}&renavam=${prametrosConsulta.renavam}`;
    // const url = `http://dese2.sefaz.ce.gov.br/ipva-web/api/ipva/v1/emissaoDae/pesquisarVeiculo?placa=${prametrosConsulta.placa}&renavam=${prametrosConsulta.renavam}`;

    this.idbService.put('parametros-consulta', prametrosConsulta, 'default');

    this.get(url).subscribe(
      res => {
        this.veiculo = res.veiculo;
        this.debitosDoVeiculo = res.debitosDoVeiculo;
      },
      error => {
        this.veiculoNaoEncontrado = 'Veículo não encontrado';
      }
    );
  }
}
