import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SandBoxService } from 'src/app/shared/services/carrinho.service';
import { CarrinhoService } from '../carrinho.service';
import { ResultadoComponent } from './resultado/resultado.component';

@Component({
  selector: 'app-pagamento',
  templateUrl: './pagamento.component.html',
  styleUrls: ['./pagamento.component.scss']
})
export class PagamentoComponent implements OnInit {

  public carrinho;
  public storage: Storage;
  public pedido = {
    "valorFrete": undefined,
    "transportadora": undefined,
    "valorSubTotal": undefined,
    "valorTotal": undefined,
    "pagamento": [],
    "enderecoId": undefined,
    "clienteId": undefined,
    "produtos": []
  }

  constructor(
    private carrinhoService: CarrinhoService,
    private route: Router,
    private modalService: NgbModal,
    private servico: SandBoxService
  ) {
    this.storage = window.localStorage;
  }

  ngOnInit(): void {
    this.carrinhoService.getLista().subscribe( ret => {
      this.carrinho = ret;      
    })
  }

  onSubmitPedido() {
    this.preparaPedido();

    let dadosCarrinho = [this.carrinho];
    this.storage.setItem('listaPedidos', JSON.stringify(dadosCarrinho));    
  }

  preparaPedido(){
    this.pedido.valorFrete = this.carrinho.valorFrete;
    this.pedido.transportadora = this.carrinho.listaFrete[0].name;
    this.pedido.valorSubTotal = this.carrinho.valorCompras;
    this.pedido.valorTotal = this.carrinho.valorTotal;    
    this.pedido.enderecoId = this.carrinho.enderecoEntrega.id;
    this.pedido.clienteId = this.carrinho.clienteId;    
    this.carrinho.listaCompras.forEach(prd => {
      this.pedido.produtos.push({id: prd.id, quantidade: prd.qtd, valor: prd.precoPor})
    });
    if(!this.carrinho.pagamento.doisCartoes){      
      this.pedido.pagamento.push({ cartaoId: this.carrinho.pagamento.cartaoPrincipal.idCartao, valor: this.carrinho.pagamento.cartaoPrincipal.valorAPagar});      
    }else{
      this.pedido.pagamento.push({ cartaoId: this.carrinho.pagamento.cartaoPrincipal.idCartao, valor: this.carrinho.pagamento.cartaoPrincipal.valorAPagar});      
      this.pedido.pagamento.push({ cartaoId: this.carrinho.pagamento.segundoCartao.idCartao, valor: this.carrinho.pagamento.segundoCartao.valorAPagar});      
    }

    this.gravarPedido();
  } 

  gravarPedido(){
    this.servico.setPedido(this.pedido).subscribe((ret:any) => {      
      this.carrinho.status = 0;
      this.carrinho.numeroPedido = ret.message;
      
      let modalRef = this.modalService.open(ResultadoComponent);      
      modalRef.componentInstance.numeroPedido = this.carrinho.numeroPedido;
      modalRef.componentInstance.status = this.carrinho.status;
      modalRef.result.then(r => this.route.navigate(['/home/minha-conta#pedidos']));
    })
  }
}
