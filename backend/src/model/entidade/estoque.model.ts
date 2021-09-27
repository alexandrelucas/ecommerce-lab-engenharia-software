import EntidadeDominio from "./entidadeDominio.model";

export default class Estoque extends EntidadeDominio {
    quantidade?: number;
    fornecedor?: string;
    valorCusto?: number;
    dataEntrada?: Date;
    produtoId?: number;

    constructor(id: number = null!, produtoId: number = null!) {
        super();
        this.id = id;
        this.produtoId = produtoId;
    }
}