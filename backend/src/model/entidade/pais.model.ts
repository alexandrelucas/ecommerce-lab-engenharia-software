import EntidadeDominio from "./entidadeDominio.model";

export default class Pais extends EntidadeDominio {
    sigla?: string;

    constructor(id: number, sigla: string) {
        super();
        this.id = id;
        this.sigla = sigla;
    }
}