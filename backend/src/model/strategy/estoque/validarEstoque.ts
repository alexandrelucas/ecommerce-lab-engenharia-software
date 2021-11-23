import Endereco from "../../entidade/endereco.model";
import entidadeDominioModel from "../../entidade/entidadeDominio.model";
import IStrategy from "../IStrategy";

export default class ValidarEstoque implements IStrategy {
    async processar(entidade: entidadeDominioModel): Promise<string> {
        if(entidade.constructor.name == 'Estoque') {
            
        } else {
            return 'Dados de Estoque incorretos';
        }
        return null!;
    }

}