import EntidadeDominio  from "../entidade/entidadeDominio.model";

export default interface IDAO {
    tabela: string;

    salvar(entidade: EntidadeDominio) : Promise<EntidadeDominio>;
    alterar(entidade: EntidadeDominio) : Promise<EntidadeDominio>;
    excluir(entidade: EntidadeDominio) : Promise<boolean>;
    consultar(entidade: EntidadeDominio) : Promise<Array<EntidadeDominio>>;
}