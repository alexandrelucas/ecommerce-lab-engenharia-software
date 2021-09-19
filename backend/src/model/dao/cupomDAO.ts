import entidadeDominioModel from "../entidade/entidadeDominio.model";
import IDAO from "./IDAO";
import PgDatabase from '../../db.config';

export default class CupomDAO implements IDAO {
    async salvar(entidade: entidadeDominioModel): Promise<entidadeDominioModel> {
        throw new Error("Method not implemented.");
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