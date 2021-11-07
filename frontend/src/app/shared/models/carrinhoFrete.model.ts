export class CarrinhoFrete {
    valorFrete: number;
    transportadora: string;  

    constructor(valorFrete = 0, transportadora?){
        this.valorFrete = valorFrete,
        this.transportadora = transportadora
    }
}