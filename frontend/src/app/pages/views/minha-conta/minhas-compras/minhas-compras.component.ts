import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StatusPedidoNome } from 'src/app/shared/models/pedido.model';
import { SandBoxService } from 'src/app/shared/services/carrinho.service';

@Component({
  selector: 'app-minhas-compras',
  templateUrl: './minhas-compras.component.html',
  styleUrls: ['./minhas-compras.component.scss']
})
export class MinhasComprasComponent implements OnInit, AfterViewInit {
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public itensCompra = [];
  public compraSelecionada: Compra;
  public itemSelecionado: Produto;
  public storage: Storage;
  public listaPedidos = []
  public statusTroca = { status : 0 }
  displayedColumns: string[] = ['codigo', 'status', 'data', 'quantidade', 'valorFrete','valorTotal', 'acao'];
  dataSource = new MatTableDataSource<Compra>();

  constructor(
    private modalService: NgbModal,
    private servico: SandBoxService
  ) {
    this.storage = window.localStorage;
  }

  carregarPedidos() {
    let id = parseInt(JSON.parse(this.storage.getItem('clienteId'))[0]);
    this.servico.getPedidosMinhasCompras(id).subscribe((listaPedidos: any) => {
      this.listaPedidos = listaPedidos.pedidos;
      console.log(this.listaPedidos)

      this.dataSource = new MatTableDataSource(listaPedidos.pedidos);
    });
  }

  ngOnInit(): void {
    this.carregarPedidos();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  showDetalheCompra(content, compra){    
    this.itensCompra = this.listaPedidos.filter(pedido => pedido.codigo == compra.codigo )[0]    
    console.log(this.itensCompra)

    this.modalService.open(content, {
      windowClass: 'modal-produtos'
    })
  }
  
  showModalTrocaProduto(content, produto, itensCompra){
    this.itemSelecionado = produto;
    this.itemSelecionado.idPedido = itensCompra.id;
    this.itemSelecionado.idCodPedido = itensCompra.codigo;
    
    this.modalService.open(content, {
      windowClass: 'modal-troca'
    });
  }

  confirmaTrocaProduto(){    
    this.statusTroca.status = 5;    
    this.servico.setStatusTrocaProduto(this.itemSelecionado.idPedido, this.itemSelecionado.id, this.statusTroca).subscribe((ret:any) => {
      console.log(ret)
      if(ret.status == 0){
        this.itemSelecionado.status = 5;
      }
    });
  }

  showModalCancelaCompra(content, pedido){
    this.compraSelecionada = pedido;

    this.modalService.open(content, {
      windowClass: 'modal-compra'
    });
  }

  confirmaCancelarCompra(){
    console.log(this.compraSelecionada);
    //ELEMENT_DATA_COMPRA.filter(compra => compra.id == this.compraSelecionada.id)[0].status = "Cancelamento Solicitado"
    this.modalService.dismissAll();    
  }

  getStatusNome(status: number) {
    return StatusPedidoNome[status];
  }
}

export interface Compra {
  id: number;
  numeroPedido: string;
  status: string;
  valorTotal: number;  
  data: string;
  metodoPagamento: string;
  cupom: number;
}
export interface Produto {
  id: number;
  numeroPedido: string;
  nome: string;
  status: number;
  preco: number;
  qtd: number;
  data: string;
  idCodPedido?: number;
  idPedido?: number;
}