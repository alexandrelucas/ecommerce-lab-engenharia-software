import express from 'express';
import fachada from '../instanciaFachada';
import Pais from '../model/entidade/pais.model';

const PaisRouter = express.Router();

// Lista os paises
PaisRouter.get('/', async (req, res) => {
    try {
        let paises = await fachada.consultar(new Pais()) as Array<Pais>;
        res.status(200).json({status: 0, message: 'OK', paises});
    } catch(e: any) {
        res.status(500).json({
            status: -1,
            message: e.toString(),
        })
    }
});

PaisRouter.get('/consulta', async (req, res) => {
    let sigla = req.query.sigla;
    try {
        let pais = (await fachada.consultar(new Pais(null!, sigla?.toString())) as Array<Pais>)[0];
        res.status(200).json({status: 0, message: 'OK', pais});
    } catch(e: any) {
        res.status(500).json({
            status: -1,
            message: e.toString(),
        })
    }
});

// Cria um novo pais
PaisRouter.post('/', async (req, res) => {
    try {
        let pais = Object.assign(new Pais(), req.body);
        let msg = await fachada.cadastrar(pais);
        res.status(200).json({status: msg ? 1:0, message: msg ?? 'OK'});
    } catch(e: any) {
        res.status(500).json({
            status: -1,
            message: e.toString()
        });
    }
    
});

// Altera o pais existente
PaisRouter.put('/:id', async (req, res) => {
    try {
        let id = parseInt(req.params.id);
        let pais = Object.assign(new Pais(id), req.body);
        let msg = await fachada.alterar(pais) ?? 'OK';
        res.status(200).json({status: msg ? 1:0, message: msg ?? 'OK'});
    } catch(e: any) {
        res.status(500).json({
            status: -1,
            message: e.toString()
        });
    }
});

// Excluir o pais
PaisRouter.delete('/:id', async (req, res) => {
    try {
        let pais = new Pais();
        pais.id = parseInt(req.params.id);
        let msg = await fachada.excluir(pais);
        res.status(200).json({status: msg ? 1:0, message: msg ?? 'OK'});
    } catch(e: any) {
        res.status(500).json({
            status: -1,
            message: e.toString()
        });
    }
    
});

export default PaisRouter;