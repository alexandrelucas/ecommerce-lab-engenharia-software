import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Pedido, StatusPedido, StatusPedidoNome } from 'src/app/shared/models/pedido.model';
import { Produto } from 'src/app/shared/models/produtos.model';
import { SandBoxService } from 'src/app/shared/services/carrinho.service';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MatHorizontalStepper } from '@angular/material/stepper';
import Cupom from 'src/app/shared/models/cupom.model';

@Component({
  selector: 'app-detalhes-pedido',
  templateUrl: './detalhes-pedido.component.html',
  styleUrls: ['./detalhes-pedido.component.scss'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: {displayDefaultIndicatorType: false}
  }]
})
export class DetalhesPedidoComponent implements OnInit {

  @ViewChild('stepper') stepper: MatHorizontalStepper;
  @Input() pedido: any;
  produtosLista: Array<Produto>;
  public listaProdutos = []
  public paises = []
  public categorias = []
  public statusPedido = { status : 0}

  constructor(
    private servico: SandBoxService,
    private activeModal: NgbActiveModal
  ) { }

  ngOnInit(): void {
    console.log(this.pedido)
    this.produtosLista = this.pedido.listaCompras;
    this.getListaPaises();
  }

  ngAfterViewInit() {
    this.statusPedido.status = this.pedido.status;
    setTimeout(() => {
      for(let i = 0; i <= this.pedido.status; i++){
        this.stepper.selectedIndex = i;
      }
    }, 0);
  }


  getListaPaises(){
    this.servico.getListaPaises().subscribe((result:any) => {
      this.paises = result.paises;
      this.carregaListaProdutos();
    });
  }

  carregaListaProdutos(){
    this.listaProdutos = this.pedido.produtos;
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

  getPaisNome(paisSigla){
    return this.paises.filter(p => p.sigla == paisSigla)[0].descricao;
  }
 
  setStatusPedido(status){
    this.servico.setStatusPedido(this.pedido.id, this.statusPedido).subscribe((ret:any) => {
    })
  }

  setNextStatus() {
    this.servico.setStatusPedido(this.pedido.id, {'status': this.stepper.selectedIndex + 1}).subscribe((ret:any) => {
      this.stepper.next();
    })
  }

  closeModal(){
    this.pedido.status = this.statusPedido.status;
    this.activeModal.close(this.pedido);
  }

  autorizaCancelamento(status: number) {
    this.servico.setStatusPedido(this.pedido.id, {'status':status}).subscribe((ret:any) => {
      this.pedido.statusCancelamento = status;

      if(this.pedido.status >= 1){        
        
        let cupom: any;

        cupom.valorDesconto = this.pedido.valorSubTotal;
        cupom.codigo = `VINO${this.pedido.codigo}2021`;
        cupom.clienteId = this.pedido.enderecoEntrega.clienteId;

        console.log(cupom);

        this.servico.gerarCupomCliente(cupom).subscribe((ret:any) => {
          console.log('Cupom gerado ou nao');
        });
      }
    })
  }
}
