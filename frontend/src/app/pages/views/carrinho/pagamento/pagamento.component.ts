import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
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

  constructor(
    private carrinhoService: CarrinhoService,
    private route: Router,
    private modalService: NgbModal
  ) {
    this.storage = window.localStorage;
  }

  ngOnInit(): void {
    this.carrinhoService.getLista().subscribe( ret => {
      this.carrinho = ret;
      console.log(ret)
    })
  }

  onSubmitPedido() {
    this.carrinho.numeroPedido = Math.floor(100000 + Math.random() * 900000);
    this.carrinho.status = 0;
    let dadosCarrinho = [this.carrinho];
    this.storage.setItem('listaPedidos', JSON.stringify(dadosCarrinho));
    let modalRef = this.modalService.open(ResultadoComponent);
    modalRef.componentInstance.numeroPedido = this.carrinho.numeroPedido;
    modalRef.componentInstance.status = this.carrinho.status;
    modalRef.result.then(r => this.route.navigate(['/home/produtos']));
  }
}
