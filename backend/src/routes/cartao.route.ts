import express from 'express';
import fachada from '../instanciaFachada';
import Cartao from '../model/entidade/cartao.model';

const CartaoRouter = express.Router();

CartaoRouter.get('/:id/cartoes', async (req, res) => {
    try {
        let clienteId = parseInt(req.params.id);
        let cartao = (await fachada.consultar(new Cartao(null!, clienteId))) as Cartao[];
        res.status(200).json({status: 0, message: 'OK', cartao});
    } catch(e: any) {
        res.status(500).json({
            status: -1,
            message: e.toString()
        });
    }
});

// Criar novo cartao
CartaoRouter.post('/:id/cartoes', async (req, res) => {
    try {
        let clienteId = parseInt(req.params.id);
        let cartao = Object.assign(new Cartao(null!, clienteId), req.body);
        let msg = await fachada.cadastrar(cartao);

        let status = Number.parseInt(msg);

        res.status(200).json({status: status ? 1:0, message: msg ?? 'OK'});
    } catch(e: any) {
        res.status(500).json({
            status: -1,
            message: e.toString()
        });
    }
    
});

// Altera o cartão de crédito do cliente
CartaoRouter.put('/cartoes/:id', async (req, res) => {
    try {
        let id = parseInt(req.params.id);
        let cartao = Object.assign(new Cartao(id), req.body);
        let msg = await fachada.alterar(cartao);
        res.status(200).json({status: msg ? 1:0, message: msg ?? 'OK'});
    } catch(e: any) {
        res.status(500).json({
            status: -1,
            message: e.toString()
        });
    }
});

// Excluir o cartão do cliente
CartaoRouter.delete('/cartoes/:id', async (req, res) => {
    try {
        let cartao = new Cartao();
        cartao.id = parseInt(req.params.id);
        let msg = await fachada.excluir(cartao);
        res.status(200).json({status: msg ? 1:0, message: msg ?? 'OK'});
    } catch(e: any) {
        res.status(500).json({
            status: -1,
            message: e.toString()
        });
    }
    
});

export default CartaoRouter;