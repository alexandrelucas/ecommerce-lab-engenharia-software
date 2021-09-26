import ClienteDAO from "../../dao/clienteDao";
import Cliente from "../../entidade/cliente.model";
import IStrategy from "../IStrategy";

export default class ValidarExistenciaCliente implements IStrategy {
    
    async processar(entidade: Cliente, altera: boolean): Promise<string> {
        if(entidade.hasId() && altera) {
            return null!;
        }
            
        let dao = new ClienteDAO();
        let entidades = await dao.consultar(entidade);
        return entidades.length > 0 ? 'Usuário já cadastrado!' : null! ;
    }

}