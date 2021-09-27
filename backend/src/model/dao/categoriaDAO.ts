import PgDatabase from "../../db.config";
import Categoria from "../entidade/categoria.model";
import EntidadeDominio from "../entidade/entidadeDominio.model";
import IDAO from "./IDAO";

export default class CategoriaDAO implements IDAO {
    tabela: string = 'categorias';

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
            return {error: 'CategoriaDAO.salvar(): ' + err.toString()} as EntidadeDominio;
        }
    }
    async alterar(entidade: EntidadeDominio): Promise<EntidadeDominio> {
        if(!entidade.hasId()) return null!;        

        let dadosSQL = Object.entries(entidade).map((key, value) => {
            return `"${key[0]}" = '${key[1]}'`;
        }).reduce((pVal, cVal) => {
            return `${pVal} , ${cVal}`;
        });

        try {
            let query = PgDatabase.query(`UPDATE ${this.tabela} SET ${dadosSQL} WHERE id = ${entidade.id}`);
            return entidade;
            
        } catch (err: any) {
            return {error: 'CategoriaDAO.alterar(): ' + err.toString()} as EntidadeDominio;
        }
    }
    async excluir(entidade: EntidadeDominio): Promise<boolean> {
        if(entidade.hasId()) {
            let categoria = await PgDatabase.query(`DELETE FROM ${this.tabela} WHERE id = ${entidade.id}`);
            if(categoria.rowCount == 1) {
                return true;
            }
        }
        return false;
    }
    async consultar(entidade: EntidadeDominio): Promise<EntidadeDominio[]> {
        let query = entidade.hasId() ? 
        `SELECT * FROM ${this.tabela} WHERE id=${entidade.id}` 
        : `SELECT * FROM ${this.tabela}`; 
       

        let cartoes = PgDatabase.query(query);
        let result:Array<EntidadeDominio> = (await cartoes).rows;
        return result ?? [];
    }

}