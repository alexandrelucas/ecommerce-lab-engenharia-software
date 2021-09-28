import { Component, Input, OnInit } from '@angular/core';
import { Pedido, StatusPedido, StatusPedidoNome } from 'src/app/shared/models/pedido.model';
import { Produto } from 'src/app/shared/models/produtos.model';
import { SandBoxService } from 'src/app/shared/services/carrinho.service';

@Component({
  selector: 'app-detalhes-pedido',
  templateUrl: './detalhes-pedido.component.html',
  styleUrls: ['./detalhes-pedido.component.scss']
})
export class DetalhesPedidoComponent implements OnInit {

  @Input() pedido: any;
  produtosLista: Array<Produto>;
  public listaProdutos = []
  public paises = []
  public categorias = []

  constructor(
    private servico: SandBoxService
  ) { }

  ngOnInit(): void {
    this.produtosLista = this.pedido.listaCompras;
    console.log(this.pedido);
    this.getListaPaises();
    this.getListaCategorias();
    this.getInfoProdutos();
  }
  getListaCategorias(){
    this.servico.getListaCategorias().subscribe((result:any) => {
      console.log(result.categorias)
      this.categorias = result.categorias;
    });
  }
  
  getListaPaises(){
    this.servico.getListaPaises().subscribe((result:any) => {
      console.log(result.paises)
      this.paises = result.paises;
    });
  }

  getInfoProdutos(){
    this.servico.getProduto(this.pedido.produtoId).subscribe((result:any) => {
      console.log(result.produto)
      this.listaProdutos.push(result.produto);
    })
  }

  getListaStatus() {
    const StringIsNumber = value => isNaN(Number(value)) === false;
    return Object.keys(StatusPedido)
        .filter(StringIsNumber)
        .map(key => StatusPedido[key]);
  }

  getStatusNome(status: number) {
    return StatusPedidoNome[status];
  }

  getPaisNome(paisId){    
    return this.paises.filter(p => p.id == paisId)[0].descricao;
  }
  getCategoriaNome(categoriaId){    
    return this.categorias.filter(p => p.id == categoriaId)[0].descricao;
  }
}
