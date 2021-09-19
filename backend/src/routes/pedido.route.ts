import express from 'express';
import fachada from '../instanciaFachada';

const PedidoRouter = express.Router();

// Consulta pedido
PedidoRouter.get('/:id', async (req, res) => {
    let codigo = req.query.codigo;    
});

// Lista todos os pedidos do cliente
PedidoRouter.get('/todos/:clienteId', async (req, res) => {
    res.send({message: 'OK'})
});

// realiza um pedido
PedidoRouter.post('/', async (req, res) => {
    res.send({message: 'Pedido realizado com sucesso!'})
});

// Altera pedido
PedidoRouter.put('/:id', async (req, res) => {
    res.send({message: 'Pedido alterado com sucesso!'})
});

// Cancela pedido
PedidoRouter.put('/:id/cancel', async (req, res) => {
    res.send({message: 'pedido cancelado com sucesso!'})
});

export default PedidoRouter;