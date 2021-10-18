import PgDatabase from "../../db.config";
import EntidadeDominio from "../entidade/entidadeDominio.model";
import Pedido from "../entidade/pedido.model";
import Venda from "../entidade/venda.model";
import IDAO from "./IDAO";
import PedidoDAO from "./pedidoDAO";

export default class VendaDAO implements IDAO {
    tabela: string = 'vendas';
    async salvar(entidade: Venda): Promise<EntidadeDominio> {

        if(!entidade.pedidoId) return {error: 'Sem o id do pedido'} as EntidadeDominio;
        try {

            if(await this.consultarPedidoExistente(entidade.pedidoId)) return {error: 'Pedido já consta como vendido!'} as EntidadeDominio;

            let pedidoDAO = new PedidoDAO();
            let pedido = (await pedidoDAO.consultar(new Pedido(entidade.pedidoId)))[0] as Pedido;
            
            console.log(pedido.pagamentoId);

            if(!pedido) return {error: 'Pedido inválido!'} as EntidadeDominio;

            let query = `UPDATE pagamentos SET status=1 WHERE id = '${pedido.pagamentoId}';`;

            let resultPagamento = await PgDatabase.query(query);

            let queryAtualizaStatusPedido = `UPDATE pedidos SET status = 1 WHERE id = ${pedido.id}`;

            let resultPedido = await PgDatabase.query(queryAtualizaStatusPedido);

            // Pagamento aprovado! Registrar venda
            if(resultPagamento.rowCount > 0 && resultPedido.rowCount > 0){
                query = `INSERT INTO vendas("pedidoId", valor) VALUES ('${pedido.id}', '${pedido.valorTotal}') RETURNING id;`;

                let result = await PgDatabase.query(query);

                if(result.rowCount > 0) {
                    entidade.id = result.rows[0].id;
                } 
            } else {
                return {error: 'Pagamento não aprovado!'} as EntidadeDominio;
            }

        } catch (e: any) {
            return {error: 'VendaDAO.salvar(): ' + e.toString()} as EntidadeDominio;
        }

        return entidade;
    }
    
    async alterar(entidade: EntidadeDominio): Promise<EntidadeDominio> {
        throw new Error("Method not implemented.");
    }
    async excluir(entidade: EntidadeDominio): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    async consultar(entidade: EntidadeDominio): Promise<EntidadeDominio[]> {
        try {
            
            let vendas = await PgDatabase.query(`SELECT v.id, v."pedidoId", p."codigo", p."valorTotal", c.nome as "clienteNome", c.cpf, pag."dataPagamento" FROM vendas as v
            INNER JOIN pedidos as p ON p.id = v."pedidoId"
            INNER JOIN clientes as c ON c.id = p."clienteId"
            INNER JOIN pagamentos as pag ON pag.id = p."pagamentoId" ORDER BY pag."dataPagamento" DESC;`);              
            let result:Array<EntidadeDominio> = vendas.rows;
            return result ?? [];    
        } catch(err: any) {
            return [];
        }
    }

    async consultarPedidoExistente(pedidoId: number) : Promise<boolean> {
        try {
            let query = `SELECT id FROM vendas WHERE "pedidoId" = '${pedidoId}';`;
            let result = (await PgDatabase.query(query)).rowCount;

            if(result > 0) return true;
        } catch (e: any) {
            return false;
        }

        return false;
    }

}