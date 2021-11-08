import express from 'express';
import fachada from '../instanciaFachada';
import Dashboard from '../model/entidade/dashboard.model';

const DashboardRouter = express.Router();

// Consulta todos os produtos no estoque
DashboardRouter.get('/', async (req, res) => {
    try {
        let result = await fachada.consultar(new Dashboard()) as Array<Dashboard>;
        res.status(200).json({status: 0, message: 'OK', result: result[0]});
    } catch(e: any) {
        res.status(500).json({
            status: -1,
            message: e.toString(),
        })
    }
});


DashboardRouter.put('/filtro', async (req, res) => {
    try {
        let dados = Object.assign(new Dashboard(), req.body);
        dados.filtro = true;
        let result = await fachada.consultar(dados) as Dashboard[];
        res.status(200).json({status: 0, message: 'OK', result: result[0]});
    } catch(e: any) {
        res.status(500).json({
            status: -1,
            message: e.toString(),
        })
    }
});


export default DashboardRouter;