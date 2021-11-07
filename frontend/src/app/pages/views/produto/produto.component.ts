import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { listaProdutos } from 'src/app/shared/models/produtos.model';
import { NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { CarrinhoCompra } from 'src/app/shared/models/carrinhoCompra.model';
import { Router } from '@angular/router';
import { CarrinhoService } from '../carrinho/carrinho.service';
import { Endereco } from 'src/app/shared/models/endereco.model';
import { Cartao } from 'src/app/shared/models/cartao.model';
import { SandBoxService } from 'src/app/shared/services/carrinho.service';
import { CarrinhoCupom } from 'src/app/shared/models/carrinhoCupom.model';
import { CarrinhoFrete } from 'src/app/shared/models/carrinhoFrete.model';
import { CarrinhoPagamento } from 'src/app/shared/models/carrinhoPagamento.model';
import { Carrinho } from 'src/app/shared/models/carrinho.model';

@Component({
  selector: 'app-produto',
  templateUrl: './produto.component.html',
  styleUrls: ['./produto.component.scss']
})
export class ProdutoComponent implements OnInit {
  
  @ViewChild('modalData') modalData: TemplateRef<any>;
  public produtos = [];
  public produtosFiltrados;
  public closeModal: string;
  public carrinhoCompra = new CarrinhoCompra();
  
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private carrinhoService: CarrinhoService,
    private service: SandBoxService
  ) {
    this.carrinhoCompra.listaCompras = [];    
  }
  
  ngOnInit(): void {
    this.carrinhoService.getLista().subscribe((ret:CarrinhoCompra) => {      
      if(ret){
        this.carrinhoCompra = ret;
      }
    });        
    this.getEstoque();    
  }

  getEstoque(){
    this.service.getEstoque().subscribe( (result:any) => {      
      this.produtos = result.produtos;      
    })
  }

  showCarrinho(content) {
    this.modalService.open(content, {
        ariaLabelledBy: 'modal-basic-title',
        size: '100px', 
        windowClass: 'modal-carrinho'
    });
  }

  addCarrinho(item){
    let existsItem = this.carrinhoCompra.listaCompras.filter(i => i.id === item.id)[0];
    if(existsItem){
      existsItem.qtd++;
    }else{
      this.carrinhoCompra.listaCompras.push(new Carrinho(item.id, item.codigo, item.titulo, item.imagem, item.precoDe, item.precoPor, item.quantidadeML,
        item.tempoGuarda, item.categoria, item.tipo, item.teorAlcoolico, item.paisSigla, item.pais, item.descricao, 1, 0, ''));
    }

    this.updateValorTotal();
    this.showCarrinho(this.modalData);
  }

  removeCarrinho(item){
    this.carrinhoCompra.listaCompras.splice(this.carrinhoCompra.listaCompras.findIndex(i => i.id === item.id), 1);
    this.updateValorTotal();
    if(!this.carrinhoCompra.listaCompras.length){
      this.modalService.dismissAll();
    }
  }

  updateQtd(item, valor){
    this.carrinhoCompra.listaCompras.filter(i => i.id === item.id)[0].qtd += valor;
    this.updateValorTotal();
    this.getVerificaEstoque(item);    
  }

  getVerificaEstoque(produto){
    let itemCarrinho = this.carrinhoCompra.listaCompras.filter(i => i.id === produto.id)[0];
    let estoque = this.produtos.filter(item => item.id == produto.id)[0].quantidade;
    
    produto.qtd > estoque ? itemCarrinho.infoEstoque = 'true' : itemCarrinho.infoEstoque = '';
  }

  updateValorTotal(){
    this.carrinhoCompra.valorCompras = this.carrinhoCompra.listaCompras.reduce((acc, item) => { return acc + (item.precoPor * item.qtd) }, 0);
  }
 
  goParaPagamento(){
    this.modalService.dismissAll();
    this.carrinhoService.setLista(this.carrinhoCompra);
    this.router.navigate(['home/carrinho']);    
  }

  getListaProdutos() {
    return this.produtosFiltrados ?? this.produtos;
  }
  
  pesquisarProdutos(valor: string) {    
    if(valor !== '') {
      valor = valor.toLowerCase();
      let nome = this.produtos.filter(p => p.titulo.toLowerCase().includes(valor));
      let pais = this.produtos.filter(p => p.pais.toLowerCase().includes(valor));
      let categoria = this.produtos.filter(p => p.categoria.toLowerCase().includes(valor));      
      this.produtosFiltrados = [...nome, ...pais, ...categoria];
    } else {
      this.produtosFiltrados = undefined;
    }
  }

  validaBtn(){
    return this.carrinhoCompra.listaCompras.filter(c => c.infoEstoque != '')[0] ? true : false;
  }

  getCountryFlag(sigla){
    switch(sigla){
      case 'PT':
        return 'po';
      case 'AR':
        return 'ar';
      case 'FR':
        return 'fr';
      case 'ES':
        return 'sp';
      case 'IT':
        return 'it';
      case 'CH':
        return 'ci';
      default:        
        return 'uy';
    }
  }
}
