import EntidadeDominio from "../model/entidade/entidadeDominio.model";

export default interface IFachada {
    cadastrar(entidade: EntidadeDominio) :  Promise<string>;
    alterar(entidade: EntidadeDominio) :  Promise<string>;
    excluir(entidade: EntidadeDominio) : Promise<string>;
    consultar(entidade: EntidadeDominio) : Promise<EntidadeDominio[]>;
}