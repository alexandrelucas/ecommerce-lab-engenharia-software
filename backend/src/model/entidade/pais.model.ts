import EntidadeDominio from "./entidadeDominio.model";

export default class Pais extends EntidadeDominio {
    sigla?: string;

    constructor(id: number, descricao: string, sigla: string) {
        super();
        this.id = id;
        this.sigla = descricao;
    }
}