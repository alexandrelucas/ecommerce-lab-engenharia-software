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
        throw new Error("Method not implemented.");
    }

}