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
            query = `SELECT * FROM ${this.tabela} as e INNER JOIN "produtos" as p ON p.id = '${produtoId}'`;
        } else{
            query = `SELECT * FROM ${this.tabela}`;
        }

        let cupons = PgDatabase.query(query);
        let result:Array<EntidadeDominio> = (await cupons).rows;
        return result ?? [];
    }

}