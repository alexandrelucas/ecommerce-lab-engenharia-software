import PgDatabase from "../../db.config";
import Cartao from "../entidade/cartao.model";
import EntidadeDominio from "../entidade/entidadeDominio.model";
import entidadeDominioModel from "../entidade/entidadeDominio.model";
import IDAO from "./IDAO";

export default class CartaoDAO implements IDAO {
    async salvar(entidade: entidadeDominioModel): Promise<entidadeDominioModel> {
        if(entidade.hasId()) return null!;
        try {            
            delete entidade.id;
            let colunas = Object.keys(entidade).map((e) => `"${e}"`).reduce((prev, cur) => `${prev} , ${cur}`);
            let valores = Object.values(entidade).map((v) => `'${v}'`).reduce((prev, cur) => `${prev} , ${cur}`);
            
            let query = `INSERT INTO cartoes (${colunas}) VALUES (${valores}) RETURNING id`;
            let id = await PgDatabase.query(query);
            entidade.id = id.rows[0].id;
            return entidade;
            
        } catch (err: any) {
            return {error: 'CartaoDAO.salvar(): ' + err.toString()} as EntidadeDominio;
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
            let query = PgDatabase.query(`UPDATE cartoes SET ${dadosSQL} WHERE id = ${entidade.id}`);
            return entidade;
            
        } catch (err: any) {
            return {error: 'CartaoDAO.alterar(): ' + err.toString()} as EntidadeDominio;
        }
    }
    async excluir(entidade: entidadeDominioModel): Promise<boolean> {
        if(entidade.hasId()) {
            let endereco = await PgDatabase.query(`DELETE FROM cartoes WHERE id = ${entidade.id}`);
            if(endereco.rowCount == 1) {
                return true;
            }
        }
        return false;
    }
    async consultar(entidade: entidadeDominioModel): Promise<entidadeDominioModel[]> {
        let clienteId = (entidade as Cartao).clienteId;
        
        let query;
        if(!clienteId){
            query = entidade.hasId() ? `SELECT * FROM cartoes WHERE id=${entidade.id}` : 'SELECT * FROM cartoes'; 
        }else{
            query = `SELECT * FROM cartoes WHERE "clienteId"=${clienteId}`;
        }

        let cartoes = PgDatabase.query(query);
        let result:Array<EntidadeDominio> = (await cartoes).rows;
        return result ?? [];
    }

}