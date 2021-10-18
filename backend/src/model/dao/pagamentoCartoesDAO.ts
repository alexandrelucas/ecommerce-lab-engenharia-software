import PgDatabase from "../../db.config";
import EntidadeDominio from "../entidade/entidadeDominio.model";
import entidadeDominioModel from "../entidade/entidadeDominio.model";
import IDAO from "./IDAO";

export default class PagamentoCartoesDAO implements IDAO {
    tabela:string = 'pagamentoCartoes';
    salvar(entidade: entidadeDominioModel): Promise<entidadeDominioModel> {
        throw new Error("Method not implemented.");
    }
    alterar(entidade: entidadeDominioModel): Promise<entidadeDominioModel> {
        throw new Error("Method not implemented.");
    }
    excluir(entidade: entidadeDominioModel): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    async consultar(entidade: entidadeDominioModel): Promise<entidadeDominioModel[]> {
        let query = `SELECT c."nomeTitular", c.numero, pc.valor as "valorGasto" 
        FROM "cartoesCredito" as c 
        INNER JOIN "pagamentosCartoes" as pc 
        ON c.id = pc."cartaoId" WHERE pc."pagamentoId" = ${entidade.id ?? 0};`;

        let cartoesUsadosNoPedido = PgDatabase.query(query);
        let result:Array<EntidadeDominio> = (await cartoesUsadosNoPedido).rows;
        return result ?? [];
    }

}