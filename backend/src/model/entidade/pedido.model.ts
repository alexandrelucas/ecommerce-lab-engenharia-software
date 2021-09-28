import Cliente from "./cliente.model";
import Cupom from "./cupom.model";
import Pagamento from "./pagamento.model";
import Produto from "./produto.model";

enum StatusPedido {
    EM_PROCESSAMENTO,
    PAGAMENTO_REALIZADO,
    EM_TRANSPORTE,
    TROCA_SOLICITADA,
    TROCA_ACEITA,
    TROCA_AUTORIZADA,
    TROCA_EFETUADA,
    TROCA_REJEITADA,
    CANCELAMENTO_ACEITO,
    CANCELAMENTO_EFETUADO,
    CANCELAMENTO_SOLICITADO,
    CANCELAMENTO_REJEITADO,
}

export default class Pedido {
    id?: number;
    codigo?: string;
    status?: number;
    valorFrete?: number;
    transportadora?: string;
    valorTotal?: string;
    cupomId?: number;
    pagamentoId?: number;
    data?: Date;

    constructor(id: number = null!) {
        this.id = id;
    }
}