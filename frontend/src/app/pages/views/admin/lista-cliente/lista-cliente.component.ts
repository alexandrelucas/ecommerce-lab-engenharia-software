import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Cliente } from 'src/app/shared/models/cliente.model';
import { ClienteService } from 'src/app/shared/services/cliente.service';
import { LocalStorageService } from 'src/app/shared/services/localStorage.service';

@Component({
  selector: 'app-lista-cliente',
  templateUrl: './lista-cliente.component.html',
  styleUrls: ['./lista-cliente.component.scss']
})
export class ListaClienteComponent implements OnInit {

  public listaClientes: Array<Cliente> = [
  ];

  displayedColumns: string[] = ['index', 'nome', 'email', 'telefone', 'dataNasc', 'inativado', 'classificacao'];
  dataSource: MatTableDataSource<Cliente>;

  constructor(private clienteService: ClienteService) { }

  ngOnInit(): void {
    this.getListaClientes();
  }

  getListaClientes() {
    this.clienteService.getListaCliente().subscribe( (result:any) => {
      console.log(result)

      result.listaClientes.forEach((cliente) => {
        let dataTratada = new RegExp(/\d{4}-\d{2}-\d{2}/).exec(cliente.dataNasc)[0].split('-');
        cliente.dataNasc = `${dataTratada[2]}/${dataTratada[1]}/${dataTratada[0]}`;
      });

      this.listaClientes = result.listaClientes;

      this.dataSource = new MatTableDataSource(this.listaClientes);
    });
  }

  onInativoChange(event) {
    this.clienteService.setClienteDisabled(event.target.id, event.target.checked).subscribe((result: any) => {
      let index = this.listaClientes.findIndex((cliente) => cliente?.id == event.target.id);
      this.listaClientes[index].inativado = event.target.checked;
      
    });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
