import express from 'express';
import fachada from '../instanciaFachada';
import Cartao from '../model/entidade/cartao.model';

const CartaoRouter = express.Router();

CartaoRouter.get('/:id/cartoes', async (req, res) => {
    let clienteId = parseInt(req.params.id);
    let cartao = (await fachada.consultar(new Cartao(null!, clienteId))) as Cartao[];
    res.json({status: 1, message: 'OK', cartao});
});

// Criar novo cartao
CartaoRouter.post('/:id/cartoes', async (req, res) => {
    let clienteId = parseInt(req.params.id);
    let cartao = Object.assign(new Cartao(null!, clienteId), req.body);
    let msg = await fachada.cadastrar(cartao) ?? 'OK';
    res.json({status: msg ? 0:1, message: msg});
});

// Altera o cartão de crédito do cliente
CartaoRouter.put('/cartoes/:id', async (req, res) => {
    let id = parseInt(req.params.id);
    let cartao = Object.assign(new Cartao(id), req.body);
    let msg = await fachada.alterar(cartao) ?? 'OK';
    res.json({status: msg ? 0:1, message: msg});
});

// Excluir o cartão do cliente
CartaoRouter.delete('/cartoes/:id', async (req, res) => {
    let cartao = new Cartao();
    cartao.id = parseInt(req.params.id);
    res.json({status: 1, message: await fachada.excluir(cartao)});
});

export default CartaoRouter;