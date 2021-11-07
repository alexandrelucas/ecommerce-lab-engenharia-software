export class Carrinho {    
    id: number;
    codigo: string;
    titulo: string;
    imagem: string;    
    precoDe: number;
    precoPor: number;
    quantidadeML: number;      
    tempoGuarda: string;
    classificacao: string;
    tipo: string;
    teorAlcolico: number;    
    paisCodigo: string;
    pais: string;
    descricao: string;
    qtd: number;         
    status: number;
    infoEstoque: string;
    constructor(
        id?: number, 
        codigo?: string,
        titulo?: string, 
        imagem?: string, 
        precoDe?: number,
        precoPor?: number, 
        quantidadeML?: number, 
        tempoGuarda?: string,
        classificacao?: string,
        tipo?: string, 
        teorAlcolico?: number,
        paisCodigo?: string,
        pais?: string,
        descricao?: string, 
        qtd?: number,
        status?: number,
        infoEstoque?: string
        ) {
        this.id = id;        
        this.codigo = codigo;
        this.titulo = titulo;
        this.imagem = imagem;
        this.precoDe = precoDe;
        this.precoPor = precoPor;
        this.quantidadeML = quantidadeML;
        this.tempoGuarda = tempoGuarda;
        this.classificacao = classificacao;
        this.tipo = tipo;
        this.teorAlcolico = teorAlcolico;
        this.paisCodigo = paisCodigo;
        this.pais = pais;
        this.descricao = descricao;
        this.qtd = qtd;
        this.status = status;
        this.infoEstoque = infoEstoque;
    }
}