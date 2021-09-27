import PgDatabase from "../../db.config";
import EntidadeDominio from "../entidade/entidadeDominio.model";
import entidadeDominioModel from "../entidade/entidadeDominio.model";
import Pais from "../entidade/pais.model";
import IDAO from "./IDAO";

export default class PaisDAO implements IDAO {
    tabela: string = 'pais';
    
    async salvar(entidade: entidadeDominioModel): Promise<entidadeDominioModel> {
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
            return {error: 'PaisDAO.salvar(): ' + err.toString()} as EntidadeDominio;
        }
    }
    
    async alterar(entidade: entidadeDominioModel): Promise<entidadeDominioModel> {
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
            return {error: 'PaisDAO.alterar(): ' + err.toString()} as EntidadeDominio;
        }
    }
    async excluir(entidade: entidadeDominioModel): Promise<boolean> {
        if(entidade.hasId()) {
            let pais = await PgDatabase.query(`DELETE FROM ${this.tabela} WHERE id = ${entidade.id}`);
            if(pais.rowCount == 1) {
                return true;
            }
        }
        return false;
    }
    async consultar(entidade: entidadeDominioModel): Promise<entidadeDominioModel[]> {
        
        let query;
        let sigla = (entidade as Pais).sigla;
        
        if((entidade as Pais).sigla) {
            query = `SELECT * FROM ${this.tabela} WHERE sigla='${sigla}'`;
        } else {
            query = `SELECT * FROM ${this.tabela}`;
        }


        let paises = await PgDatabase.query(query);
        let result:Array<EntidadeDominio> = paises.rows;
        return result ?? [];
    }

}