import express from 'express';
import fachada from '../instanciaFachada';
import Pedido from '../model/entidade/pedido.model';

const PedidoRouter = express.Router();

// Lista todos os pedidos do sistema
PedidoRouter.get('/todos', async (req, res) => {
    let codigo = req.query.codigo;   
    res.send('OK 2'); 
});

// Consulta pedido pelo Id
PedidoRouter.get('/:id', async (req, res) => {
    let codigo = req.query.codigo;   
    res.send('OK'); 
});

// Lista todos os pedidos do cliente
PedidoRouter.get('/cliente/:clienteId', async (req, res) => {
    res.send({message: 'OK'})
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