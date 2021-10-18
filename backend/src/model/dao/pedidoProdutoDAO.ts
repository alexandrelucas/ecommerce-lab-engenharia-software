import PgDatabase from "../../db.config";
import EntidadeDominio from "../entidade/entidadeDominio.model";
import entidadeDominioModel from "../entidade/entidadeDominio.model";
import PedidoProduto from "../entidade/pedidoProduto.model";
import IDAO from "./IDAO";

export default class PedidoProdutoDAO implements IDAO {
    tabela: string = 'pedidoProdutos';
    salvar(entidade: entidadeDominioModel): Promise<entidadeDominioModel> {
        throw new Error("Method not implemented.");
    }
    async alterar(entidade: PedidoProduto): Promise<entidadeDominioModel> {
        if(!entidade.pedidoId || !entidade.produtoId || !entidade.status) return {error: 'id do produto, status ou id do pedido inválidos'} as EntidadeDominio;

        try {
            let query = `UPDATE "pedidosProdutos" SET status = ${entidade.status} WHERE "pedidoId" = '${entidade.pedidoId}' AND "produtoId" = '${entidade.produtoId}';`;

            let resultPedido = await PgDatabase.query(query);

            // Status pedido alterado
            if(resultPedido.rowCount > 0){
                return entidade;
            } else {
                return {error: 'Status do produto no pedido não alterado!'} as EntidadeDominio;
            }

        } catch (e: any) {
            return {error: 'pedidoProdutoDAO.salvar(): ' + e.toString()} as EntidadeDominio;
        }

    }
    excluir(entidade: entidadeDominioModel): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    async consultar(entidade: entidadeDominioModel): Promise<entidadeDominioModel[]> {
        let query = `SELECT p."clienteId", p."valorTotal", pp."pedidoId", p.codigo, produtos.titulo , pp."produtoId", p.data, pp.status FROM "pedidosProdutos" as pp
        INNER JOIN pedidos as p ON p.id = pp."pedidoId"
        INNER JOIN produtos ON pp."produtoId" = produtos.id WHERE pp.status >= 5 AND pp.status <= 9 ORDER BY pp."pedidoId" DESC`;

        let trocaSolicitada = PgDatabase.query(query);
        let result:Array<EntidadeDominio> = (await trocaSolicitada).rows;
        return result ?? [];
    }

}