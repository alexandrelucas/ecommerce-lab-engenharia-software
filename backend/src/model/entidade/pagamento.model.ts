import Cartao from "./cartao.model";
import EntidadeDominio from "./entidadeDominio.model";

export default class Pagamento extends EntidadeDominio {
    id?: number;
    cartao?: Cartao;
}