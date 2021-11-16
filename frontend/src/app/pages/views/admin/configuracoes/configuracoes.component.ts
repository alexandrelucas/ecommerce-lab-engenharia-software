import { Component, OnInit } from '@angular/core';
import { SandBoxService } from 'src/app/shared/services/carrinho.service';
import * as moment from 'moment';

@Component({
  selector: 'app-configuracoes',
  templateUrl: './configuracoes.component.html',
  styleUrls: ['./configuracoes.component.scss']
})
export class ConfiguracoesComponent implements OnInit {

  constructor(
    private servico: SandBoxService
  ) { }

  public listaProdutos = [
    {id: 1, precoDe: 45},
    {id: 2, precoDe: 21.51},
    {id: 4, precoDe: 24.9},
    {id: 5, precoDe: 26.71},
    {id: 6, precoDe: 39.5},
    {id: 7, precoDe: 530.9},
    {id: 8, precoDe: 129.9},
    {id: 9, precoDe: 79.9},
    {id: 10, precoDe: 79.9},
    {id: 18, precoDe: 59.9},
    {id: 19, precoDe: 29.9},
    {id: 20, precoDe: 99.9},
    {id: 21, precoDe: 129.9}
  ]
  public qtdPedidos;
  public produtosPedido = []
  public valorSubTotal = 0
  public valorTotal = 0

  ngOnInit(): void {
  }

  incluirProdutos(){
    this.produtosPedido = []    
    let totalProdutos = Math.floor(Math.random() * 3)
    
    for(let i = 0; i <= totalProdutos; i++){
      let idxProduto = Math.floor(Math.random() * 12 + 1)
      let qtd = Math.floor(Math.random() * 3 + 1)

      this.produtosPedido.push({id: this.listaProdutos[idxProduto].id, quantidade: qtd, valor: this.listaProdutos[idxProduto].precoDe })
    }

    //console.log(this.produtosPedido)
    this.getValorTotal();
  }

  getValorTotal(){
    this.produtosPedido.forEach(p=> {      
      this.valorSubTotal += p.valor
    })
    this.valorTotal = this.valorSubTotal + 15.17
  }

  gerarData(){    
      let start = new Date('2020-10-01')
      let end = new Date('2021-10-30')

      var diff =  end.getTime() - start.getTime();
      var new_diff = diff * Math.random();
      var date = new Date(start.getTime() + new_diff);
      return moment(date).format('YYYY-MM-DD');  
  }

  criarPedido(){
    for(let i = 0; i < this.qtdPedidos; i++){
      this.incluirProdutos();

      let pedido = {
        clienteId: 2,
        cupons: [],
        enderecoId: 7,
        pagamento: [
          {cartaoId: 3, valor: this.valorTotal}
        ],
        produtos: this.produtosPedido,
        transportadora: "Correios",
        valorFrete: "15.17",
        valorSubTotal: this.valorSubTotal,
        valorTotal: this.valorTotal,
        data: this.gerarData()
      }
    
      this.setPedido(pedido);
    }
  }

  setPedido(pedido){
    console.log(pedido)

    this.servico.setPedido(pedido).subscribe((ret:any) => {      
      this.autorizarVenda(parseInt(ret.message))
    })
  }

  autorizarVenda(pedidoId) {
    this.servico.autorizarVenda(pedidoId).subscribe((result: any) => {
      if(result.status == 0) {        
      }
    });
  }
}
