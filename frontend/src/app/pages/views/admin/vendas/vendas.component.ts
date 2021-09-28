import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SandBoxService } from 'src/app/shared/services/carrinho.service';

@Component({
  selector: 'app-vendas',
  templateUrl: './vendas.component.html',
  styleUrls: ['./vendas.component.scss']
})
export class VendasComponent implements OnInit {

  displayedColumns: string[] = ['codigo', 'quantidade', 'transportadora', 'valorFrete', 'valorTotal', 'data', 'acao'];
  dataSource: MatTableDataSource<any>;

  constructor(
    private servico: SandBoxService
  ) { }

  ngOnInit(): void {
    this.getListaVendas();
  }

  getListaVendas(){
    this.servico.getListaVendas().subscribe((result:any) => {
      console.log(result)
      this.dataSource = result.vendas;
      /** id pedidoId valor */
    })
  }
  carregarListaPedidos() {    
    this.servico.getListaPedidos().subscribe((result:any) => {
      console.log(result.pedidos)
    });
  } 

}
