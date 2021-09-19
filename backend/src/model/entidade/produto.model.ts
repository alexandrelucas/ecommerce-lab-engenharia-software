import { KeyPairSyncResult } from "crypto";
import Categoria from "./categoria.model";
import EntidadeDominio from "./entidadeDominio.model";
import Pais from "./pais.model";

export default class Produto extends EntidadeDominio {
    codigo?: string;
    titulo?: string;
    descricao?: string;
    imagem?: string;
    precoDe?: number;
    precoPor?: number;
    quantidadeML?: number;
    tempoGuarda?: number;
    categoria?: Categoria;
    teorAlcoolico?: number;
    pais?: Pais;
    peso?: number;
    comprimento?: number;
    largura?: number;
    diametro?: number;
    formato?: string;
}