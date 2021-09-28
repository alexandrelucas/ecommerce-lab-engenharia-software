import Cliente from "./cliente.model";
import Cupom from "./cupom.model";
import EntidadeDominio from "./entidadeDominio.model";
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

export default class Pedido extends EntidadeDominio{
    id?: number;
    codigo?: string;
    status?: number;
    valorFrete?: number;
    transportadora?: string;
    valorTotal?: string;
    cupomId?: number;
    pagamentoId?: number;
    data?: Date;
    clienteId?: number;

    constructor(id: number = null!, clienteId: number = null!) {
        super();
        this.id = id;
        this.clienteId = clienteId;
    }
}