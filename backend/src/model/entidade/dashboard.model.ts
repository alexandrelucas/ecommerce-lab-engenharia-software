import EntidadeDominio from "./entidadeDominio.model";

export default class Dashboard extends EntidadeDominio {
    categoria?: any[];
    dataFim?: string;
    dataInicio?: string;
    pais?: any[];
    tempoGuarda?: any[];
    tipo?: any[];
    filtro?: boolean;
}