import { Cartao } from "./cartao.model";
import { Endereco } from "./endereco.model";

export class Cliente {
    id?: string;    
    nome?: string;
    dataNasc?: string;
    cpf?: string;
    email?: string;
    senha?: string;
    confirmaSenha?: string;       
    tipoTelefoneId?: string;    
    telefone?: string;
    sexo?: string;
    inativado?: boolean;
    classificacao?: number;
    endereco?: Endereco[];
    cartao?: Cartao[];
}