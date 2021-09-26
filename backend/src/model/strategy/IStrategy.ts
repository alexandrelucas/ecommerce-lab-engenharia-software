import EntidadeDominio from "../entidade/entidadeDominio.model";

export default interface IStrategy {
    processar(entidade: EntidadeDominio, altera: boolean) : Promise<string>;
}