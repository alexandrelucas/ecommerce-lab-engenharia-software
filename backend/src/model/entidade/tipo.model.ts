export default class Tipo {
    id?: number;
    descricao?: String;

    hasId(): boolean {
        return (this.id != undefined || this.id != null);
    }
}