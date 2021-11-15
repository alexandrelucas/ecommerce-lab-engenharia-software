import PgDatabase from "../../db.config";
import EntidadeDominio from "../entidade/entidadeDominio.model";
import Estoque from "../entidade/estoque.model";
import IDAO from "./IDAO";

export default class EstoqueDAO implements IDAO {
    tabela: string = 'estoque';

    async salvar(entidade: EntidadeDominio): Promise<EntidadeDominio> {
        if(entidade.hasId()) return null!;
        
        try {            
            delete entidade.id;
            let colunas = Object.keys(entidade).map((e) => `"${e}"`).reduce((prev, cur) => `${prev} , ${cur}`);
            let valores = Object.values(entidade).map((v) => `'${v}'`).reduce((prev, cur) => `${prev} , ${cur}`);
            
            let query = `INSERT INTO ${this.tabela} (${colunas}) VALUES (${valores}) RETURNING id`;
            let id = await PgDatabase.query(query);
            entidade.id = id.rows[0].id;
            return entidade;
            
        } catch (err: any) {
            return {error: 'EstoqueDAO.salvar(): ' + err.toString()} as EntidadeDominio;
        }
    }
    async alterar(entidade: Estoque): Promise<EntidadeDominio> {
        if(!entidade.produtoId) return null!;        

        try {
            let query = await PgDatabase.query(`UPDATE ${this.tabela} SET "quantidade" = ${entidade.quantidade ?? 0} WHERE "produtoId" = ${entidade.produtoId}`);
            
            if(query.rowCount) {
                return entidade;
            } else return {error: 'Não foi possível dar baixa no estoque!'} as EntidadeDominio;
            
        } catch (err: any) {
            return {error: 'EstoqueDAO.alterar(): ' + err.toString()} as EntidadeDominio;
        }
    }
    async excluir(entidade: EntidadeDominio): Promise<boolean> {
        if(entidade.hasId()) {
            let estoque = await PgDatabase.query(`DELETE FROM ${this.tabela} WHERE id = ${entidade.id}`);
            if(estoque.rowCount == 1) {
                return true;
            }
        }
        return false;
    }
    async consultar(entidade: EntidadeDominio): Promise<EntidadeDominio[]> {
        let produtoId = (entidade as Estoque).produtoId;
        
        let query;
        if(produtoId) {
            query = `SELECT * FROM ${this.tabela} as e INNER JOIN "produtos" as p ON p.id = e."produtoId" WHERE e."produtoId" = '${produtoId}'`;
        } else{
            // query = `SELECT * FROM ${this.tabela}`;
            query = `SELECT produtos.id, "codigo", "titulo",
            produtos."descricao","imagem", "precoDe",
            "precoPor", "quantidadeML", "tempoGuarda",
            "teorAlcoolico", "peso", "comprimento",
            "largura", "diametro", "formato", "paisId",
            "categoriaId", "tipo", quantidade,
            fornecedor, "valorCusto", "dataEntrada",
            pais."sigla" as "paisSigla",
            pais."descricao" as "pais",
            categorias."descricao" as "categoria"
            FROM estoque
            INNER JOIN produtos ON produtos.id = estoque."produtoId"
            INNER JOIN pais ON produtos."paisId" = pais.id
            INNER JOIN categorias ON produtos."categoriaId" = categorias.id WHERE estoque."quantidade" > 0 AND estoque."inativado" = FALSE ORDER BY "dataEntrada" DESC;`;
        }

        let estoque = PgDatabase.query(query);
        let result:Array<EntidadeDominio> = (await estoque).rows;
        return result ?? [];
    }

    async inativarProduto(entidade: any): Promise<EntidadeDominio> {
        if(!entidade.produtoId) return {error: 'ProdutoId nao informado'} as EntidadeDominio;
        if(!entidade.inativado) return {error: 'Inativar nao informado'} as EntidadeDominio;
        if(!entidade.motivoInativo) return {error: 'Motivo nao informado'} as EntidadeDominio;
        try {
            let query2 = 
            `UPDATE estoque SET inativado='${entidade.inativado}', 
            "motivoInativo"= '${entidade.motivoInativo}'
            WHERE "produtoId" = '${entidade.produtoId}';`;
            let query = await PgDatabase.query(query2);
            
            if(query.rowCount) {
                return entidade;
            } else return {error: 'Não foi possível inativar produto no estoque!'} as EntidadeDominio;
            
        } catch (err: any) {
            return {error: 'EstoqueDAO.inativarProduto(): ' + err.toString()} as EntidadeDominio;
        }
    }

}