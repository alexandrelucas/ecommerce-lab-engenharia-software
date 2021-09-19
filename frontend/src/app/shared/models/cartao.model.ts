export class Cartao {
    id: number;
    titular: string;
    numero: string;
    cvv: string;
    bandeira: string;
    dataValidade: string;

    constructor(id?: number, titular?: string, numero?: string, cvv?: string, bandeira?: string, dataValidade?: string) {
        this.id = id;
        this.titular = titular;
        this.numero = numero;
        this.cvv = cvv;
        this.bandeira = bandeira;
        this.dataValidade = dataValidade;
    }
}