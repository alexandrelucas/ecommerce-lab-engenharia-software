import Cupom from "./cupom.model";
import EntidadeDominio from "./entidadeDominio.model";

export default class CupomCliente extends EntidadeDominio{
    id?: number;
    usado?: boolean;
    cupom?: Cupom;
    cupomId?: number;
    clienteId?: number;
}