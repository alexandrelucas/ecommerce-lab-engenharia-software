import EntidadeDominio from "./entidadeDominio.model";

export default class Cupom extends EntidadeDominio{
    id?: number;
    codigo?: string;
    tipoCupom?: string;
    valorDesconto?: number;
    validade?: Date;
    clienteId?: number;

    constructor(id: number = null!, codigo: string = null!, clienteId: number = null!) {
        super();
        this.id = id;
        this.codigo = codigo;
        this.clienteId = clienteId;
    }
}