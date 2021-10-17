import EntidadeDominio from "./entidadeDominio.model";

export default class PedidoProduto extends EntidadeDominio {
    pedidoId?: number;
    produtoId?: number;
    status?: number;

    constructor(id: number = null!) {
       super();
       this.id = id; 
    }
}