import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-minhas-compras',
  templateUrl: './minhas-compras.component.html',
  styleUrls: ['./minhas-compras.component.scss']
})
export class MinhasComprasComponent implements OnInit, AfterViewInit {
  
  public itensCompra = [];
  public compraSelecionada: Compra;
  public itemSelecionado: Produto;

  constructor(
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
  }

  displayedColumns: string[] = ['numeroPedido', 'status', 'valorTotal', 'data', 'metodoPagamento', 'cupom', 'acao'];
  dataSource = new MatTableDataSource<Compra>(ELEMENT_DATA_COMPRA);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  showDetalheCompra(content, idCompra){    
    this.itensCompra = ELEMENT_DATA.filter( compra => compra.numeroPedido == idCompra);
    this.modalService.open(content, {
      windowClass: 'modal-produtos'
    })
  }

  showModalCancelaCompra(content, idPedido){
    this.compraSelecionada = ELEMENT_DATA_COMPRA.filter( c => c.numeroPedido === idPedido)[0];

    this.modalService.open(content, {
      windowClass: 'modal-compra'
    });
  }

  showModalTrocaProduto(content, idItem){
    this.itemSelecionado = ELEMENT_DATA.filter( c => c.id === idItem)[0];
    console.log(this.itemSelecionado)

    this.modalService.open(content, {
      windowClass: 'modal-troca'
    });
  }

  setTrocaProduto(){
    ELEMENT_DATA.filter( c => c.id === this.itemSelecionado.id)[0].status = "Troca Solicitada";
    console.log(this.modalService.activeInstances);
  }

  setCancelarCompra(){
    ELEMENT_DATA_COMPRA.filter(compra => compra.id == this.compraSelecionada.id)[0].status = "Cancelamento Solicitado"
    this.modalService.dismissAll();
    /**
     * SET compraSelecionada como cancelada.
     */
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
  status: string;
  preco: number;
  qtd: number;
  data: string;
}

const ELEMENT_DATA_COMPRA: Compra[] = [
  {id: 1, numeroPedido: '03498642', status: 'CONCLUÍDO',   valorTotal: 292.0, data: "31/08/2021", metodoPagamento: "Cartão de Crédito", cupom: 30},
  {id: 2, numeroPedido: '04323932', status: 'EM TRANSITO', valorTotal: 89.99, data: "10/09/2021", metodoPagamento: "Boleto bancário",   cupom: 25},
];

const ELEMENT_DATA: Produto[] = [
  {id: 1, numeroPedido:'03498642',  nome: 'Cruz Del Sur Malbec', status: 'CONCLUÍDO', preco: 100.0, qtd: 2, data: "31/08/2021"},
  {id: 2, numeroPedido:'03498642',  nome: 'El Bravo',            status: 'EM PROCESSAMENTO', preco: 42.0, qtd: 1, data: "31/08/2021"},
  {id: 3, numeroPedido:'03498642',  nome: 'Fonte Serrana',       status: 'EM TRANSITO', preco: 150.0, qtd: 1, data: "31/08/2021"},
  {id: 4, numeroPedido:'04323932',  nome: 'Sangue de Boi',       status: 'CONCLUÍDO', preco: 89.99, qtd: 2, data: "31/08/2021"},
];