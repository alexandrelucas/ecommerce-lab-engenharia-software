import express from 'express';
import fachada from '../instanciaFachada';
import Categoria from '../model/entidade/categoria.model';
import Produto from '../model/entidade/produto.model';

const CategoriaRouter = express.Router();

// Consulta todas as categorias

CategoriaRouter.get('/', async (req, res) => {
    try {
        let categorias = await fachada.consultar(new Categoria()) as Array<Categoria>;
        res.status(200).json({status: 0, message: 'OK', categorias});
    } catch(e: any) {
        res.status(500).json({
            status: -1,
            message: e.toString(),
        })
    }
});

// Cadastra um nova categoria de produto
CategoriaRouter.post('/', async (req, res) => {
    try {
        let categoria = Object.assign(new Categoria(), req.body);
        let msg = await fachada.cadastrar(categoria);
        res.status(200).json({status: msg ? 1:0, message: msg ?? 'OK'});
    } catch(e: any) {
        res.status(500).json({
            status: -1,
            message: e.toString()
        });
    }
});

// Altera uma categoria de produto
CategoriaRouter.put('/:id', async (req, res) => {
    try {
        let id = parseInt(req.params.id);
        let categoria = Object.assign(new Categoria(id), req.body);
        let msg = await fachada.alterar(categoria) ?? 'OK';
        res.status(200).json({status: msg ? 1:0, message: msg ?? 'OK'});
    } catch(e: any) {
        res.status(500).json({
            status: -1,
            message: e.toString()
        });
    }
});

// Exclui uma categoria de produto
CategoriaRouter.delete('/:id', async (req, res) => {
    try {
        let categoria = new Categoria(parseInt(req.params.id));
        let msg = await fachada.excluir(categoria);
        res.status(200).json({status: msg ? 1:0, message: msg ?? 'OK'});
    } catch(e: any) {
        res.status(500).json({
            status: -1,
            message: e.toString()
        });
    }
});

// Consulta uma categoria especifica pelo id
CategoriaRouter.get('/:id', async (req, res) => {
    try {
        let id = Number.parseInt(req.params.id);
        let categoria = (await fachada.consultar(new Categoria(id)) as Array<Categoria>)[0];
        res.status(categoria ? 200 : 404).json({status: categoria ? 0 : 1, message: categoria ? 'OK' : 'Esta categoria de produto não existe', categoria});
    } catch(e: any) {
        res.status(500).json({
            status: -1,
            message: e.toString(),
        })
    }
});

export default CategoriaRouter;