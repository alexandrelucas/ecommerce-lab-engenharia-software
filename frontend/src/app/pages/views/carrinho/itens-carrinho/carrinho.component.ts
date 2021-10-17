import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Cartao } from 'src/app/shared/models/cartao.model';
import { Endereco } from 'src/app/shared/models/endereco.model';
import { SandBoxService } from 'src/app/shared/services/carrinho.service';
import { CarrinhoService } from '../carrinho.service';

@Component({
  selector: 'app-carrinho',
  templateUrl: './carrinho.component.html',
  styleUrls: ['./carrinho.component.scss']
})
export class CarrinhoComponent implements OnInit {
    
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
    cartaoPagamento: new Cartao(),
    pagamento: {
      metodo: '',
      qtdParcelas: null,
      valorParcela: 0
    },
    clienteId: null
  }
  
  public setCupom: boolean;
  public carrinhoForm: FormGroup;
  public cupomForm: FormGroup;

  constructor(
    private carrinhoService: CarrinhoService,
    private formBuilder: FormBuilder,
    private sandBox: SandBoxService,
    private route: Router
  ) { }

  ngOnInit(): void {
    this.getListaCarrinho();
    this.carrinhoForm = this.formBuilder.group({      
      cep: ['', Validators.required]      
    });

    this.cupomForm = this.formBuilder.group({      
      cupom: ['', Validators.required]
    });
  }

  removeCarrinho(item){
    this.carrinho.listaCompras.splice(this.carrinho.listaCompras.findIndex(i => i.id === item.id), 1);
    this.updateValorCompras();    
  }

  updateQtd(item, valor){
    this.carrinho.listaCompras.filter(i => i.id === item.id)[0].qtd += valor;    
    this.updateValorCompras();
    this.getVerificaEstoque(item);    
  }

  getEstoqueProduto(idProduto){
    this.sandBox.getEstoqueProduto(idProduto).subscribe((result:any) => {
      return result.produto;
    });
  }

  getVerificaEstoque(produto){    
    this.sandBox.getEstoqueProduto(produto.id).subscribe((result:any) => {      
      let estoque = result.produto.quantidade;
      let itemCarrinho = this.carrinho.listaCompras.filter(i => i.id === produto.id)[0];      

      produto.qtd > estoque ? itemCarrinho.infoEstoque = true : itemCarrinho.infoEstoque = '';  
    });
  }

  updateValorCompras(){
    if(this.carrinho){
      return this.carrinho.valorCompras = this.carrinho?.listaCompras?.reduce((acc, item) => { return acc + (item.precoPor * item.qtd) }, 0);
    }
  }

  updateValorTotal(){
    if(this.carrinho){
      let total = ((this.carrinho.valorCompras + parseFloat(this.carrinho.valorFrete.toString())) - this.carrinho.cupomDesconto);
      this.carrinho.valorTotal = total > 0 ? total : 0;
      return total > 0 ? total : 0;
    }
  }

  calcularFrete(){
    this.sandBox.calculaFrete(this.carrinhoForm.get('cep').value).subscribe( (res:any) => {
      this.carrinho.listaFrete = [];
      res.forEach(element => {
        if(element.price){
          if(element.name == ".Com"){
            element.price = element.price - element.discount;
          }
          this.carrinho.listaFrete.push(element)
        }
      });
    });
  }

  validaCupom(){    
    let cupom = this.cupomForm.get('cupom').value;

    if(!this.setCupom){
      this.sandBox.validaCupom(cupom).subscribe( (ret:any) => {
        if(ret.status == 0){
          console.log(ret)
          this.carrinho.cupomDesconto = ret.cupom.valorDesconto;          
          this.setCupom = !this.setCupom;
        }
        this.carrinho.infoCupom = ret.message;
      });
    }else{
      this.carrinho.cupomDesconto = 0;
      this.carrinho.infoCupom = 'Cupom removido.'
      this.setCupom = !this.setCupom;
    }

    this.updateValorCompras();
  }

  getListaCarrinho(){
    this.carrinhoService.getLista().subscribe( lista => {
      this.carrinho = lista;      
    });
  }

  continuarCompra(){
    this.carrinhoService.setLista(this.carrinho);
    this.route.navigate(['home'])
  }

  concluirPedido(){
    this.carrinhoService.setLista(this.carrinho);
    //this.route.navigate(['home/carrinho/identificacao'])
  }

  validaBtn(){
    if(this.carrinho){
      return this.carrinho.listaCompras.filter(c => c.infoEstoque != '')[0] ? true : false;
    }
  }
}
