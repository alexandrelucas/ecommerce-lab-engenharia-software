import Cliente from "../../entidade/cliente.model";
import entidadeDominioModel from "../../entidade/entidadeDominio.model";
import IStrategy from "../IStrategy";

export default class ValidarCPF implements IStrategy {
    processar(entidade: entidadeDominioModel): string {

        if(entidade.constructor.name == 'Cliente') {
            let cliente = entidade as Cliente;
            if(!this.validarCPF(cliente.cpf)) {
                return 'CPF Inválido';
            }
        } else {
            return 'Dados de Cliente incorreto';
        }

        return null!;
    }

    private validarCPF(cpf: string){
        let soma = 0;
        let resto;
        let cpfLimpo = cpf.replace(/[^\d]/g, "");
    
        if(cpfLimpo == '00000000000') return false;
        for(let i=1; i<=9; i++) soma = soma + parseInt(cpfLimpo.substring(i-1, i)) * (11 - i);
        resto = (soma * 10) % 11;
    
        if((resto == 10) || (resto == 11)) resto = 0;
        if(resto != parseInt(cpfLimpo.substring(9, 10))) return false;
    
        soma = 0;
        for(let i = 1; i <= 10; i++) soma = soma + parseInt(cpfLimpo.substring(i-1, i))*(12-i);
        resto = (soma * 10) % 11;
    
        if((resto == 10) || (resto == 11)) resto = 0;
        if(resto != parseInt(cpfLimpo.substring(10, 11))) return false;
        return true;
    }

}