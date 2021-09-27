export class Cartao {
    id: number;
    nomeTitular: string;
    numero: string;
    cvv: string;
    bandeira: string;
    dataValidade: string;

    constructor(id?: number, nomeTitular?: string, numero?: string, cvv?: string, bandeira?: string, dataValidade?: string) {
        this.id = id;
        this.nomeTitular = nomeTitular;
        this.numero = numero;
        this.cvv = cvv;
        this.bandeira = bandeira;
        this.dataValidade = dataValidade;
    }
}