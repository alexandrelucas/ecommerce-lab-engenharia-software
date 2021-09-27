export class Endereco {
    id: number;
    logradouro: string;
    cep: string;
    numero: string;
    complemento: string;
    bairro: string;
    cidade: string;
    uf: string;
    paisId: string;
    descricaoEndereco: string;
    tipoEnderecoId: string;
    tipoLogradouroId: string;
    clienteId: number

    constructor(id?: number, descricaoEndereco?: string, paisId?: string, logradouro?: string, cep?: string, numero?: string, complemento?: string,
                bairro?: string, cidade?: string, uf?: string, tipoEnderecoId?: string, tipoLogradouroId?: string, clienteId?: number
        ) {
        this.id = id;
        this.descricaoEndereco = descricaoEndereco;
        this.paisId = paisId;
        this.logradouro = logradouro;
        this.cep = cep;
        this.numero = numero;
        this.complemento = complemento;
        this.bairro = bairro;
        this.cidade = cidade;
        this.uf = uf;
        this.tipoEnderecoId = tipoEnderecoId;
        this.tipoLogradouroId = tipoLogradouroId;
        this.clienteId = clienteId;
    }
}