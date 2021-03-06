import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CarrinhoCompra } from 'src/app/shared/models/carrinhoCompra.model';
import { SandBoxService } from 'src/app/shared/services/carrinho.service';
import { CarrinhoService } from '../carrinho.service';
import { ResultadoComponent } from './resultado/resultado.component';

@Component({
  selector: 'app-pagamento',
  templateUrl: './pagamento.component.html',
  styleUrls: ['./pagamento.component.scss']
})
export class PagamentoComponent implements OnInit {

  public carrinhoCompra;
  public storage: Storage;
  public pedido = {
    "valorFrete": undefined,
    "transportadora": undefined,
    "valorSubTotal": undefined,
    "valorTotal": undefined,
    "pagamento": [],
    "enderecoId": undefined,
    "clienteId": undefined,
    "produtos": [],
    "cupons": []
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
    this.carregaCarrinho();
  }

  carregaCarrinho(){
    this.carrinhoService.getLista().subscribe( ret => {
      this.carrinhoCompra = ret;      
    })
  }

  onSubmitPedido() {
    this.preparaPedido();

    let dadosCarrinho = [this.carrinhoCompra];
    this.storage.setItem('listaPedidos', JSON.stringify(dadosCarrinho));    
  }

  preparaPedido(){
    this.pedido.valorFrete = this.carrinhoCompra.valorFrete;
    this.pedido.transportadora = this.carrinhoCompra.frete.transportadora;
    this.pedido.valorFrete = this.carrinhoCompra.frete.valorFrete;
    this.pedido.valorSubTotal = this.carrinhoCompra.valorCompras;
    this.pedido.valorTotal = this.carrinhoCompra.valorTotal;    
    this.pedido.enderecoId = this.carrinhoCompra.enderecoEntrega.id;
    this.pedido.clienteId = this.carrinhoCompra.clienteId;
    this.pedido.cupons = this.carrinhoCompra.cupons;    
    this.carrinhoCompra.listaCompras.forEach(prd => {
      this.pedido.produtos.push({id: prd.id, quantidade: prd.qtd, valor: prd.precoPor})
    });
    if(!this.carrinhoCompra.pagamento.doisCartoes){      
      this.pedido.pagamento.push({ cartaoId: this.carrinhoCompra.pagamento.cartaoPrincipal.idCartao, valor: this.carrinhoCompra.pagamento.cartaoPrincipal.valorAPagar});      
    }else{
      this.pedido.pagamento.push({ cartaoId: this.carrinhoCompra.pagamento.cartaoPrincipal.idCartao, valor: this.carrinhoCompra.pagamento.cartaoPrincipal.valorAPagar});      
      this.pedido.pagamento.push({ cartaoId: this.carrinhoCompra.pagamento.segundoCartao.idCartao, valor: this.carrinhoCompra.pagamento.segundoCartao.valorAPagar});      
    }

    this.gravarPedido();
  } 

  gravarPedido(){
    console.log(this.pedido)

    this.servico.setPedido(this.pedido).subscribe((ret:any) => {
      this.carrinhoCompra.status = 0;
      this.carrinhoCompra.numeroPedido = ret.message;
      
      

      let modalRef = this.modalService.open(ResultadoComponent);
      modalRef.componentInstance.numeroPedido = this.carrinhoCompra.numeroPedido;
      modalRef.componentInstance.status = this.carrinhoCompra.status;
      modalRef.result.then(r => {
        this.reset();
        this.route.navigate(['/home/minha-conta#pedidos'])
      });
    })
  }

  reset(){
    this.carrinhoCompra = new CarrinhoCompra();
    this.carrinhoService.setLista(this.carrinhoCompra);
  }
}
