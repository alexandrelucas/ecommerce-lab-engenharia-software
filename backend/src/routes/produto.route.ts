import express from 'express';
import fachada from '../instanciaFachada';
import Produto from '../model/entidade/produto.model';
import CategoriaRouter from './categorias.route';

const ProdutoRouter = express.Router();
ProdutoRouter.use('/categoria', CategoriaRouter);

// Consulta todos os produtos
ProdutoRouter.get('/', async (req, res) => {
    try {
        let produtos = await fachada.consultar(new Produto()) as Array<Produto>;
        res.status(200).json({status: 0, message: 'OK', produtos});
    } catch(e: any) {
        res.status(500).json({
            status: -1,
            message: e.toString(),
        })
    }
});

// Cadastra um novo produto
ProdutoRouter.post('/', async (req, res) => {
    try {
        let produto = Object.assign(new Produto(), req.body);
        let msg = await fachada.cadastrar(produto);
        res.status(200).json({status: msg ? 1:0, message: msg ?? 'OK'});
    } catch(e: any) {
        res.status(500).json({
            status: -1,
            message: e.toString()
        });
    }
});

// Altera um produto
ProdutoRouter.put('/:id', async (req, res) => {
    try {
        let id = parseInt(req.params.id);
        let produto = Object.assign(new Produto(id), req.body);
        let msg = await fachada.alterar(produto) ?? 'OK';
        res.status(200).json({status: msg ? 1:0, message: msg ?? 'OK'});
    } catch(e: any) {
        res.status(500).json({
            status: -1,
            message: e.toString()
        });
    }
});

// Exclui um produto
ProdutoRouter.delete('/:id', async (req, res) => {
    try {
        let produto = new Produto();
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
ProdutoRouter.get('/:id', async (req, res) => {
    try {
        let id = Number.parseInt(req.params.id);
        let produto = (await fachada.consultar(new Produto(id)) as Array<Produto>)[0];
        res.status(produto ? 200 : 404).json({status: produto ? 0 : 1, message: produto ? 'OK' : 'Este produto não existe', produto});
    } catch(e: any) {
        res.status(500).json({
            status: -1,
            message: e.toString(),
        })
    }
});

export default ProdutoRouter;