import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Pedido, StatusPedido, StatusPedidoNome } from 'src/app/shared/models/pedido.model';
import { listaProdutos, Produto } from 'src/app/shared/models/produtos.model';
import { SandBoxService } from 'src/app/shared/services/carrinho.service';
import { DetalhesPedidoComponent } from './detalhes-pedido/detalhes-pedido.component';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.scss']
})
export class PedidosComponent implements OnInit {

  public storage: Storage;
  public listaPedidos: Array<Pedido> = [];
  constructor(
    private modalService: NgbModal,
    private servico: SandBoxService
  ) { 
    this.storage = window.localStorage;
  }
  
  displayedColumns: string[] = ['codigo', 'status', 'quantidade', 'transportadora', 'valorFrete', 'valorTotal', 'data', 'acao'];
  dataSource: MatTableDataSource<Pedido>;
  
  ngOnInit(): void {
    this.carregarListaPedidos();
  }

  carregarListaPedidos() {    
    this.servico.getListaPedidos().subscribe((result:any) => {      
      //this.ajustaResult(result.pedidos);
      this.dataSource = result.pedidos;
      console.log(result.pedidos)
    });
  }

  ajustaResult(pedidos){
    //console.
    let listPedidos = [];
    pedidos.reduce(function(prev, item) {
      var key = item.codigo;
      prev[key] = prev[key] || [];
      prev[key].push(item);
      return prev;
    });    

    //console.log(pedidos)
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
   //console.log(modalRef.componentInstance);
  }
}
