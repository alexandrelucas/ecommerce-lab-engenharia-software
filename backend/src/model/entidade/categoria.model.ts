import EntidadeDominio from "./entidadeDominio.model";

export default class Categoria extends EntidadeDominio { 
    descricao?: string;
    margemLucro?: number;

    constructor(id: number = null!) {
        super();
        this.id = id;
    }
}