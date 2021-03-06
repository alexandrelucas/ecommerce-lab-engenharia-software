import { DataSource } from '@angular/cdk/collections';
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
      console.log(result)
      this.dataSource = new MatTableDataSource(result.pedidos);
    })
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

  getStatus(status: number, statusCancelamento: number) {
    if((statusCancelamento != 0 && statusCancelamento != 13)) {
      return StatusPedidoNome[statusCancelamento];
    } else
    if(status == -1) {
      return 'Pagamento Rejeitado';
    }
    return StatusPedidoNome[status];
  }

  getValor(valor) {
    return Math.sign(valor) == -1 ? 0 : valor;
  }

  getNomeProdutos(produtosLista: Array<Produto>) {
    return produtosLista.map(p => p.titulo).reduce((p, n) => `${p}, ${n}`);
  }

  showDetalhesPedido(pedido) {
    const modalRef = this.modalService.open(DetalhesPedidoComponent, {
      windowClass: 'detalhesPedido'
    });
    modalRef.componentInstance.pedido = pedido;   
    
    modalRef.result.then((res:any) => {      
      let idxPedido = this.dataSource.data.findIndex((dt:any) => dt.id == res.id && dt.produtoId == res.produtoId);
      this.dataSource.data[idxPedido].status = res.status;
    });
  }

  autorizarVenda(pedidoId) {
    this.servico.autorizarVenda(pedidoId).subscribe((result: any) => {
      if(result.status == 0) {
        this.carregarListaPedidos();
      }
    });
  }

  rejeitarVenda(pedidoId) {
    this.servico.rejeitarVenda(pedidoId).subscribe((result: any) => {
      if(result.status == 0) {
        this.carregarListaPedidos();
      }
    });
  }
}
