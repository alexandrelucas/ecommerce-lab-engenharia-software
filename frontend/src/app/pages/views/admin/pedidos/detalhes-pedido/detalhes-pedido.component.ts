import { Component, Input, OnInit } from '@angular/core';
import { Pedido, StatusPedido, StatusPedidoNome } from 'src/app/shared/models/pedido.model';
import { Produto } from 'src/app/shared/models/produtos.model';

@Component({
  selector: 'app-detalhes-pedido',
  templateUrl: './detalhes-pedido.component.html',
  styleUrls: ['./detalhes-pedido.component.scss']
})
export class DetalhesPedidoComponent implements OnInit {

  @Input() pedido: Pedido;
  produtosLista: Array<Produto>;

  constructor() { }

  ngOnInit(): void {
    this.produtosLista = this.pedido.listaCompras;
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
}
