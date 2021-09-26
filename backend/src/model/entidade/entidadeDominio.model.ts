export default class EntidadeDominio {
    id?: number;
    dataCadastro?: Date;
    error?: string;

    public hasId(): boolean {
        return (this.id != undefined || this.id != null);
    }

    public hasError(): boolean {
        return (this.error != undefined || this.error != null);
    }
}