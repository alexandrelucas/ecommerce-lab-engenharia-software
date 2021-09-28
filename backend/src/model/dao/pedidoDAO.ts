import PgDatabase from "../../db.config";
import EntidadeDominio from "../entidade/entidadeDominio.model";
import Estoque from "../entidade/estoque.model";
import Pedido from "../entidade/pedido.model";
import EstoqueDAO from "./estoqueDAO";
import IDAO from "./IDAO";
import PagamentoDAO from "./pagamentoDAO";

export default class PedidoDAO implements IDAO {
    tabela: string = 'pedidos';

    async salvar(entidade: any): Promise<EntidadeDominio> {
        
        // Primeira etapa é registrar o pagamento e os cartões
        let pagamentoDAO = new PagamentoDAO();
        let pagamento = await pagamentoDAO.salvar({cartoes: entidade.pagamento} as any);
        let pedidoId: number = null!;
        
        // Cadastrar pedido
        if(pagamento.id) {
                entidade.codigo = Math.floor(100000 + Math.random() * 900000);
                entidade.status = 0;

            try {
                let query = `INSERT INTO pedidos (codigo, status, "valorFrete", transportadora, "valorSubTotal", "valorTotal", 
                ${entidade.cupomId ? "cupomId," : ''} "pagamentoId", data, "enderecoId", "clienteId") 
                VALUES ('${entidade.codigo}', '${entidade.status}', '${entidade.valorFrete}', '${entidade.transportadora}',
                '${entidade.valorSubTotal}',
                '${entidade.valorTotal}', ${entidade.cupomId ? entidade.cupomId : ''} '${pagamento.id}',
                '${new Date().toUTCString()}', '${entidade.enderecoId}', '${entidade.clienteId}') RETURNING id;`;
               
                let result = await PgDatabase.query(query);
                pedidoId = result.rows[0].id;

                // fix temporario para exibir o codigo do pedido na API
                entidade.id = Number.parseInt(entidade.codigo);

                //return entidade;
            } catch (e: any) {
                return {error: 'PedidoDAO.salvar(): ' + e.toString()} as EntidadeDominio;
            }
            

        } else {
            return {error: pagamento.error} as EntidadeDominio;
        }
        
        // Cadastrar os produtos do pedido

        if(pedidoId) {
            try {
                if(!entidade.produtos) return {error: 'Lista de produtos vazia'} as EntidadeDominio;

                for(const p of entidade.produtos ?? []) {
                    let query = `INSERT INTO public."pedidosProdutos"(
                        "pedidoId", "produtoId", valor, quantidade)
                        VALUES ('${pedidoId}', '${p.id}', '${p.valor}', '${p.quantidade}');`;
                    let consulta = await PgDatabase.query(query);

                    // Dar baixa no estoque;
                    let estoqueDAO = new EstoqueDAO();
                    let consultarEstoque = await (await estoqueDAO.consultar(new Estoque(null!, p.id))) as Estoque[];
                    let quantidadeBaixada = consultarEstoque[0].quantidade! - p.quantidade;
                    await estoqueDAO.alterar({produtoId: p.id, quantidade: quantidadeBaixada} as Estoque);
                }

            } catch (e: any) {
                return {error: 'PedidoDAO.salvar() -> cadastro de produtos do pedido: ' + e.toString()} as EntidadeDominio;
            }
        } else {
            return {error: 'Pedido inválido!'} as EntidadeDominio;
        }

        // Dar baixa no estoque


        return entidade;
    }
    async alterar(entidade: EntidadeDominio): Promise<EntidadeDominio> {
        throw new Error("Method not implemented.");
    }
    async excluir(entidade: EntidadeDominio): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    async consultar(entidade: Pedido): Promise<EntidadeDominio[]> {
        let pedidoId = entidade.id;
        let clienteId = entidade.clienteId;
        
        let query;
        if(pedidoId) {
            query = `SELECT p.id, p."pagamentoId", p.codigo, p.status, "valorFrete", 
            transportadora, "valorSubTotal", "valorTotal", 
            data, "produtoId", "valor", "quantidade", 
            pagamentos.status as "statusPagamento" FROM pedidos as p 
            INNER JOIN "pedidosProdutos" as pp ON p.id = pp."pedidoId"
            INNER JOIN pagamentos ON pagamentos.id = p."pagamentoId" WHERE p."id" = '${pedidoId}';`;
        } else if (clienteId) {
            query = `SELECT p.id, p.codigo, p.status, "valorFrete", 
            transportadora, "valorSubTotal", "valorTotal", 
            data, "produtoId", "valor", "quantidade", 
            pagamentos.status as "statusPagamento" FROM pedidos as p 
            INNER JOIN "pedidosProdutos" as pp ON p.id = pp."pedidoId"
            INNER JOIN pagamentos ON pagamentos.id = p."pagamentoId" WHERE p."clienteId" = '${clienteId}' ORDER BY id DESC;`;
        }
        else{
            // query = `SELECT * FROM ${this.tabela}`;
            query = `SELECT p.id, p.codigo, p.status, "valorFrete", 
            transportadora, "valorSubTotal", "valorTotal", 
            data, "produtoId", "valor", "quantidade", 
            pagamentos.status as "statusPagamento" FROM pedidos as p 
            INNER JOIN "pedidosProdutos" as pp ON p.id = pp."pedidoId"
            INNER JOIN pagamentos ON pagamentos.id = p."pagamentoId";`;
        }

        let pedidos = await PgDatabase.query(query);
        let result:Array<EntidadeDominio> = pedidos.rows;
        return result ?? [];
    }

}