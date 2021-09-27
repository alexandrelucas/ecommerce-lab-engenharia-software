import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-estoque',
  templateUrl: './estoque.component.html',
  styleUrls: ['./estoque.component.scss']
})
export class EstoqueComponent implements OnInit, AfterViewInit {
  
  @ViewChild(MatPaginator) paginator: MatPaginator;

  displayedColumns: string[] = ['codigo', 'tipo', 'status', 'valorTotal', 'validade'];
  dataSource = new MatTableDataSource<Estoque>(ELEMENT_DATA_COMPRA);

  constructor() { }

  ngOnInit(): void {
  }
  
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}

export interface Estoque {
  id: number;
  codigo: string;
  tipo: string;
  status: string;
  valorTotal: number;  
  validade: string;  
}

const ELEMENT_DATA_COMPRA: Estoque[] = [
  {id: 1, codigo: '015645', tipo: 'TROCA', status: 'ATIVO', valorTotal: 41.0, validade: "12/11/2021"},
  {id: 2, codigo: '045451', tipo: 'TROCA', status: 'ATIVO', valorTotal: 19.8, validade: "19/10/2021"}  
];