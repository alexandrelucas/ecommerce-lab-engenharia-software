import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { SandBoxService } from 'src/app/shared/services/carrinho.service';
import { CarrinhoService } from '../carrinho.service';
import { CarrinhoFrete } from 'src/app/shared/models/carrinhoFrete.model';
import { CarrinhoCompra } from 'src/app/shared/models/carrinhoCompra.model';


@Component({
  selector: 'app-carrinho',
  templateUrl: './carrinho.component.html',
  styleUrls: ['./carrinho.component.scss']
})
export class CarrinhoComponent implements OnInit {  
  
  @Output() status = new EventEmitter<string>();
  public storage: Storage;
  public carrinhoCompra: CarrinhoCompra;
 
  public freteSelecionado = {};
  public carrinhoForm: FormGroup;
  
  constructor(
    private carrinhoService: CarrinhoService,
    private formBuilder: FormBuilder,
    private sandBox: SandBoxService,
    private route: Router
  ) {}

  ngOnInit(): void {    
    this.getListaCarrinho();
    this.carrinhoForm = this.formBuilder.group({      
      cep: ['', Validators.required]      
    });
    this.storage = window.localStorage;
    if(this.carrinhoCompra){
      this.carrinhoCompra.clienteId = parseInt(JSON.parse(this.storage.getItem('clienteId'))[0]);
    }
  }

  getListaCarrinho(){
    this.carrinhoService.getLista().subscribe((lista:CarrinhoCompra) => {      
      this.carrinhoCompra = lista;      
      if(!this.carrinhoCompra.frete){
        this.carrinhoCompra.frete = new CarrinhoFrete();
      }   
    });
  }

  removeCarrinho(item){
    this.carrinhoCompra.listaCompras.splice(this.carrinhoCompra.listaCompras.findIndex(i => i.id === item.id), 1);
    this.updateValorCompras();    
  }

  updateQtd(item, valor){
    this.carrinhoCompra.listaCompras.filter(i => i.id === item.id)[0].qtd += valor;    
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
      let itemCarrinho = this.carrinhoCompra.listaCompras.filter(i => i.id === produto.id)[0];      

      produto.qtd > estoque ? itemCarrinho.infoEstoque = 'true' : itemCarrinho.infoEstoque = '';  
    });
  }

  updateValorCompras(){
    if(this.carrinhoCompra){
      return this.carrinhoCompra.valorCompras = this.carrinhoCompra?.listaCompras?.reduce((acc, item) => { return acc + (item.precoPor * item.qtd) }, 0);
    }
  }

  updateValorTotal(){
    if(this.carrinhoCompra){
         
      let valorFrete = parseFloat(this.carrinhoCompra.frete?.valorFrete.toString())      
      let total = this.carrinhoCompra.valorCompras + valorFrete;
      this.carrinhoCompra.valorTotal = total > 0 ? total : 0;
      return total > 0 ? total : 0;
    }
  }

  calcularFrete(){
    this.carrinhoCompra.listaFrete = [];
    this.sandBox.calculaFrete(this.carrinhoForm.get('cep').value).subscribe( (res:any) => {
      res.forEach(element => {
        if(element.price){
          if(element.name == ".Com"){
            element.price = element.price - element.discount;
          }
          this.carrinhoCompra.listaFrete.push(element)
        }
      });
    });
  }
  setFrete(frete){      
    this.carrinhoCompra.frete = new CarrinhoFrete();      
    this.carrinhoCompra.frete.transportadora = frete.company.name;
    this.carrinhoCompra.frete.valorFrete = frete.price;    
  } 

  continuarCompra(){
    this.carrinhoService.setLista(this.carrinhoCompra);
    this.route.navigate(['home'])
  }

  concluirPedido(){    
    if(this.storage.length){
      this.status.emit();
    }
    
    this.carrinhoService.setLista(this.carrinhoCompra);
    this.route.navigate(['home/carrinho/identificacao'])
  }

  validaBtn(){
    if(this.carrinhoCompra){
      let infoEstoque = this.carrinhoCompra.listaCompras.filter(c => c.infoEstoque != '').length;      
      let frete = this.carrinhoCompra.frete?.transportadora == undefined;

      return infoEstoque || frete ? true : false;
    }
  }
}
