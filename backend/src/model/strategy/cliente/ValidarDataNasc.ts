import Cliente from "../../entidade/cliente.model";
import entidadeDominioModel from "../../entidade/entidadeDominio.model";
import IStrategy from "../IStrategy";

export default class ValidarDataNasc implements IStrategy {
    processar(entidade: entidadeDominioModel): string {
        if(entidade.constructor.name == 'Cliente') {
            let cliente = entidade as Cliente;

            if(cliente.dataNasc == undefined) return 'Data de nascimento obrigatório';
            let date = this.stringToDate(cliente.dataNasc.toString(), 'dd/MM/yyyy', '/');
            let currentDate = new Date();
            let age = currentDate.getFullYear() - date.getFullYear();
            
            if(age < 18) {
                return 'Idade mínima de 18 anos';
            }
        }
        return null!;
    }

    private stringToDate(_date: any,_format: any,_delimiter: any)
    {
        let formatLowerCase=_format.toLowerCase();
        let formatItems=formatLowerCase.split(_delimiter);
        let dateItems=_date.split(_delimiter);
        let monthIndex=formatItems.indexOf("mm");
        let dayIndex=formatItems.indexOf("dd");
        let yearIndex=formatItems.indexOf("yyyy");
        let month=parseInt(dateItems[monthIndex]);
        month-=1;
        var formatedDate = new Date(dateItems[yearIndex],month,dateItems[dayIndex]);
        return formatedDate;
    }



}