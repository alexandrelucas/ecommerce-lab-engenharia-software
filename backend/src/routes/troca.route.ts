import express from 'express';
import fachada from '../instanciaFachada';
import CupomCliente from '../model/entidade/cupomCliente.model';
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

TrocaRouter.post('/gerarCupom', async (req, res) => {
    try {
        let cupom = Object.assign(new CupomCliente(), req.body);
        let msg = await fachada.cadastrar(cupom);
        res.status(200).json({status: msg ? 1:0, message: msg ?? 'OK'});
    } catch(e: any) {
        res.status(500).json({
            status: -1,
            message: e.toString()
        });
    }
});


export default TrocaRouter;