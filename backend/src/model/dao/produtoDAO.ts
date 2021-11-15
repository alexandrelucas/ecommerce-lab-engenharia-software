import PgDatabase from "../../db.config";
import EntidadeDominio from "../entidade/entidadeDominio.model";
import Estoque from "../entidade/estoque.model";
import Produto from "../entidade/produto.model";
import EstoqueDAO from "./estoqueDAO";
import IDAO from "./IDAO";

export default class ProdutoDAO implements IDAO {
    tabela: string = 'produtos';
    
    async salvar(entidade: EntidadeDominio): Promise<EntidadeDominio> {
        if(entidade.hasId()) return null!;
        try {            
            delete entidade.id;
            let colunas = Object.keys(entidade).map((e) => `"${e}"`).reduce((prev, cur) => `${prev} , ${cur}`);
            let valores = Object.values(entidade).map((v) => `'${v}'`).reduce((prev, cur) => `${prev} , ${cur}`);
            
            let query = `INSERT INTO ${this.tabela} (${colunas}) VALUES (${valores}) RETURNING id`;
            let id = await PgDatabase.query(query);
            entidade.id = id.rows[0].id;
            return entidade;
            
        } catch (err: any) {
            return {error: 'ProdutoDAO.salvar(): ' + err.toString()} as EntidadeDominio;
        }
    }
    
    async alterar(entidade: EntidadeDominio): Promise<EntidadeDominio> {
        if(!entidade.hasId()) return null!;        

        let dadosSQL = Object.entries(entidade).map((key, value) => {
            return `"${key[0]}" = '${key[1]}'`;
        }).reduce((pVal, cVal) => {
            return `${pVal} , ${cVal}`;
        });

        try {
            let query = PgDatabase.query(`UPDATE ${this.tabela} SET ${dadosSQL} WHERE id = ${entidade.id}`);
            return entidade;
            
        } catch (err: any) {
            return {error: 'ProdutoDAO.alterar(): ' + err.toString()} as EntidadeDominio;
        }
    }
    
    async excluir(entidade: EntidadeDominio): Promise<boolean> {
        if(entidade.hasId()) {
            let produto = await PgDatabase.query(`DELETE FROM ${this.tabela} WHERE id = ${entidade.id}`);
            if(produto.rowCount == 1) {
                return true;
            }
        }
        return false;
    }
    
    async consultar(entidade: EntidadeDominio): Promise<EntidadeDominio[]> {
        let id = (entidade as Produto).id;
        let produtoCodigo = (entidade as Produto).codigo!;

        let estoque = new EstoqueDAO();

        let query;
        if(id) {
            query = `SELECT * FROM ${this.tabela} WHERE id = '${id}'`;
        }
        else if(produtoCodigo){
            query = `SELECT * FROM ${this.tabela} WHERE codigo = '${produtoCodigo}'`; 
        }else{
            query = 
            `SELECT produtos.id, codigo, titulo, descricao, imagem, 
            "precoDe", "precoPor", "quantidadeML", "tempoGuarda",
            "teorAlcoolico", tipo, peso, comprimento, altura, largura, diametro, formato, "paisId", "categoriaId", inativado, "motivoInativo", ("inativado" IS NOT NULL) as "onEstoque"
            FROM produtos 
            LEFT OUTER JOIN estoque ON estoque."produtoId" = produtos.id;`;
        }

        let produtos = PgDatabase.query(query);
        let result:Array<EntidadeDominio> = (await produtos).rows;
        return result ?? [];
    }

}