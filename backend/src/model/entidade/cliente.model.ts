import Endereco from "./endereco.model";
import EntidadeDominio from "./entidadeDominio.model";

export default class Cliente extends EntidadeDominio {
    dataCadastro?: Date;
    nome?: string;
    dataNasc?: Date;
    cpf!: string;
    tipoTelefone?: number;
    telefone?: string;
    sexo?: string;
    email?: string;
    senha?: string;
    inativado?: boolean;
    classificacao?: number;
    novaSenha?: string;    

    constructor(id: number = null!) {
        super();
        this.id = id;
    }
}