import EntidadeDominio from "./entidadeDominio.model";

export default class Cupom extends EntidadeDominio{
    id?: number;
    codigo?: string;
    tipoCupom?: string;
    valorDesconto?: number;

    constructor(id: number = null!) {
        super();
        this.id = id;
   
    }
}