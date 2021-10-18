import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SandBoxService } from 'src/app/shared/services/carrinho.service';

@Component({
  selector: 'app-vendas',
  templateUrl: './vendas.component.html',
  styleUrls: ['./vendas.component.scss']
})
export class VendasComponent implements OnInit {

  displayedColumns: string[] = ['id','codigo', 'produto', 'pais', 'quantidade', 'data', 'valor'];
  public dataSource: MatTableDataSource<any>;
  public listaPedidos = []
  public listaProdutos = []
  public listaVendas = []
  public listaPaises = []
  
  constructor(
    private servico: SandBoxService
  ) { }

  ngOnInit(): void {
    //this.getListaPaises();
    this.getListaVendas();
  }  

  getListaVendas(){
    this.servico.getListaVendas().subscribe((result:any) => {
      console.log(result.vendas)
      this.dataSource = new MatTableDataSource(result.vendas);
      //this.listaVendas = result.vendas;
    });
  }

  carregarListaPedidos() {
    this.servico.getListaPedidos().subscribe((result:any) => {
      console.log(result.pedidos)
      this.listaPedidos = result.pedidos;   
      //this.carregaDataSource();
    });
  }

  // getListaPaises(){
  //   this.servico.getListaPaises().subscribe((result:any) => {      
  //     this.listaPaises = result.paises;      
  //   });
  // }

  // carregaDataSource(){    
  //   let tabela = this.listaVendas;
  //   tabela.forEach( venda => {
  //     venda.pedido = []
  //     venda.pedido.push(this.listaPedidos.filter(p => p.id == venda.pedidoId)[0]);
  //   });
  //   console.log(tabela)
  //   this.dataSource = new MatTableDataSource(tabela);
  // }

  // getPaisNome(paisSigla){    
  //   return this.listaPaises.filter(p => p.sigla == paisSigla)[0].descricao;
  // }
}
