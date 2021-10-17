import { Cartao } from "./cartao.model";
import { Cliente } from "./cliente.model";
import { Endereco } from "./endereco.model";
import { Produto } from "./produtos.model";

export enum StatusPedido {
    EM_PROCESSAMENTO,
    PAGAMENTO_REALIZADO,
    EM_TRANSPORTE,
    EM_ROTA_ENTREGA,
    ENTREGUE,
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

export let StatusPedidoNome = {
    0: 'Em Processamento',
    1: 'Pagamento Realizado',
    2: 'Em Transporte',
    3: 'Em Rota Entrega',
    4: 'Entregue',    
    5: 'Troca Solicitada',
    6: 'Troca Aceita',
    7: 'Troca Autorizada',
    8: 'Troca Efetuada',
    9: 'Troca Rejeitada',
    10: 'Cancelamento Aceito',
    11: 'Cancelamento Efetuado',
    12: 'Cancelamento Solicitado',
    13: 'Cancelamento Rejeitado'    
};

export class Pedido {
    id?: number;
    valorTotal?: number;
    valorFrete?: number;
    status?: StatusPedido;
    cliente?: Cliente;
    dataPedido?: Date;
    listaCompras?: Array<Produto>;
    cartaoPagamento: Cartao;
    cupom: any;
    cupomDesconto: 0;
    enderecoEntrega: Endereco;
    enderecos: Endereco[];
    infoCupom: string;
    listaFrete: [];
    numeroPedido: number;
    valorCompras: number;
}