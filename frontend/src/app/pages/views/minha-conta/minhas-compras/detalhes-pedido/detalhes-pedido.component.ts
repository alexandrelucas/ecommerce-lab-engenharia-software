import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatHorizontalStepper } from '@angular/material/stepper';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StatusPedidoNome } from 'src/app/shared/models/pedido.model';
import { SandBoxService } from 'src/app/shared/services/carrinho.service';

@Component({
  selector: 'app-detalhes-pedido',
  templateUrl: './detalhes-pedido.component.html',
  styleUrls: ['./detalhes-pedido.component.scss']
})
export class DetalhesPedidoComponent implements OnInit {
  
  @ViewChild('stepper') stepper: MatHorizontalStepper;
  @Input() itensCompra: any;
  public itemSelecionado: Produto;
  public statusTroca = { status : 0 }
  constructor(
    private modalService: NgbModal,
    private activeModal: NgbActiveModal,
    private servico: SandBoxService
  ) { }

  ngOnInit(): void {
    console.log(this.itensCompra)
  }
  
  ngAfterViewInit() {    
    setTimeout(() => {
      for(let i = 1; i < this.itensCompra.status; i++){
        this.stepper.selectedIndex = i;
      }
    }, 0);
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

  showModalTrocaProduto(content, produto, itensCompra){
    this.itemSelecionado = produto;
    this.itemSelecionado.idPedido = itensCompra.id;
    this.itemSelecionado.idCodPedido = itensCompra.codigo;
    
    this.modalService.open(content, {
      windowClass: 'modal-troca'
    });
  }  

  getStatusNome(status: number) {
    return StatusPedidoNome[status];
  }

  closeModal(){    
    this.activeModal.close(true);
  }
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