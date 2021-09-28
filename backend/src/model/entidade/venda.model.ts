import EntidadeDominio from "./entidadeDominio.model";

export default class Venda extends EntidadeDominio {
    pedidoId?: number;
    status?: number;
    valor?: number;
}