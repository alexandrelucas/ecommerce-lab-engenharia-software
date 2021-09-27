import { KeyPairSyncResult } from "crypto";
import Categoria from "./categoria.model";
import EntidadeDominio from "./entidadeDominio.model";

export default class Produto extends EntidadeDominio {
    codigo?: string;
    titulo?: string;
    descricao?: string;
    imagem?: string;
    precoDe?: number;
    precoPor?: number;
    quantidadeML?: number;
    tempoGuarda?: number;
    teorAlcoolico?: number;
    paisId?: number;
    peso?: number;
    comprimento?: number;
    largura?: number;
    diametro?: number;
    formato?: string;
    categoriaId?: number;
    tipo?: string;

    constructor(id: number = null!) {
       super();
       this.id = id; 
    }
}