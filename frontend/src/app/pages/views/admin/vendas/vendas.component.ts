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
    this.getListaPaises();
    this.getListaVendas();
  }  

  getListaVendas(){
    this.servico.getListaVendas().subscribe((result:any) => {
      console.log(result.vendas)
      this.listaVendas = result.vendas;
      //this.dataSource = new MatTableDataSource(result.vendas);
      this.carregarListaPedidos();
    });
  }

  carregarListaPedidos() {
    this.servico.getListaPedidos().subscribe((result:any) => {
      console.log(result.pedidos)
      this.listaPedidos = result.pedidos;
      //this.carregarProdutos();
      this.carregaDataSource();
    });
  }

  carregarProdutos(){    
    this.servico.getListaProdutos().subscribe((result:any) => {
      console.log(result.produtos)
      this.listaProdutos = result.produtos;
      
    });
  }

  getListaPaises(){
    this.servico.getListaPaises().subscribe((result:any) => {      
      this.listaPaises = result.paises;      
    });
  }

  carregaDataSource(){    
    let tabela = this.listaVendas;
    tabela.forEach( venda => {
      venda.pedido = []
      venda.pedido.push(this.listaPedidos.filter(p => p.id == venda.pedidoId)[0]);
      
      // venda.pedido.produto = []
      // venda.pedido.forEach(ped => {
      //   venda.pedido.produto.push(this.listaProdutos.filter(pro => pro.id == ped.produtoId)[0])
      // })
    });
    console.log(tabela)
    this.dataSource = new MatTableDataSource(tabela);
  }

  getPaisNome(paisId){
    return this.listaPaises.filter(p => p.id == paisId)[0].descricao;
  }
}
