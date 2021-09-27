import Cliente from "../../entidade/cliente.model";
import EntidadeDominio from "../../entidade/entidadeDominio.model";
import IStrategy from "../IStrategy";

export default class ValidarDadosObrigatorios implements IStrategy {
    async processar(entidade: EntidadeDominio, altera: boolean): Promise<string> {
        
        if(entidade.constructor.name == 'Cliente') {
            let cliente = entidade as Cliente;
            
            if(!cliente.cpf || cliente.cpf =='') return 'CPF Obrigatório';
            if(!cliente.nome || cliente.nome =='') return 'Nome Obrigatório';
            if(!cliente.dataNasc) return 'Data de Nascimento Obrigatório';
            if(!cliente.email || cliente.email =='') return 'Email Obrigatório';
            if((!cliente.senha || cliente.senha =='') && !altera) return 'Senha Obrigatória';
            if(!cliente.sexo || cliente.sexo =='') return 'Sexo Obrigatório';
            if(!cliente.telefone || cliente.telefone =='') return 'Telefone Obrigatório';
            if(cliente.tipoTelefoneId == null) return 'Tipo de Telefone Obrigatório';
        } else {
            return 'Dados de Cliente incorreto';
        }


        return null!;
    }

}