import express from 'express';
import fachada from '../instanciaFachada';
import Endereco from '../model/entidade/endereco.model';

const EnderecoRouter = express.Router();

/* ##### ENDEREÇO #####  */
//Consultar endereços por Id cliente
EnderecoRouter.get('/:id/endereco', async (req, res) => {
    try {
        let clienteId = parseInt(req.params.id);
        let endereco = (await fachada.consultar(new Endereco(null!, clienteId))) as Endereco[];
        res.status(200).json({status: 1, message: 'OK', endereco});
    } catch(e: any) {
        res.status(500).json({
            status: -1,
            message: e.toString()
        });
    }
    
});

// Criar novo endereço
EnderecoRouter.post('/:id/endereco', async (req, res) => {
    try {
        let clienteId = parseInt(req.params.id);
        let endereco = Object.assign(new Endereco(null!, clienteId), req.body);
        let msg = await fachada.cadastrar(endereco) ?? 'OK';
        console.log(msg);
        res.status(200).json({status: msg ? 0:1, message: msg});
    } catch(e: any) {
        res.status(500).json({
            status: -1,
            message: e.toString()
        });
    }
});

// Altera o endereço do cliente
EnderecoRouter.put('/endereco/:id', async (req, res) => {
    try {
        let id = parseInt(req.params.id);
        let endereco = Object.assign(new Endereco(id), req.body);
        let msg = await fachada.alterar(endereco) ?? 'OK';
        res.status(200).json({status: msg ? 0:1, message: msg});
    } catch(e: any) {
        res.status(500).json({
            status: -1,
            message: e.toString()
        });
    }
    
});

// Excluir o endereço do cliente
EnderecoRouter.delete('/endereco/:id', async (req, res) => {
    try {
        let endereco = new Endereco();
        endereco.id = parseInt(req.params.id);
        res.status(200).json({status: 1, message: await fachada.excluir(endereco)});
    } catch(e: any) {
        res.status(500).json({
            status: -1,
            message: e.toString()
        });
    }
    
});


export default EnderecoRouter;