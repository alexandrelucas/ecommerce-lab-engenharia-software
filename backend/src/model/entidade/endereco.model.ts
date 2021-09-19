import EntidadeDominio from "./entidadeDominio.model";
import TipoEndereco from "./tipoEndereco";
import TipoLogradouro from "./tipoLogradouro";
import TipoResidencia from "./tipoResidencia";

export default class Endereco extends EntidadeDominio {
    clienteId?: number;
    logradouro!: string;
    numero!: string;
    bairro!: string;
    complemento!: string;
    descricaoEndereco!: string;
    cep!: string;
    tipoEndereco!: TipoEndereco;
    tipoResidencia!: TipoResidencia;
    tipoLogradouro!: TipoLogradouro;
    cidade!: string;
    uf!: string;
    pais!: string;
    
    constructor(id: number = null!, clienteId: number = null!) {
        super();
        this.id = id;
        this.clienteId = clienteId;
    }
}