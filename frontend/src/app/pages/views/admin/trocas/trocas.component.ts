import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { StatusPedido, StatusPedidoNome } from 'src/app/shared/models/pedido.model';
import { SandBoxService } from 'src/app/shared/services/carrinho.service';

@Component({
  selector: 'app-trocas',
  templateUrl: './trocas.component.html',
  styleUrls: ['./trocas.component.scss']
})
export class TrocasComponent implements OnInit {
  
  public dataSource: MatTableDataSource<any>;
  public statusTroca = { status : 5 }
  displayedColumns: string[] = ['codigo', 'produto','produtoId', 'data', 'status', 'acoes'];
  
  constructor(
    private servico: SandBoxService
  ) { }

  ngOnInit(): void {
    this.getSolicitacoesTroca();    
  }

  getSolicitacoesTroca(){
    this.servico.getListaTrocas().subscribe((ret:any) => {
      console.log(ret)
      if(ret.status == 0){
        this.dataSource = new MatTableDataSource(ret.produtos);
      }      
    })
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

  setStatusTroca(idPedido, idProduto, status){
    this.statusTroca.status = status;
    this.servico.setStatusTrocaProduto(idPedido, idProduto, this.statusTroca).subscribe((ret:any) => {      
      if(ret.status == 0){
        this.getSolicitacoesTroca();
      }
    });
  }
}

