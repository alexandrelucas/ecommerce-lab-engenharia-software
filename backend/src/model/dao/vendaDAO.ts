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
            console.log(entidade);
            let pedidoDAO = new PedidoDAO();
            let pedido = (await pedidoDAO.consultar(new Pedido(entidade.pedidoId)))[0] as Pedido;


            if(!pedido) return {error: 'Pedido inválido!'} as EntidadeDominio;

            let query = `UPDATE pagamentos SET status=1 WHERE id = '${pedido.pagamentoId}';`;

            let result = await PgDatabase.query(query);

            // Pagamento aprovado! Registrar venda
            if(result.rowCount > 0){
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
            
            let vendas = await PgDatabase.query('SELECT * FROM vendas;');              
            console.log(vendas);
            let result:Array<EntidadeDominio> = vendas.rows;
            return result ?? [];    
        } catch(err: any) {
            return [];
        }
    }

}