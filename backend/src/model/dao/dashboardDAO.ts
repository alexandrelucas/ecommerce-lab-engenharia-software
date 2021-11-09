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
        console.log(entidade);
        if(this.validateFiltro(entidade)) {
            let dataInicio = new Date(entidade.dataInicio);
            let dataFim = new Date(entidade.dataFim);
            let query; 
            let fluxoData = this.validaDatas(dataInicio, dataFim);

            let listaPaises: any[] = entidade.pais;
            let listaTipos: any[] = entidade.tipo;
            let listaTempoGuarda: any[] = entidade.tempoGuarda;
            let listaCategoria: any[] = entidade.categoria;
            
            let filtroPais = listaPaises.map( (v, index) => (index != 0 ? 'OR' : 'AND') + ` produtos."paisId" = '${v}' `).reduce( (accum, curr) => accum + curr , '');
            let filtroTipo = listaTipos.map( (v, index ) => (index != 0 ? 'OR' : 'AND') + ` produtos."tipo" = '${v}' `).reduce( (accum, curr) => accum + curr ,'');
            let filtroTempoGuarda = listaTempoGuarda.map( (v, index) => (index != 0 ? 'OR' : 'AND') + ` produtos."tempoGuarda" = '${v}' `).reduce( (accum, curr) => accum + curr ,'');
            let filtroCategoria = listaCategoria.map( (v, index) => (index != 0 ? 'OR' : 'AND') + ` produtos."categoriaId" = '${v}' `).reduce( (accum, curr) => accum + curr ,'');
            
            switch(fluxoData) {
                case 1:
                    query = 
                    `SELECT produtos.id, produtos.titulo, DATE_PART('day', pedidos.data) AS dia,
                     to_char(pedidos.data, 'DD/TMMonth/YYYY') AS completo, categorias.descricao,
                     SUM("pedidosProdutos".quantidade) AS total 
                     FROM "pedidosProdutos" 
                     INNER JOIN produtos ON "pedidosProdutos"."produtoId" = produtos.id 
                     INNER JOIN pedidos ON "pedidosProdutos"."pedidoId" = pedidos.id 
                     INNER JOIN categorias ON produtos."categoriaId" = categorias.id 
                     WHERE pedidos.data between $1 and $2 ${filtroPais} ${filtroTipo} ${filtroCategoria} ${filtroTempoGuarda}
                     GROUP BY dia, completo, produtos.titulo, produtos.id, categorias.descricao 
                     ORDER BY dia, produtos.titulo`;
                     console.log(query);
                    break;
                case 2:
                    query = 
                    `SELECT produtos.id, produtos.titulo, DATE_PART('month', pedidos.data) AS mes,
                     to_char(pedidos.data, 'TMMonth/YYYY') AS completo, categorias.descricao, 
                     SUM("pedidosProdutos".quantidade) AS total 
                     FROM "pedidosProdutos" 
                     INNER JOIN produtos ON "pedidosProdutos"."produtoId" = produtos.id 
                     INNER JOIN pedidos ON "pedidosProdutos"."pedidoId" = pedidos.id 
                     INNER JOIN categorias ON produtos."categoriaId" = categorias.id 
                     WHERE pedidos.data between $1 and $2 ${filtroPais} ${filtroTipo} ${filtroCategoria} ${filtroTempoGuarda}
                     GROUP BY mes, completo, produtos.titulo, produtos.id, categorias.descricao 
                     ORDER BY mes, produtos.titulo`;
                    break;
                case 3:
                    query = 
                    `SELECT produtos.id, produtos.titulo, DATE_PART('year', pedidos.data) AS completo,
                     categorias.descricao, SUM("pedidosProdutos".quantidade) AS total 
                     FROM "pedidosProdutos" 
                     INNER JOIN produtos ON "pedidosProdutos"."produtoId" = produtos.id 
                     INNER JOIN pedidos ON "pedidosProdutos"."pedidoId" = pedidos.id 
                     INNER JOIN categorias ON produtos."categoriaId" = categorias.id 
                     WHERE pedidos.data between $1 and $2 ${filtroPais} ${filtroTipo} ${filtroCategoria} ${filtroTempoGuarda}
                     GROUP BY completo, produtos.titulo, produtos.id, categorias.descricao 
                     ORDER BY completo, produtos.titulo`;
                    break;
                default:
                    query = 
                    `SELECT produtos.id, produtos.titulo, DATE_PART('month', pedidos.data) AS mes,
                    to_char(pedidos.data, 'TMMonth/YYYY') AS completo, categorias.descricao, SUM("pedidosProdutos".quantidade) AS total 
                    FROM "pedidosProdutos"
                    INNER JOIN produtos ON "pedidosProdutos"."produtoId" = produtos.id 
                    INNER JOIN pedidos ON "pedidosProdutos"."pedidoId" = pedidos.id 
                    INNER JOIN categorias ON produtos."categoriaId" = categorias.id
                    GROUP BY mes, completo, produtos.titulo, produtos.id, categorias.descricao 
                    ORDER BY mes, produtos.titulo`;
                        break;

                    }
                let consulta = fluxoData != -1 ?  await PgDatabase.query(query, [entidade.dataInicio, entidade.dataFim]) : await PgDatabase.query(query);
                return {resultado: consulta.rows};
        } else {
            return {error: 'Faltando dados do input'} as EntidadeDominio;   
        }
        return {error: 'Teste'} as EntidadeDominio;   
    }


    checkData(di: Date, df: Date) : boolean {
        if((di < df) && (df <= new Date())) return true;
        return false;
    }

    validaDatas(dataI: Date, dataF: Date) {

        if(isNaN(dataI.getTime()) || isNaN(dataF.getTime())) {
            return -1;
        }

        if (dataI.getFullYear() == dataF.getFullYear() && dataI.getUTCMonth() == dataF.getUTCMonth()) {
            //pegar dias 
            return 1;
        } else if (dataI.getFullYear() == dataF.getFullYear() && dataI.getUTCMonth() != dataF.getUTCMonth()) {
            //pegar mês
            return 2;
        } else {
            //pegar ano
            return 3
        }
    }

    validateFiltro(entidade: any) {
        if(!entidade.pais && !entidade.categoria && !entidade.tempoGuarda && !entidade.tipo && !entidade.dataInicio && !entidade.dataFim)
        return false;
        return true;
    }

}