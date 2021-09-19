import ClienteDAO from "../../dao/clienteDao";
import entidadeDominioModel from "../../entidade/entidadeDominio.model";
import IStrategy from "../IStrategy";

export default class ValidarExistenciaCliente implements IStrategy {
    
    processar(entidade: entidadeDominioModel): string {
        
        // Corrigir depois problema de async/await promise

        if(entidade.constructor.name == 'Cliente') {
            if(entidade.hasId()) {
                return 'Este usuário ja existe, deseja alterar?';
            }
            
            let dao = new ClienteDAO();
            //let entidades = await dao.consultar(entidade);
            //return entidades.length > 0 ? null! : 'Usuário já cadastrado!';
            return 'Deu pau';
        }

        return null!;
    }

}