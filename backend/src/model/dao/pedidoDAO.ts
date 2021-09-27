import PgDatabase from "../../db.config";
import EntidadeDominio from "../entidade/entidadeDominio.model";
import IDAO from "./IDAO";

export default class PedidoDAO implements IDAO {
    tabela: string = 'pedidos';

    async salvar(entidade: EntidadeDominio): Promise<EntidadeDominio> {
        throw new Error("Method not implemented.");
    }
    async alterar(entidade: EntidadeDominio): Promise<EntidadeDominio> {
        throw new Error("Method not implemented.");
    }
    async excluir(entidade: EntidadeDominio): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    async consultar(entidade: EntidadeDominio): Promise<EntidadeDominio[]> {
        throw new Error("Method not implemented.");
    }

}