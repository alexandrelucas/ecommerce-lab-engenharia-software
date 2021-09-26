import Cartao from "../../entidade/cartao.model";
import entidadeDominioModel from "../../entidade/entidadeDominio.model";
import IStrategy from "../IStrategy";

export default class ValidarCartao implements IStrategy {
    
    cards: IBandeira = {
        visa: /^4[0-9]{12}(?:[0-9]{3})/,
        mastercard: /^5[1-5][0-9]{14}/,
        // diners: /^3(?:0[0-5]|[68][0-9])[0-9]{11}/,
        // amex: /^3[47][0-9]{13}/,
        // hipercard: /^(606282\d{10}(\d{3})?)|(3841\d{15})/,
        // elo: /^((((636368)|(438935)|(504175)|(451416)|(636297))\d{0,10})|((5067)|(4576)|(4011))\d{0,12})/
    };
    
    async processar(entidade: entidadeDominioModel, altera: boolean): Promise<string> {
        if(entidade.constructor.name == 'Cartao') {
            let cartao = entidade as Cartao;

            if(!cartao.cvv || cartao.cvv == '') return 'Código de segurança obrigatório';
            if(!cartao.dataValidade) return 'Data de validade obrigatória';
            if(!cartao.numero || cartao.numero == '') return 'Número do cartão obrigatório';
            if(!cartao.titular || cartao.titular == '') return 'Nome do titular do cartão obrigatório';

            if((cartao.cvv.length < 3 || cartao.cvv.length > 4)) return 'Código de segurança inválido';
            if(!this.getCardFlag(cartao.numero)) return 'Cartão inválido';
        } else {
            return 'Dados de cartão incorreto.'
        }
        return null!;
    }

    getCardFlag(cardnumber: string){
        let newCard = cardnumber.replace(/[^0-9]+/g, '');
        for (let flag in this.cards) {
            if(this.cards[flag].test(newCard)) {
                return flag;
            }
        }
    
        return false;
      }

}

interface IBandeira {
    [bandeira: string]: RegExp;
}