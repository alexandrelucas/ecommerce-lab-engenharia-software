import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { StatusPedidoNome } from 'src/app/shared/models/pedido.model';

@Component({
  selector: 'app-resultado',
  templateUrl: './resultado.component.html',
  styleUrls: ['./resultado.component.scss']
})
export class ResultadoComponent implements OnInit {


  @Input() numeroPedido: number;
  @Input() status: number;

  constructor(private activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  getStatusNome(status: number) {
    return StatusPedidoNome[status];
  }

  closeModal() {
    this.activeModal.close();
  }
}
