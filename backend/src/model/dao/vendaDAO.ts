import PgDatabase from "../../db.config";
import Cupom from "../entidade/cupom.model";
import CupomCliente from "../entidade/cupomCliente.model";
import EntidadeDominio from "../entidade/entidadeDominio.model";
import Estoque from "../entidade/estoque.model";
import Pedido from "../entidade/pedido.model";
import Venda from "../entidade/venda.model";
import CupomClienteDAO from "./cupomClienteDAO";
import EstoqueDAO from "./estoqueDAO";
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

                // Dar baixa no estoque
                let prodQuery = `SELECT * FROM "pedidosProdutos" WHERE "pedidoId" = '${entidade.pedidoId}';`;
                let pedidoProdutos = (await PgDatabase.query(prodQuery)).rows;

                for(const p of pedidoProdutos ?? []) {
                    // Dar baixa no estoque;
                    let estoqueDAO = new EstoqueDAO();
                    let consultarEstoque = await (await estoqueDAO.consultar(new Estoque(null!, p.produtoId))) as Estoque[];

                    let quantidadeBaixada = consultarEstoque[0].quantidade! - p.quantidade;
                    await estoqueDAO.alterar({produtoId: p.id, quantidade: quantidadeBaixada} as Estoque);

                    // Se a quantidade for <= 0 inativa o produto
                    if(quantidadeBaixada <= 0) {
                        estoqueDAO.inativarProduto({
                            produtoId: p.id,
                            inativado: true,
                            motivoInativo: 'FORA DE MERCADO'
                        });
                    }
                }

               if(Math.sign(pedido.valorTotal!) == -1) {
                   // gerar Cupom
                   let valorCupom = Math.abs(pedido.valorTotal!);
                   let cupomDAO = new CupomClienteDAO();

                   let dados = {
                    "clienteId": pedido.clienteId!,
                    "cupom": {
                        "tipoCupom": "EXCEDENTE",
                        "valorDesconto": valorCupom,
                        "codigo": `VINOEX-${pedido.codigo}${pedido.clienteId}`
                    }
                   };

                   let cupom = Object.assign(new CupomCliente(), dados);
                   await cupomDAO.salvar(Object.assign(new CupomCliente(), cupom));
               }
            } else {
                return {error: 'Pagamento não aprovado!'} as EntidadeDominio;
            }

        } catch (e: any) {
            return {error: 'VendaDAO.salvar(): ' + e.toString()} as EntidadeDominio;
        }

        return entidade;
    }
    
    async alterar(entidade: Venda): Promise<EntidadeDominio> {
        if(!entidade.pedidoId) return {error: 'Sem o id do pedido'} as EntidadeDominio;
        try {
            if(await this.consultarPedidoExistente(entidade.pedidoId)) return {error: 'Pedido já consta como vendido!'} as EntidadeDominio;

            let pedidoDAO = new PedidoDAO();
            let pedido = (await pedidoDAO.consultar(new Pedido(entidade.pedidoId)))[0] as Pedido;

            
            if(!pedido) return {error: 'Pedido inválido!'} as EntidadeDominio;

            let query = `UPDATE pagamentos SET status = -1 WHERE id = '${pedido.pagamentoId}';`;

            let resultPagamento = await PgDatabase.query(query);

            let queryAtualizaStatusPedido = `UPDATE pedidos SET status = -1 WHERE id = ${pedido.id}`;

            let resultPedido = await PgDatabase.query(queryAtualizaStatusPedido);
        } catch (e: any) {
            return {error: 'VendaDAO.salvar(): ' + e.toString()} as EntidadeDominio;
        }

        return entidade;
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