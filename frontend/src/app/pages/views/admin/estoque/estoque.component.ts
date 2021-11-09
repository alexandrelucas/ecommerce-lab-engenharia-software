import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SandBoxService } from 'src/app/shared/services/carrinho.service';

@Component({
  selector: 'app-estoque',
  templateUrl: './estoque.component.html',
  styleUrls: ['./estoque.component.scss']
})
export class EstoqueComponent implements OnInit, AfterViewInit {
  
  @ViewChild(MatPaginator) paginator: MatPaginator;

  displayedColumns: string[] = ['produtoId', 'fornecedor', 'dataEntrada', 'quantidade', 'valorCusto', 'acoes'];
  dataSource = new MatTableDataSource<Estoque>();
  public produtoSelecionado;

  constructor(
    private service: SandBoxService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.carregaListaProdutos();
  }

  carregaListaProdutos(){
    this.service.getEstoque().subscribe( (ret:any) => {
      this.dataSource = ret.produtos;
      console.log(ret)
    });
  }
  
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  

  showModalExcluiProduto(content, produto){
    this.produtoSelecionado = produto;

    this.modalService.open(content, {
      windowClass: 'modal-compra'
    });
  }

  deleteProduto(){
    this.modalService.dismissAll();    
    this.service.retirarEstoqueProduto(this.produtoSelecionado.id).subscribe((result: any) => {
      this.carregaListaProdutos();
    });
  }
}

export interface Estoque {
  id: number;
  dataEntrada: Date;
  fornecedor: string;
  produtoId: number;
  quantidade: number;
  valorCusto: number;
}

// const ELEMENT_DATA_COMPRA: Estoque[] = [
//   {id: 1, codigo: '015645', tipo: 'TROCA', status: 'ATIVO', valorTotal: 41.0, validade: "12/11/2021"},
//   {id: 2, codigo: '045451', tipo: 'TROCA', status: 'ATIVO', valorTotal: 19.8, validade: "19/10/2021"}  
// ];