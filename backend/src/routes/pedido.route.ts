import express from 'express';
import fachada from '../instanciaFachada';
import Pedido from '../model/entidade/pedido.model';
import PedidoProduto from '../model/entidade/pedidoProduto.model';

const PedidoRouter = express.Router();

// Lista todos os pedidos do sistema
PedidoRouter.get('/todos', async (req, res) => { 
    try {
        let pedidos = (await fachada.consultar(new Pedido()) as Array<Pedido>);
        res.status(pedidos ? 200 : 404).json({status: pedidos ? 0 : 1, message: pedidos ? 'OK' : 'Este pedido não existe', pedidos});
    } catch(e: any) {
        res.status(500).json({
            status: -1,
            message: e.toString(),
        })
    }
});

// Consulta pedido pelo Id
PedidoRouter.get('/:id', async (req, res) => {
    try {
        let id = Number.parseInt(req.params.id);
        let pedido = (await fachada.consultar(new Pedido(id)) as Array<Pedido>)[0];
        res.status(pedido ? 200 : 404).json({status: pedido ? 0 : 1, message: pedido ? 'OK' : 'Este pedido não existe', pedido});
    } catch(e: any) {
        res.status(500).json({
            status: -1,
            message: e.toString(),
        })
    }
});

// Lista todos os pedidos do cliente
PedidoRouter.get('/cliente/:clienteId', async (req, res) => {
    try {
        let clienteId = Number.parseInt(req.params.clienteId);
        let pedidos = (await fachada.consultar(new Pedido(null!, clienteId)) as Array<Pedido>);
        res.status(pedidos ? 200 : 404).json({status: pedidos ? 0 : 1, message: pedidos ? 'OK' : 'Nenhum pedido encontrado', pedidos});
    } catch(e: any) {
        res.status(500).json({
            status: -1,
            message: e.toString(),
        })
    }
});

// realiza um pedido
PedidoRouter.post('/', async (req, res) => {
    try {
        let pedido = Object.assign(new Pedido(), req.body);
        let msg = await fachada.cadastrar(pedido);
        res.status(200).json({status: msg ? 1:0, message: msg ?? 'OK'});
    } catch(e: any) {
        res.status(500).json({
            status: -1,
            message: e.toString()
        });
    }
});

// FAZER DEPOIS ABAIXO

// Altera pedido
PedidoRouter.put('/:id', async (req, res) => {
    try {
        let pedidoId = parseInt(req.params.id);
        let pedido = Object.assign(new Pedido(pedidoId), req.body);
        let msg = await fachada.alterar(pedido);
        res.status(200).json({status: msg ? 1:0, message: msg ?? 'OK'});
    } catch(e: any) {
        res.status(500).json({
            status: -1,
            message: e.toString()
        });
    }
});

PedidoRouter.put('/:id/produto/:pid', async (req, res) => {
    try {
        let pedidoId = parseInt(req.params.id);
        let produtoId = parseInt(req.params.pid);

        let produtoInfo = {
            'pedidoId': pedidoId,
            'status': req.body.status,
            'produtoId': produtoId,
        };

        let pedido = Object.assign(new PedidoProduto(), produtoInfo);
        let msg = await fachada.alterar(pedido);

        res.status(200).json({status: msg ? 1:0, message: msg ?? 'OK'});
    } catch(e: any) {
        res.status(500).json({
            status: -1,
            message: e.toString()
        });
    }
});

// Cancela pedido
PedidoRouter.put('/:id/cancel', async (req, res) => {
    try {
        let pedidoId = parseInt(req.params.id);
        let pedido = Object.assign(new Pedido(pedidoId), req.body);
        let msg = await fachada.alterar(pedido);
        res.status(200).json({status: msg ? 1:0, message: msg ?? 'OK'});
    } catch(e: any) {
        res.status(500).json({
            status: -1,
            message: e.toString()
        });
    }
});

export default PedidoRouter;