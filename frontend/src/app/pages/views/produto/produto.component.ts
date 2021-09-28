import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { listaProdutos } from 'src/app/shared/models/produtos.model';
import { NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { Carrinho } from 'src/app/shared/models/carrinho.model';
import { Router } from '@angular/router';
import { CarrinhoService } from '../carrinho/carrinho.service';
import { Endereco } from 'src/app/shared/models/endereco.model';
import { Cartao } from 'src/app/shared/models/cartao.model';
import { SandBoxService } from 'src/app/shared/services/carrinho.service';

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
  public carrinho = {
    valorTotal: 0,
    valorCompras: 0,
    valorFrete: 0,
    cupomDesconto: 0,
    listaFrete: [],
    infoCupom: '',
    cupom: '',
    listaCompras: [],
    enderecos: [],
    enderecoEntrega: new Endereco(),
    cartoes: [],
    cartaoPagamento: new Cartao()
  }
  
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private carrinhoService: CarrinhoService,
    private service: SandBoxService
  ) { }
  
  ngOnInit(): void {
    this.carrinhoService.getLista().subscribe( ret => {
      if(ret){
        this.carrinho = ret;
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
    let existsItem = this.carrinho.listaCompras.filter(i => i.id === item.id)[0];
    if(existsItem){
      existsItem.qtd++;
    }else{
      this.carrinho.listaCompras.push(new Carrinho(item.id, item.codigo, item.titulo, item.imagem, item.precoDe, item.precoPor, item.quantidadeML,
        item.tempoGuarda, item.categoria, item.tipo, item.teorAlcoolico, item.paisSigla, item.pais, item.descricao, 1, 0, ''));
    }

    this.updateValorTotal();
    this.showCarrinho(this.modalData);
  }

  removeCarrinho(item){
    this.carrinho.listaCompras.splice(this.carrinho.listaCompras.findIndex(i => i.id === item.id), 1);
    this.updateValorTotal();
    if(!this.carrinho.listaCompras.length){
      this.modalService.dismissAll();
    }
  }

  updateQtd(item, valor){
    this.carrinho.listaCompras.filter(i => i.id === item.id)[0].qtd += valor;
    this.updateValorTotal();
    this.getVerificaEstoque(item);    
  }

  getVerificaEstoque(produto){
    let itemCarrinho = this.carrinho.listaCompras.filter(i => i.id === produto.id)[0];
    let estoque = this.produtos.filter(item => item.id == produto.id)[0].quantidade;
    
    produto.qtd > estoque ? itemCarrinho.infoEstoque = true : itemCarrinho.infoEstoque = '';
  }

  updateValorTotal(){
    this.carrinho.valorCompras = this.carrinho.listaCompras.reduce((acc, item) => { return acc + (item.precoPor * item.qtd) }, 0);
  }
 
  goParaPagamento(){
    this.modalService.dismissAll();
    this.carrinhoService.setLista(this.carrinho);
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
    return this.carrinho.listaCompras.filter(c => c.infoEstoque != '')[0] ? true : false;
  }
}
