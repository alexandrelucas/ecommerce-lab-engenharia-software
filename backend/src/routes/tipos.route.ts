import express from 'express';
import fachada from '../instanciaFachada';
import TipoEndereco from '../model/entidade/tipoEndereco';
import TipoLogradouro from '../model/entidade/tipoLogradouro';
import TipoResidencia from '../model/entidade/tipoResidencia';
import TipoTelefone from '../model/entidade/tipoTelefone';

const TipoRouter = express.Router();

// Lista os tipos de logradouro
TipoRouter.get('/logradouro', async (req, res) => {
    try {
        let tipoLogradouro = await fachada.consultar(new TipoLogradouro()) as Array<TipoLogradouro>;
        res.status(200).json({status: 0, message: 'OK', tipoLogradouro});
    } catch(e: any) {
        res.status(500).json({
            status: -1,
            message: e.toString(),
        })
    }
});

// Lista os tipos de endereco
TipoRouter.get('/endereco', async (req, res) => {
    try {
        let tipoEndereco = await fachada.consultar(new TipoEndereco()) as Array<TipoEndereco>;
        res.status(200).json({status: 0, message: 'OK', tipoEndereco});
    } catch(e: any) {
        res.status(500).json({
            status: -1,
            message: e.toString(),
        })
    }
});

// Lista os tipos de residencia
TipoRouter.get('/residencia', async (req, res) => {
    try {
        let tipoResidencia = await fachada.consultar(new TipoResidencia()) as Array<TipoResidencia>;
        res.status(200).json({status: 0, message: 'OK', tipoResidencia});
    } catch(e: any) {
        res.status(500).json({
            status: -1,
            message: e.toString(),
        })
    }
});

// Lista os tipos de telefone
TipoRouter.get('/telefone', async (req, res) => {
    try {
        let tipoTelefone = await fachada.consultar(new TipoTelefone()) as Array<TipoTelefone>;
        res.status(200).json({status: 0, message: 'OK', tipoTelefone});
    } catch(e: any) {
        res.status(500).json({
            status: -1,
            message: e.toString(),
        })
    }
});

export default TipoRouter;