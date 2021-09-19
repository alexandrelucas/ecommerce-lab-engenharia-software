import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Cliente } from 'src/app/shared/models/cliente.model';
import { Pedido, StatusPedido, StatusPedidoNome } from 'src/app/shared/models/pedido.model';
import { listaProdutos, Produto } from 'src/app/shared/models/produtos.model';
import { DetalhesPedidoComponent } from './detalhes-pedido/detalhes-pedido.component';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.scss']
})
export class PedidosComponent implements OnInit {

  public storage: Storage;
  public listaPedidos: Array<Pedido> = [];
  constructor(private modalService: NgbModal) { 
    this.storage = window.localStorage;
  }


  displayedColumns: string[] = ['id', 'numeroPedido', 'status', 'valorTotal', 'dataPedido', 'acao'];
  dataSource: MatTableDataSource<Pedido>;
  ngOnInit(): void {
    this.carregarListaPedidos();
    console.log(this.listaPedidos);
    this.dataSource = new MatTableDataSource(this.listaPedidos);
  }

  carregarListaPedidos() {
    this.listaPedidos = JSON.parse(this.storage.getItem('listaPedidos'));
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
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

  getNomeProdutos(produtosLista: Array<Produto>) {
    return produtosLista.map(p => p.titulo).reduce((p, n) => `${p}, ${n}`);
  }

  showDetalhesPedido(pedido) {    
   const modalRef = this.modalService.open(DetalhesPedidoComponent, {
     windowClass: 'detalhesPedido'
   });
   modalRef.componentInstance.pedido = pedido;
   console.log(modalRef.componentInstance);
  }
}
