import express from 'express';
import fachada from '../instanciaFachada';
import Estoque from '../model/entidade/estoque.model';

const EstoqueRouter = express.Router();

// Consulta todos os produtos no estoque
EstoqueRouter.get('/', async (req, res) => {
    try {
        let produtos = await fachada.consultar(new Estoque()) as Array<Estoque>;
        res.status(200).json({status: 0, message: 'OK', produtos});
    } catch(e: any) {
        res.status(500).json({
            status: -1,
            message: e.toString(),
        })
    }
});

// Cadastra um novo produto no estoque
EstoqueRouter.post('/', async (req, res) => {
    try {
        let produto = Object.assign(new Estoque(), req.body);
        let msg = await fachada.cadastrar(produto);
        res.status(200).json({status: msg ? 1:0, message: msg ?? 'OK'});
    } catch(e: any) {
        res.status(500).json({
            status: -1,
            message: e.toString()
        });
    }
});

// Dar baixa no estoque
EstoqueRouter.put('/:produtoId', async (req, res) => {
    try {
        let produtoId = parseInt(req.params.produtoId);
        let produto = Object.assign(new Estoque(null!, produtoId), req.body);
        let msg = await fachada.alterar(produto);
        res.status(200).json({status: msg ? 1:0, message: msg ?? 'OK'});
    } catch(e: any) {
        res.status(500).json({
            status: -1,
            message: e.toString()
        });
    }
});

// Exclui um produto do estoque
EstoqueRouter.delete('/:id', async (req, res) => {
    try {
        let produto = new Estoque();
        produto.id = parseInt(req.params.id);
        let msg = await fachada.excluir(produto);
        res.status(200).json({status: msg ? 1:0, message: msg ?? 'OK'});
    } catch(e: any) {
        res.status(500).json({
            status: -1,
            message: e.toString()
        });
    }
});

// Consulta um produto especifico pelo id
EstoqueRouter.get('/:produtoId', async (req, res) => {
    try {
        let id = Number.parseInt(req.params.produtoId);
        let produto = (await fachada.consultar(new Estoque(null!, id)) as Array<Estoque>)[0];
        res.status(produto ? 200 : 404).json({status: produto ? 0 : 1, message: produto ? 'OK' : 'Este produto não consta no estoque.', produto});
    } catch(e: any) {
        res.status(500).json({
            status: -1,
            message: e.toString(),
        })
    }
});

export default EstoqueRouter;