export default class EntidadeDominio {
    id?: number;
    dataCadastro?: Date;
    error?: string;

    hasId(): boolean {
        return (this.id != undefined || this.id != null);
    }

    hasError(): boolean {
        return (this.error != undefined || this.error != null);
    }
}