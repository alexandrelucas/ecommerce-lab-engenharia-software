import PgDatabase from "../../db.config";
import EntidadeDominio from "../entidade/entidadeDominio.model";
import IDAO from "./IDAO";

export default class DashboardDAO implements IDAO {
    tabela: string = '';
    async salvar(entidade: EntidadeDominio): Promise<EntidadeDominio> {
        throw new Error('Nao implementado');
    }
    async alterar(entidade: EntidadeDominio): Promise<EntidadeDominio> {
        throw new Error("Method not implemented.");
    }
    async excluir(entidade: EntidadeDominio): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    async consultar(entidade: any): Promise<any[]> {
        let objetoFinal = entidade.filtro ? this.consultarComFiltro(entidade) : this.consultarSemFiltro(entidade);
        return [await objetoFinal] as EntidadeDominio[];
    }


    async consultarSemFiltro(entidade: any): Promise<any> {
        let objetoFinal:any = {};
        let query = 'SELECT COUNT(*) FROM pedidos;';
        let numPedidos = (await PgDatabase.query(query)).rows[0].count;

        query = 'SELECT COUNT(*) FROM pedidos WHERE status >= 4 AND status <= 9;';
        let numPedidosConcluidos = (await (await PgDatabase.query(query)).rows[0].count);

        query = 'SELECT COUNT(*) FROM vendas;';
        let numVendas = (await PgDatabase.query(query)).rows[0].count;

        query = 'SELECT SUM(valor) FROM vendas;';
        let receitaVendas = (await PgDatabase.query(query)).rows[0].sum;

        objetoFinal.totalPedidos = parseInt(numPedidos);
        objetoFinal.totalPedidosConcluidos = parseInt(numPedidosConcluidos);
        objetoFinal.numeroVendas = parseInt(numVendas);
        objetoFinal.numeroVendasMes = '-';
        objetoFinal.receitaVendas = parseInt(receitaVendas ?? 0);
        objetoFinal.receitaVendasMes = '-';
        objetoFinal.lucros = (receitaVendas * 0.32);
        objetoFinal.lucrosMes = '-';
        return objetoFinal as EntidadeDominio;
    }

    async consultarComFiltro(entidade: any): Promise<any> {
        return {error: 'Teste'} as EntidadeDominio;   
    }

}