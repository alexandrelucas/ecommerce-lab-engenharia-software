import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-meus-cupons',
  templateUrl: './meus-cupons.component.html',
  styleUrls: ['./meus-cupons.component.scss']
})
export class MeusCuponsComponent implements OnInit {
  
  @ViewChild(MatPaginator) paginator: MatPaginator;  
  displayedColumns: string[] = ['codigo', 'tipo', 'status', 'valorTotal', 'validade'];
  dataSource = new MatTableDataSource<Cupom>(ELEMENT_DATA_COMPRA);

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

}

export interface Cupom {
  id: number;
  codigo: string;
  tipo: string;
  status: string;
  valorTotal: number;  
  validade: string;  
}

const ELEMENT_DATA_COMPRA: Cupom[] = [
  {id: 1, codigo: '015645', tipo: 'TROCA', status: 'ATIVO', valorTotal: 41.0, validade: "12/11/2021"},
  {id: 2, codigo: '045451', tipo: 'TROCA', status: 'ATIVO', valorTotal: 19.8, validade: "19/10/2021"},
  {id: 3, codigo: 'VINO2021', tipo: 'PROMOCIONAL', status: 'ATIVO', valorTotal: 16.9, validade: "03/10/2021"},
];