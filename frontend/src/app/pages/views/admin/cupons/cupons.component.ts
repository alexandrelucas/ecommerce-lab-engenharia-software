import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Cupom from 'src/app/shared/models/cupom.model';
import { CadastrarCupomComponent } from './cadastrar-cupom/cadastrar-cupom.component';

@Component({
  selector: 'app-cupons',
  templateUrl: './cupons.component.html',
  styleUrls: ['./cupons.component.scss']
})
export class CuponsComponent implements OnInit {

  
  public listaCupons: Array<Cupom> = [];
  public storage: Storage;

  constructor(private modalService: NgbModal) { 
    this.storage = window.localStorage;
  }

  displayedColumns: string[] = ['id', 'codigo', 'valorDesconto', 'tipoCupom', 'ativo', 'excluir'];
  dataSource: MatTableDataSource<Cupom>;

  ngOnInit(): void {
    this.carregarListaCupons();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  deletarCupom(id: number) {
    let index = this.listaCupons.findIndex(c => c.id === id);
    if(index > -1){
      this.listaCupons.splice(index, 1);
      this.gravarListaCupons();
      this.carregarListaCupons();
    }
  }


  carregarListaCupons() {
    this.listaCupons = JSON.parse(this.storage.getItem('cuponsCadastrados')) as Array<Cupom> ?? [];
    this.dataSource = new MatTableDataSource(this.listaCupons);
  }

  gravarListaCupons() {
    this.storage.setItem('cuponsCadastrados', JSON.stringify(this.listaCupons));
  }


  async showCadastroModal(cupom?: any) {
    const modalRef = this.modalService.open(CadastrarCupomComponent);
    modalRef.componentInstance.cupom = cupom;
    let cupomResult = await modalRef.result;
    if(!cupom) {
      cupomResult.id = this.listaCupons.length + 1;
    }
    this.listaCupons.push(await cupomResult);
    this.gravarListaCupons();
    this.carregarListaCupons();
    // modalRef.componentInstance.produtosLista = produtosLista;
    // console.log(modalRef.componentInstance);
  }

}
