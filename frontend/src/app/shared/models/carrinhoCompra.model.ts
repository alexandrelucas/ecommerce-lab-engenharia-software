import { Carrinho } from "./carrinho.model";
import { CarrinhoCupom } from "./carrinhoCupom.model";
import { CarrinhoFrete } from "./carrinhoFrete.model";
import { CarrinhoPagamento } from "./carrinhoPagamento.model";
import { Cartao } from "./cartao.model";
import { Endereco } from "./endereco.model";

export class CarrinhoCompra {
    valorTotal: number;
    valorCompras: number;
    valorDescontos: number;
    listaFrete: any[];
    listaCompras: Carrinho[];
    enderecos: [];
    enderecoEntrega: Endereco;
    cartoes: [];
    cartaoPagamento: Cartao;
    cupons: [];
    frete: CarrinhoFrete;
    pagamento: CarrinhoPagamento;
    clienteId: number;

    constructor(valorTotal = 0, valorCompras = 0, listaFrete?, listaCompras?, enderecos?, enderecoEntrega?, cartoes?, cartaoPagamento?, 
        cupom?, frete?, pagamento?, clienteId?, valorDescontos = 0){
        this.valorTotal = valorTotal,
        this.valorCompras = valorCompras,
        this.valorDescontos = valorDescontos,
        this.listaFrete = listaFrete,
        this.listaCompras = listaCompras,
        this.enderecos = enderecos,
        this.enderecoEntrega = enderecoEntrega,
        this.cartoes = cartoes,
        this.cartaoPagamento = cartaoPagamento,
        this.cupons = cupom,
        this.frete = frete,
        this.pagamento = pagamento,
        this.clienteId = clienteId
    }
}