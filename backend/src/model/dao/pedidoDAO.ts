import PgDatabase from "../../db.config";
import Endereco from "../entidade/endereco.model";
import EntidadeDominio from "../entidade/entidadeDominio.model";
import Estoque from "../entidade/estoque.model";
import Pedido from "../entidade/pedido.model";
import EnderecoDAO from "./enderecoDAO";
import EstoqueDAO from "./estoqueDAO";
import IDAO from "./IDAO";
import PagamentoCartoesDAO from "./pagamentoCartoesDAO";
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

        return entidade;
    }
    async alterar(entidade: Pedido): Promise<EntidadeDominio> {
        if(!entidade.id) return {error: 'Sem o id do pedido'} as EntidadeDominio;
        try {

            if(entidade.status == 0 || entidade.status == 1) {
                return {error: `status ${entidade.status} somente para autorização de venda.`} as EntidadeDominio;
            }

            let queryAtualizaStatusPedido = `UPDATE pedidos SET status = ${entidade.status} WHERE id = ${entidade.id}`;


            if(entidade.status == 4) {
                let query = `UPDATE "pedidosProdutos" SET status = ${entidade.status} WHERE "pedidoId" = '${entidade.id}' ;`;
            }
 
            let resultPedido = await PgDatabase.query(queryAtualizaStatusPedido);

            // Status pedido alterado
            if(resultPedido.rowCount > 0){
                return entidade;
            } else {
                return {error: 'Status do pedido não alterado!'} as EntidadeDominio;
            }

        } catch (e: any) {
            return {error: 'VendaDAO.salvar(): ' + e.toString()} as EntidadeDominio;
        }
    }
    async excluir(entidade: EntidadeDominio): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    async consultar(entidade: Pedido): Promise<EntidadeDominio[]> {
        let pedidoId = entidade.id;
        let clienteId = entidade.clienteId;
        
        let query;
        if(pedidoId) {
            query = `SELECT p.id, p.codigo, p.status, p."valorFrete", p.transportadora, p."enderecoId", p."pagamentoId", pagamentos.status as "statusPagamento", p."valorSubTotal", p."valorTotal", p."cupomId", p.data FROM 
            pedidos as p INNER JOIN pagamentos ON pagamentos.id = p."pagamentoId" WHERE p."id" = '${pedidoId}';`;
        } else if (clienteId) {
            query = `SELECT p.id, p.codigo, p.status, p."valorFrete", p.transportadora, p."enderecoId", p."pagamentoId", pagamentos.status as "statusPagamento", p."valorSubTotal", p."valorTotal", p."cupomId", p.data FROM 
            pedidos as p INNER JOIN pagamentos ON pagamentos.id = p."pagamentoId" WHERE p."clienteId" = '${clienteId}' ORDER BY id DESC;`;
        }
        else{
            // query = `SELECT * FROM ${this.tabela}`;
            query = `SELECT p.id, p.codigo, p.status, p."valorFrete", p.transportadora, p."enderecoId", p."pagamentoId", pagamentos.status as "statusPagamento" , p."valorSubTotal", p."valorTotal", p."cupomId", p.data FROM 
            pedidos as p INNER JOIN pagamentos ON pagamentos.id = p."pagamentoId";`;
        }

        let pedidos = await PgDatabase.query(query);


        if(pedidos.rowCount > 0) {
            for(const p of pedidos.rows) {
               let produtoQuery = `SELECT p.id, p.codigo, pp.status, pp.quantidade, pp.valor, p.titulo, p.descricao, p.imagem, p."quantidadeML", p."tempoGuarda", p."teorAlcoolico", p.tipo, p.peso, c.descricao as "categoria", pais.sigla as "paisSigla", pais.descricao as "pais" 
            FROM produtos as p 
            INNER JOIN "pedidosProdutos" as pp 
            ON p.id = pp."produtoId" INNER JOIN categorias as c ON c.id = p."categoriaId"
            INNER JOIN pais ON pais.id = p."paisId" WHERE pp."pedidoId" = ${p.id};`;

            let produtos = await PgDatabase.query(produtoQuery);
            let endereco = await new EnderecoDAO().consultar(new Endereco(p.enderecoId));
            let cartoes = await new PagamentoCartoesDAO().consultar({id: p.pagamentoId} as EntidadeDominio);

            p.produtos = produtos.rows;
            p.enderecoEntrega = endereco[0];
            p.cartoesUsados = cartoes;
            }
        }

        let result:Array<EntidadeDominio> = pedidos.rows;

        return result ?? [];
    }

}