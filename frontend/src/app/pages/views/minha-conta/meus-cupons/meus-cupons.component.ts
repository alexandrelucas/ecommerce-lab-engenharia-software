import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SandBoxService } from 'src/app/shared/services/carrinho.service';

@Component({
  selector: 'app-meus-cupons',
  templateUrl: './meus-cupons.component.html',
  styleUrls: ['./meus-cupons.component.scss']
})
export class MeusCuponsComponent implements OnInit {
  
  @ViewChild(MatPaginator) paginator: MatPaginator;  
  displayedColumns: string[] = ['codigo', 'tipoCupom', 'valorDesconto', 'validade', 'usado'];;
  dataSource = new MatTableDataSource<Cupom>();
  public storage;
  public clienteId;

  constructor(
    private servico: SandBoxService
  ) { 
    this.storage = window.localStorage;
    this.clienteId = JSON.parse(this.storage.getItem('clienteId'));
  }

  ngOnInit(): void {    
    this.getCupomCliente(this.clienteId[0]);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  getCupomCliente(idCliente){
    this.servico.getCupomCliente(idCliente).subscribe( (result:any) => {
      console.log(result);
      this.dataSource = result.listaCupons;
    })
  }

}

export interface Cupom {
  id: number;
  clienteId: number;
  codigo: string;
  cupomId: number;
  tipoCupom: string;  
  valorDesconto: number;  
  validade: string;  
  usado: boolean;
}