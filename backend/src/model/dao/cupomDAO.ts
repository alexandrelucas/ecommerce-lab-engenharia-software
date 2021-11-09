import entidadeDominioModel from "../entidade/entidadeDominio.model";
import IDAO from "./IDAO";
import PgDatabase from '../../db.config';
import EntidadeDominio from "../entidade/entidadeDominio.model";
import Cupom from "../entidade/cupom.model";

export default class CupomDAO implements IDAO {
    tabela: string = 'cupons';

    async salvar(entidade: any): Promise<entidadeDominioModel> {
        // if(entidade.hasId()) return null!;
        try {            
            delete entidade.id;
            delete entidade.clienteId;
            entidade.validade = new Date(entidade.validade).toUTCString();
            let colunas = Object.keys(entidade).map((e) => `"${e}"`).reduce((prev, cur) => `${prev} , ${cur}`);
            let valores = Object.values(entidade).map((v) => `'${v}'`).reduce((prev, cur) => `${prev} , ${cur}`);
            
            let query = `INSERT INTO ${this.tabela} (${colunas}) VALUES (${valores}) RETURNING id`;
            let id = await PgDatabase.query(query);
            entidade.id = id.rows[0].id;
            return entidade;
            
        } catch (err: any) {
            return {error: 'CupomDAO.salvar(): ' + err.toString()} as EntidadeDominio;
        }
    }
    async alterar(entidade: Cupom): Promise<entidadeDominioModel> {
        if(!entidade.hasId()) return null!;        

        delete entidade.clienteId;
        let dadosSQL = Object.entries(entidade).map((key, value) => {
            return `"${key[0]}" = '${key[1]}'`;
        }).reduce((pVal, cVal) => {
            return `${pVal} , ${cVal}`;
        });

        try {
            let query = PgDatabase.query(`UPDATE ${this.tabela} SET ${dadosSQL} WHERE id = ${entidade.id}`);
            return entidade;
            
        } catch (err: any) {
            return {error: 'CupomDAO.alterar(): ' + err.toString()} as EntidadeDominio;
        }
    }
    async excluir(entidade: entidadeDominioModel): Promise<boolean> {
        if(entidade.hasId()) {
            let cupom = await PgDatabase.query(`DELETE FROM ${this.tabela} WHERE id = ${entidade.id}`);
            if(cupom.rowCount == 1) {
                return true;
            }
        }
        return false;
    }
    async consultar(entidade: entidadeDominioModel): Promise<entidadeDominioModel[]> {
        let cupomCodigo = (entidade as Cupom).codigo;
        let clienteId = (entidade as Cupom).clienteId;
        let query;

        // Checa se é um cupom do cliente
        if(cupomCodigo && clienteId) {
            query = 
            `SELECT * FROM cupons 
            INNER JOIN "cuponsCliente" ON "cuponsCliente"."cupomId" = cupons.id 
            WHERE cupons.codigo = '${cupomCodigo}' AND "clienteId"='${clienteId}' AND "cuponsCliente".usado = false AND cupons.validade >= DATE(NOW());`;
            let cupons = PgDatabase.query(query);
            let result:Array<EntidadeDominio> = (await cupons).rows;
            return result ?? [];
        } else {
            if(!cupomCodigo) {
                query = clienteId ? 
                `SELECT * FROM cupons INNER JOIN "cuponsCliente" ON "cuponsCliente"."cupomId" = cupons.id WHERE "clienteId" = '${clienteId}'` 
                : `SELECT * FROM ${this.tabela};`; 
                let cupons = PgDatabase.query(query);
                let result:Array<EntidadeDominio> = (await cupons).rows;
                return result ?? [];
            } else {
                query = `SELECT * FROM ${this.tabela} WHERE codigo = '${cupomCodigo}' AND validade >= DATE(NOW());`;
                let cupons = PgDatabase.query(query);
                let result:Array<EntidadeDominio> = (await cupons).rows;
                return result ?? [];
            }
        }
    }

}