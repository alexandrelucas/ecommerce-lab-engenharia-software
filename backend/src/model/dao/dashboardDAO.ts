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

        // query = 'SELECT COUNT(*) FROM vendas;';
        query = 'SELECT SUM(quantidade) FROM vendas INNER JOIN "pedidosProdutos" ON "pedidosProdutos"."pedidoId" = vendas."pedidoId";';
        let numVendas = (await PgDatabase.query(query)).rows[0].sum;

        
        // query = `SELECT COUNT(*) FROM vendas 
        // INNER JOIN pedidos ON pedidos.id = vendas."pedidoId" 
        // WHERE pedidos.data > now() - interval '30' day;`;
        query = `
        SELECT SUM(quantidade) FROM vendas 
        INNER JOIN "pedidosProdutos" 
        ON "pedidosProdutos"."pedidoId" = vendas."pedidoId"
        INNER JOIN pedidos ON vendas."pedidoId" = pedidos.id
        WHERE pedidos.data > now() - interval '30' day;
        `;
        
        let numVendasMes = (await PgDatabase.query(query)).rows[0].sum;

        query = 'SELECT SUM(valor * 0.1) FROM vendas;';
        let receitaVendas = (await PgDatabase.query(query)).rows[0].sum;
        
        query = `SELECT SUM(valor * 0.25) FROM vendas INNER JOIN pedidos ON pedidos.id = vendas."pedidoId" WHERE pedidos.data > now() - interval '30' day;`;
        let receitaVendasMes = (await PgDatabase.query(query)).rows[0].sum;

        objetoFinal.totalPedidos = parseInt(numPedidos);
        objetoFinal.totalPedidosConcluidos = parseInt(numPedidosConcluidos);
        objetoFinal.numeroVendas = parseInt(numVendas);
        objetoFinal.numeroVendasMes = parseInt(numVendasMes);
        objetoFinal.receitaVendas = parseFloat(receitaVendas ?? 0.0);
        objetoFinal.receitaVendasMes = parseFloat(receitaVendasMes ?? 0.0);
        objetoFinal.lucros = (receitaVendas * 0.32);
        objetoFinal.lucrosMes = receitaVendasMes * 0.32;
        return objetoFinal as EntidadeDominio;
    }

    async consultarComFiltro(entidade: any): Promise<any> {
        if(this.validateFiltro(entidade)) {
            let dataInicio = new Date(entidade.dataInicio);
            let dataFim = new Date(entidade.dataFim);
            let query; 
            let queryData;
            let selectedDate: any;
            let fluxoData = this.validaDatas(dataInicio, dataFim);

            let listaPaises: any[] = entidade.pais;
            let listaTipos: any[] = entidade.tipo;
            let listaTempoGuarda: any[] = entidade.tempoGuarda;
            let listaCategoria: any[] = entidade.categoria;
            
            let filtroPais = listaPaises.map( (v, index) => (index != 0 ? 'OR' : 'AND (') + ` produtos."paisId" = '${v}' ` + (index == listaPaises.length - 1 ? ')' : '')).reduce( (accum, curr) => accum + curr , '');
            let filtroTipo = listaTipos.map( (v, index ) => (index != 0 ? 'OR' : 'AND (') + ` produtos."tipo" = '${v}' ` + (index == listaTipos.length - 1 ? ')' : '')).reduce( (accum, curr) => accum + curr ,'');
            let filtroTempoGuarda = listaTempoGuarda.map( (v, index) => (index != 0 ? 'OR' : 'AND (') + ` produtos."tempoGuarda" = '${v}' ` + (index == listaTempoGuarda.length - 1 ? ')' : '')).reduce( (accum, curr) => accum + curr ,'');
            let filtroCategoria = listaCategoria.map( (v, index) => (index != 0 ? 'OR' : 'AND (') + ` produtos."categoriaId" = '${v}' ` + (index == listaCategoria.length - 1 ? ')' : '')).reduce( (accum, curr) => accum + curr ,'');
            

            

            switch(fluxoData) {
                case 1:
                    queryData = `DATE_PART('day', pedidos.data) AS dia`;
                    selectedDate = 'dia';
                    break;
                case 2:
                    queryData = `DATE_PART('month', pedidos.data) AS mes`;
                    selectedDate = 'mes';
                    break;
                case 3:
                    queryData = `DATE_PART('year', pedidos.data) AS ano`;
                    selectedDate = 'ano';
                    break;
                default:
                    queryData = `DATE_PART('day', pedidos.data) AS dia`;
                    selectedDate = 'dia'; 
                    break;

            }
                
            let queryTest = 
                `SELECT pais.descricao as "pais", ${queryData},
                to_char(pedidos.data, 'DD/TMMonth/YYYY') AS completo,
                SUM("pedidosProdutos".quantidade) AS total
                FROM "pedidosProdutos"
                INNER JOIN produtos ON "pedidosProdutos"."produtoId" = produtos.id
                INNER JOIN pedidos ON "pedidosProdutos"."pedidoId" = pedidos.id
                INNER JOIN categorias ON produtos."categoriaId" = categorias.id
                INNER JOIN pais ON produtos."paisId" = pais.id
                INNER JOIN vendas ON pedidos.id = vendas."pedidoId"
                WHERE vendas."pedidoId" = pedidos.id ${ fluxoData != -1 ? `AND (pedidos.data BETWEEN '${entidade.dataInicio}' AND '${entidade.dataFim}')` : ''} 
                ${filtroPais} ${filtroTipo} ${filtroCategoria} ${filtroTempoGuarda}
                GROUP BY ${selectedDate}, pais, completo
                ORDER BY ${selectedDate}, pais`;

                console.log(queryTest);

                let consulta = fluxoData != -1 ?  await PgDatabase.query(queryTest) : await PgDatabase.query(queryTest);


                const grupos = consulta.rows.reduce((groups, item) => {

                    const dateType = item[selectedDate];
                    const group = (groups[dateType] || []);
                    group.push(item);
                    groups[dateType] = group;
                    return groups;
                  }, {});

                return grupos;
        } else {
            return {error: 'Faltando dados do input'} as EntidadeDominio;   
        }
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