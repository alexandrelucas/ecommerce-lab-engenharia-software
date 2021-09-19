export default class EntidadeDominio {
    id?: number;
    dataCadastro?: Date;

    hasId(): boolean {
        return (this.id != undefined || this.id != null);
    }
}