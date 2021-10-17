import express from 'express';
import fachada from '../instanciaFachada';
import Pedido from '../model/entidade/pedido.model';
import PedidoProduto from '../model/entidade/pedidoProduto.model';

const TrocaRouter = express.Router();

// Lista todos os pedidos do sistema
TrocaRouter.get('/todos', async (req, res) => { 
    try {
        let produtos = (await fachada.consultar(new PedidoProduto()) as Array<PedidoProduto>);
        res.status(produtos ? 200 : 404).json({status: produtos ? 0 : 1, message: produtos ? 'OK' : 'Erro na listagem', produtos});
    } catch(e: any) {
        res.status(500).json({
            status: -1,
            message: e.toString(),
        })
    }
});


export default TrocaRouter;