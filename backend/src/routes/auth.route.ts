import express from 'express';
import Cliente from '../model/entidade/cliente.model';
import fachada from '../instanciaFachada';

const AuthRouter = express.Router();

AuthRouter.post('/', async (req, res) => {
    try {
        let cliente: Cliente = Object.assign(new Cliente(), req.body);
        let resultado = await fachada.login(cliente);
        res.status(200).json({status: resultado ? 1:0, message: resultado ? 'Autenticado com sucesso!' : 'Erro ao autenticar', result: resultado});
    } catch(e: any) {
        res.status(500).json({
            status: -1,
            message: e.toString()
        });
    }
});

export default AuthRouter;