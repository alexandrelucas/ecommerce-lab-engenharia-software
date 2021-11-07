export class CarrinhoCupom {
    id: number;
    valorCupomDesconto: number;    
    codigoCupom: string;

    constructor(id?, valorCupomDesconto?, codigoCupom? ){
        this.id = id,
        this.valorCupomDesconto = valorCupomDesconto,        
        this.codigoCupom = codigoCupom
    }
}