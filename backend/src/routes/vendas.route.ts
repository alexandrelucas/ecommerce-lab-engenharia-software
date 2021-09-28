import express from 'express';
import fachada from '../instanciaFachada';
import Venda from '../model/entidade/venda.model';

const VendaRouter = express.Router();


export default VendaRouter;

VendaRouter.get('/todos', async (req, res) => {
    try {
        let vendas = (await fachada.consultar(new Venda()) as Array<Venda>);
        res.status(vendas ? 200 : 404).json({status: vendas ? 0 : 1, message: vendas ? 'OK' : 'Este pedido não existe', vendas});
    } catch(e: any) {
        res.status(500).json({
            status: -1,
            message: e.toString(),
        })
    }
});

// Autoriza o cartao de credito
VendaRouter.post('/autorizar', async (req, res) => {
    try {
        let autorizarVenda = Object.assign(new Venda(), req.body);
        let msg = await fachada.cadastrar(autorizarVenda);
        res.status(200).json({status: msg ? 1:0, message: msg ?? 'OK'});
    } catch(e: any) {
        res.status(500).json({
            status: -1,
            message: e.toString()
        });
    }
});