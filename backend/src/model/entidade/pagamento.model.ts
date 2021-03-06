import Cartao from "./cartao.model";
import EntidadeDominio from "./entidadeDominio.model";

export default class Pagamento extends EntidadeDominio {
    id?: number;
    dataPagamento?: Date;
    status?: number;
    cartoes?: IPagamentoCartoes[];
}


interface IPagamentoCartoes {
    cartaoId: number;
    valor: number;
}