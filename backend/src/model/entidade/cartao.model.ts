import EntidadeDominio from "./entidadeDominio.model";

export default class Cartao extends EntidadeDominio {
    clienteId?: number;
    titular!: string;
    numero!: string;
    cvv!: string;
    dataValidade!: Date;    
    
    constructor(id: number = null!, clienteId: number = null!) {
        super();
        this.id = id;
        if(clienteId != null) this.clienteId = clienteId;
        
    }
}