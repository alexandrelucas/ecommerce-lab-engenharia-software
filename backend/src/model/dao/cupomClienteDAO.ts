import PgDatabase from "../../db.config";
import Cupom from "../entidade/cupom.model";
import CupomCliente from "../entidade/cupomCliente.model";
import EntidadeDominio from "../entidade/entidadeDominio.model";
import CupomDAO from "./cupomDAO";
import IDAO from "./IDAO";

export default class CupomClienteDAO implements IDAO {
    tabela: string = 'cuponsCliente';
    async salvar(entidade: CupomCliente): Promise<any> {
        // if(entidade.hasId()) return {error: 'Você quer alterar?'} as EntidadeDominio;;
        if(!entidade.cupom) return {error: 'Cupom obrigatório'} as EntidadeDominio;;
        if(!entidade.clienteId) return {error: 'clienteId obrigatório!'} as EntidadeDominio;;
        try {            
            delete entidade.id;
            delete entidade.cupomId;
    
            let expireDate = new Date(new Date().getTime() + 30*24*60*60*1000);
            entidade.cupom.validade = expireDate;

           let cupomDAO = new CupomDAO();
           let gerarCupom = await cupomDAO.salvar(entidade.cupom!);

           entidade.cupomId = gerarCupom.id;


           let query = `INSERT INTO "cuponsCliente"("cupomId", "clienteId", usado)
            VALUES ('${entidade.cupomId}', '${entidade.clienteId}', 'false') RETURNING id;`;

            let cupomTrocaGerado = await PgDatabase.query(query);

            if(cupomTrocaGerado.rowCount > 0) {
                entidade.id = cupomTrocaGerado.rows[0].id;
                return entidade;
            } else {
                return {error: 'Erro ao gerar cupom de troca'} as EntidadeDominio;
            }

            
        } catch (err: any) {
            return {error: 'CupomClienteDAO.salvar(): ' + err.toString()} as EntidadeDominio;
        }
    }
    alterar(entidade: EntidadeDominio): Promise<EntidadeDominio> {
        throw new Error("Method not implemented.");
    }
    excluir(entidade: EntidadeDominio): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    consultar(entidade: EntidadeDominio): Promise<EntidadeDominio[]> {
        throw new Error("Method not implemented.");
    }

}