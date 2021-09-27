export default class EntidadeDominio {
    id?: number;
    dataCadastro?: Date;
    error?: string;

    public hasId(): boolean {
        return (this.id != undefined || this.id != null);
    }
}