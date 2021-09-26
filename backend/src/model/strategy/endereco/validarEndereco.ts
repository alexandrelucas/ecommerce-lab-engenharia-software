import Endereco from "../../entidade/endereco.model";
import entidadeDominioModel from "../../entidade/entidadeDominio.model";
import IStrategy from "../IStrategy";

export default class ValidarEndereco implements IStrategy {
    async processar(entidade: entidadeDominioModel): Promise<string> {
        if(entidade.constructor.name == 'Endereco') {
            let endereco = entidade as Endereco;

            if(!endereco.bairro || endereco.bairro == '') return 'Bairro obrigatório';
            if(!endereco.cep || endereco.cep == '') return 'CEP obrigatório';
            if(!endereco.logradouro || endereco.logradouro == '') return 'Logradouro obrigatório';
            if(!endereco.numero || endereco.numero == '') return 'Número obrigatório';
            if(!endereco.cidade || endereco.cidade == '') return 'Cidade obrigatória';
            if(!endereco.descricaoEndereco || endereco.descricaoEndereco == '') return 'Descrição obrigatória';
            if(!endereco.pais || endereco.pais == '') return 'País obrigatório';
            // if(!endereco.tipoEndereco ) return 'Tipo Endereço obrigatório';
            // if(!endereco.tipoLogradouro) return 'Tipo Logradouro obrigatório';
            // if(!endereco.tipoResidencia) return 'Tipo Residência obrigatório';
            if(!endereco.uf || endereco.uf == '') return 'Sigla UF obrigatória';
        } else {
            return 'Dados de Endereço incorretos';
        }
        return null!;
    }

}