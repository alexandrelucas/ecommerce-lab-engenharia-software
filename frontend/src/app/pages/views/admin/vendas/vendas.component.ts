import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SandBoxService } from 'src/app/shared/services/carrinho.service';

@Component({
  selector: 'app-vendas',
  templateUrl: './vendas.component.html',
  styleUrls: ['./vendas.component.scss']
})
export class VendasComponent implements OnInit {

  displayedColumns: string[] = ['id', 'codigo', 'clienteNome', 'cpf', 'dataPagamento', 'valorTotal'];
  public dataSource: MatTableDataSource<any>;
    
  constructor(
    private servico: SandBoxService
  ) { }

  ngOnInit(): void {
    this.getListaVendas();
  }  

  getListaVendas(){
    this.servico.getListaVendas().subscribe((result:any) => {
      console.log(result.vendas)
      this.dataSource = new MatTableDataSource(result.vendas);      
    });
  }
}
