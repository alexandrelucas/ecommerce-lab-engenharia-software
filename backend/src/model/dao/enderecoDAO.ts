import PgDatabase from "../../db.config";
import Endereco from "../entidade/endereco.model";
import EntidadeDominio from "../entidade/entidadeDominio.model";
import entidadeDominioModel from "../entidade/entidadeDominio.model";
import IDAO from "./IDAO";

export default class EnderecoDAO implements IDAO {
    tabela: string = 'enderecos';
    async salvar(entidade: entidadeDominioModel): Promise<entidadeDominioModel> {
        if(entidade.hasId()) return null!;
        try {
            
            delete entidade.id;
            let colunas = Object.keys(entidade).map((e) => `"${e}"`).reduce((prev, cur) => `${prev} , ${cur}`);
            let valores = Object.values(entidade).map((v) => `'${v}'`).reduce((prev, cur) => `${prev} , ${cur}`);
            
            let query = `INSERT INTO ${this.tabela} (${colunas}) VALUES (${valores}) RETURNING id`;

            console.log(query);

            let id = await PgDatabase.query(query);
            entidade.id = id.rows[0].id;
            return entidade;
            
        } catch (err: any) {
            return {error: 'EnderecoDAO.salvar(): ' + err.toString()} as EntidadeDominio;
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
            return {error: 'EnderecoDAO.alterar(): ' + err.toString()} as EntidadeDominio;
        }
    }
    async excluir(entidade: entidadeDominioModel): Promise<boolean> {
        if(entidade.hasId()) {
            let endereco = await PgDatabase.query(`DELETE FROM ${this.tabela} WHERE id = ${entidade.id}`);
            if(endereco.rowCount == 1) {
                return true;
            }
        }
        return false;
    }
    async consultar(entidade: entidadeDominioModel): Promise<entidadeDominioModel[]> {
        let clienteId = (entidade as Endereco).clienteId;
        
        let query;
        if(!clienteId){
            query = entidade.hasId() ? `SELECT * FROM ${this.tabela} WHERE id=${entidade.id}` : 'SELECT * FROM ${this.tabela}'; 
        }else{
            query = `SELECT * FROM ${this.tabela} WHERE "clienteId"=${clienteId}`;
        }
        let enderecos = PgDatabase.query(query);
        let result:Array<EntidadeDominio> = (await enderecos).rows;
        return result ?? [];
    }
}