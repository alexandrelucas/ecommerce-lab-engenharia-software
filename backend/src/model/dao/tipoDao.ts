import PgDatabase from "../../db.config";
import EntidadeDominio from "../entidade/entidadeDominio.model";
import TipoEndereco from "../entidade/tipoEndereco";
import TipoLogradouro from "../entidade/tipoLogradouro";
import TipoResidencia from "../entidade/tipoResidencia";
import IDAO from "./IDAO";

export default class TipoDAO implements IDAO {
    tabela: string = '';
    
    async salvar(entidade: EntidadeDominio): Promise<EntidadeDominio> {
        return new EntidadeDominio();
    }

    async alterar(entidade: EntidadeDominio): Promise<EntidadeDominio> {
        return new EntidadeDominio();
    }
    
    async excluir(entidade: EntidadeDominio): Promise<boolean> {
        return false;
    }
    
    async consultar(entidade: EntidadeDominio): Promise<EntidadeDominio[]> {
        let query;

        if(entidade instanceof TipoEndereco) {
            query = 'SELECT * FROM "tipoEndereco"';
        } else if (entidade instanceof TipoLogradouro) {
            query = 'SELECT * FROM "tipoLogradouro"';
        } else if (entidade instanceof TipoResidencia) {
            query = 'SELECT * FROM "tipoResidencia"';
        } else {
            query = 'SELECT * FROM "tipoTelefone"';
        }

        let tipos = await PgDatabase.query(query);
        let result:Array<EntidadeDominio> = tipos.rows;
        return result ?? [];

    }

}