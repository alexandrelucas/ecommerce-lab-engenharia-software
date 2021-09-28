import PgDatabase from "../../db.config";
import EntidadeDominio from "../entidade/entidadeDominio.model";
import entidadeDominioModel from "../entidade/entidadeDominio.model";
import Pagamento from "../entidade/pagamento.model";
import IDAO from "./IDAO";

export default class PagamentoDAO implements IDAO {
    tabela:string = 'pagamentos';

    
    async salvar(entidade: EntidadeDominio): Promise<entidadeDominioModel> {
        //if(entidade.hasId()) return null!;
        
        try {
            let pagamento = entidade as Pagamento;

            pagamento.dataPagamento = new Date();
            pagamento.status = 0; // Status esperando autorização da operadora
    
            let query = `INSERT INTO ${this.tabela} ("dataPagamento", "status") VALUES ('${pagamento.dataPagamento.toUTCString()}','${pagamento.status}') RETURNING id`;
            let consulta = await PgDatabase.query(query);
            entidade.id = consulta.rows[0].id;

            if(entidade.id) {
                if(!pagamento.cartoes) return {error: 'Nenhum cartão adicionado!'} as EntidadeDominio;
                for(const c of pagamento.cartoes ?? []) {
                    let query = `INSERT INTO "pagamentosCartoes" ("pagamentoId", "cartaoId", "valor") VALUES ('${entidade.id}', '${c.cartaoId}', '${c.valor}')`;
                    let consulta = await PgDatabase.query(query);
                }

                return entidade;
            } else {
                return {error: 'Não foi cadastrado!'} as EntidadeDominio;
            }
        } catch (e: any) {
            return {error: 'PagamentoDAO.salvar(): ' + e.toString()} as EntidadeDominio;
        } 
        // try {            
        //     let query = `INSERT INTO ${this.tabela} (${colunas}) VALUES (${valores}) RETURNING id`;
        //     let id = await PgDatabase.query(query);
        //     entidade.id = id.rows[0].id;
        //     return entidade;
            
        // } catch (err: any) {
        //     return {error: 'PagamentoDAO.salvar(): ' + err.toString()} as EntidadeDominio;
        // }
    }
    
    async alterar(entidade: entidadeDominioModel): Promise<entidadeDominioModel> {
        throw new Error("Method not implemented.");
    }
    
    async excluir(entidade: entidadeDominioModel): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    
    async consultar(entidade: entidadeDominioModel): Promise<entidadeDominioModel[]> {
        throw new Error("Method not implemented.");
    }

}